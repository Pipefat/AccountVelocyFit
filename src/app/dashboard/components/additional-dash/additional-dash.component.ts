import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { skip, take, tap } from 'rxjs/operators';
import { MonthlyCashFlowModel } from 'src/app/core/models/monthlyCashFlow/monthly-cash-flow.model';
import { MoneyPipe } from 'src/app/shared/pipes/money/money.pipe';
import { NumberPipe } from 'src/app/shared/pipes/number/number.pipe';

@Component({
  selector: 'app-additional-dash',
  templateUrl: './additional-dash.component.html',
  styleUrls: ['./additional-dash.component.scss']
})
export class AdditionalDashComponent implements OnInit, OnDestroy {

  @Input()
  set month(month: MonthlyCashFlowModel | null) {
    this._month = month;
    this.additionalIncome.patchValue('', {emitEvent: false});
    this.personalSpending.patchValue('', {emitEvent: false});
    this.incidents.patchValue('', {emitEvent: false});
    if (month) {
      month.$salesLastWeek.pipe(skip(6), take(1)).subscribe(() => this.$month.next(month));
    }
  }
  get month(): MonthlyCashFlowModel | null {
    return this._month;
  }

  private subscriptions: Subscription[] = [];

  private _month!: MonthlyCashFlowModel | null;

  public additionalIncome: FormControl = new FormControl('');

  public personalSpending: FormControl = new FormControl('');

  public incidents: FormControl = new FormControl('');

  public months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  public $month: ReplaySubject<MonthlyCashFlowModel> = new ReplaySubject<MonthlyCashFlowModel>(1);

  constructor(
    private moneyPipe: MoneyPipe,
    private numberPipe: NumberPipe
  ) {
    this.subscriptions.push(
      this.$onAdditionalIncomeChanges.subscribe(),
      this.$onPersonalSpendingChanges.subscribe(),
      this.$onIncidentsChanges.subscribe()
    );
  }

  private get $onAdditionalIncomeChanges(): Observable<any> {
    return this.additionalIncome.valueChanges.pipe(
      tap(value => {
        this.additionalIncome.patchValue(this.moneyPipe.transform(value), {emitEvent: false});
        if (this.month) this.month.addAdditionalIncome = this.numberPipe.transform(value);
      })
    )
  }

  private get $onPersonalSpendingChanges(): Observable<any> {
    return this.personalSpending.valueChanges.pipe(
      tap(value => {
        this.personalSpending.patchValue(this.moneyPipe.transform(value), {emitEvent: false});
        if (this.month) this.month.addPersonalSpending = this.numberPipe.transform(value);
      })
    )
  }

  private get $onIncidentsChanges(): Observable<any> {
    return this.incidents.valueChanges.pipe(
      tap(value => {
        this.incidents.patchValue(this.moneyPipe.transform(value), {emitEvent: false});
        if (this.month) this.month.addIncidents = this.numberPipe.transform(value);
      })
    )
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

}
