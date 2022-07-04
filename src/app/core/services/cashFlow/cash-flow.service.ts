import { Injectable } from '@angular/core';
import {
  child,
  Database,
  endAt,
  equalTo,
  limitToFirst,
  limitToLast,
  onChildAdded,
  onValue,
  orderByChild,
  orderByKey,
  query,
  ref,
  startAt,
  Unsubscribe,
  update,
} from '@angular/fire/database';
import { Observable, ReplaySubject, Subscriber } from 'rxjs';
import { finalize, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { MonthlyCashFlowInterface } from '../../interfaces/monthly-cash-flow.interface';
import { DailyCashFlowModel } from '../../models/dailyCashFlow/daily-cash-flow.model';
import { MonthlyCashFlowModel } from '../../models/monthlyCashFlow/monthly-cash-flow.model';
import { DailyCashFlowInterface } from './../../interfaces/daily-cash-flow.interface';

@Injectable({
  providedIn: 'root'
})
export class CashFlowService {

  private $daySubject: ReplaySubject<string> = new ReplaySubject<string>(1);

  private $currentDay: Observable<DailyCashFlowModel> = this.$daySubject.pipe(
    switchMap(lastDay => this.$onNewDay(lastDay))
  );

  public $currentMonth: Observable<MonthlyCashFlowModel> = this.$currentDay.pipe(
    switchMap(day => this.$onMonth(day.idMonth, day.day)),
    tap(month => this.month = month)
  );

  public month!: MonthlyCashFlowModel | null;

  constructor(
    private database: Database
  ) { }

  public $onDay(daycode?: number): Observable<DailyCashFlowModel> {
    let unsubscribe: Unsubscribe = () => {};
    return new Observable<DailyCashFlowModel>((observer) => {
      unsubscribe = onValue(
        query(
          ref(this.database, 'daily-cash-flow'),
          orderByChild('day-code'),
          daycode ? equalTo(daycode) : limitToFirst(1)
        ),
        snapshot => {
          if (snapshot.hasChildren()) {
            const dayData: DailyCashFlowInterface = snapshot.val()[Object.keys(snapshot.val())[0]]
            observer.next(new DailyCashFlowModel(this, dayData));
            if (!daycode) this.$daySubject.next(Object.keys(snapshot.val())[0]);
          } else {
            observer.error(new Error(
              daycode ? `No hay datos en daily-cash-flow con un day-code igual a ${ daycode }`
              : 'No se encontró el primer día en daily-cash-flow'
            ))
          }
        },
        error => observer.error(error)
      );
    }).pipe(
      tap({ error: this.handleError }),
      finalize(unsubscribe)
    );
  }

  public get $onLastWeek(): Observable<DailyCashFlowModel> {
    let unsubscribe: Unsubscribe = () => {};
    return new Observable<DailyCashFlowModel>((observer) => {
      unsubscribe = onChildAdded(
        query(ref(this.database, 'daily-cash-flow'), orderByKey(), limitToLast(8)),
        snapshot => {
          if (snapshot.exists()) {
            const dayWeek: DailyCashFlowInterface = snapshot.val();
            observer.next(new DailyCashFlowModel(this, dayWeek));
          } else {
            observer.error(new Error('No se encontró información en un día de $onWeekDay'));
          }
        },
        error => observer.error(error)
      );
    }).pipe(
      take(7),
      tap({ error: this.handleError }),
      finalize(unsubscribe)
    );
  }

  public $onLastMonth(keyMonth: string, lastDay: number): Observable<DailyCashFlowModel> {
    let unsubscribe: Unsubscribe = () => {};
    return new Observable<DailyCashFlowModel>((observer) => {
      unsubscribe = onChildAdded(
        query(
          ref(this.database, 'daily-cash-flow'),
          orderByKey(),
          startAt(`${keyMonth}-01`),
          endAt(`${keyMonth}-${lastDay}`)
        ),
        snapshot => {
          if (snapshot.exists()) {
            const day: DailyCashFlowInterface = snapshot.val();
            observer.next(new DailyCashFlowModel(this, day));
          } else {
            observer.error(new Error('No se encontró información en un día de $onLastMonth'));
          }
        },
        error => observer.error(error)
      );
    }).pipe(
      take(lastDay),
      tap({ error: this.handleError }),
      finalize(unsubscribe)
    );
  }

  public updateCashFlow(value: { [id: string]: DailyCashFlowInterface | MonthlyCashFlowInterface | null }): void {
    update(ref(this.database), value)
      .then(() => {}, error => this.handleError(error))
      .catch(error => this.handleError(error));
  }

  public updateMonthlyCashFlow(keyMonth: string, value: Partial<MonthlyCashFlowInterface>): void {
    update(child(ref(this.database, 'monthly-cash-flow'), keyMonth), value)
      .then(() => {}, error => this.handleError(error))
      .catch(error => this.handleError(error));
  }

  private $onNewDay(lastDay: string): Observable<DailyCashFlowModel> {
    let unsubscribe: Unsubscribe = () => {};
    return new Observable<DailyCashFlowModel>((observer) => {
      unsubscribe = onChildAdded(
        query(ref(this.database, 'daily-cash-flow'), orderByKey(), startAt(lastDay)),
        snapshot => {
          if (snapshot.exists()) {
            const lastDay: DailyCashFlowInterface = snapshot.val();
            observer.next(new DailyCashFlowModel(this, lastDay));
          } else {
            observer.error(new Error('No se encontró información en $onNewDay'));
          }
        },
        error => observer.error(error)
      );
    }).pipe(
      tap({ error: this.handleError }),
      finalize(unsubscribe)
    );
  }

  private $onMonth(idMonth: number, lastDay: number): Observable<MonthlyCashFlowModel> {
    let unsubscribe: Unsubscribe = () => {};
    return new Observable<MonthlyCashFlowModel>((observer) => {
      unsubscribe = onValue(
        query(ref(this.database, 'monthly-cash-flow'), orderByChild('month-code'), equalTo(idMonth)),
        snapshot => {
          if (snapshot.hasChildren()) {
            const monthData: MonthlyCashFlowInterface = snapshot.val()[Object.keys(snapshot.val())[0]];
            const month = new MonthlyCashFlowModel(this, lastDay, monthData);
            observer.next(month);
          } else {
            observer.error(new Error(`No se encontró información para el mes ${idMonth}`));
          }
        },
        error => observer.error(error)
      );
    }).pipe(
      tap({ error: this.handleError }),
      finalize(unsubscribe)
    );
  }

  private handleError(error: Error, observer?: Subscriber<any>): void {
    if (!environment.production) {
      console.log({error: error});
    }
    if (observer) {
      observer.error(error);
    }
  }

}
