import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subscription, Observable, Subject, interval } from 'rxjs';
import { debounceTime, switchMap, take, tap } from 'rxjs/operators';
import { DailyCashFlowModel } from 'src/app/core/models/dailyCashFlow/daily-cash-flow.model';
import { MoneyPipe } from 'src/app/shared/pipes/money/money.pipe';
import { NumberPipe } from 'src/app/shared/pipes/number/number.pipe';

@Component({
  selector: 'app-day-box-dash',
  templateUrl: './day-box-dash.component.html',
  styleUrls: ['./day-box-dash.component.scss']
})
export class DayBoxDashComponent implements OnInit, OnDestroy {

  @Input()
  set day(day: DailyCashFlowModel | null) {
    this._day = day;
    if (day) {
      this.$day.next(day)
      this.dayForm.patchValue({
        sales: this.moneyPipe.transform(day.sales.toString()),
        toStrongBox: this.moneyPipe.transform(day.toStrongBox.toString()),
        toBanks: this.moneyPipe.transform(day.toBanks.toString()),
        newConsumtions: day.newConsumtions,
        incidents: this.moneyPipe.transform(day.incidents.toString()),
        personalSpending: this.moneyPipe.transform(day.personalSpending.toString())
      }, { emitEvent: false });
    };
  }
  get day(): DailyCashFlowModel | null{
    return this._day;
  }

  private subscriptions: Subscription[] = [];

  private _day!: DailyCashFlowModel | null;

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

  public daysWeek: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  public $day: ReplaySubject<DailyCashFlowModel> = new ReplaySubject<DailyCashFlowModel>(1);

  public dayForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private moneyPipe: MoneyPipe,
    private numberPipe: NumberPipe
  ) {
    this.buildForm();
    this.subscriptions.push(
      this.$onFormChanges.subscribe()
    );
  }

  private buildForm(): void {
    this.dayForm = this.formBuilder.group({
      sales: [''],
      toStrongBox: [''],
      toBanks: [''],
      newConsumtions: [0],
      incidents: [''],
      personalSpending: ['']
    });
  }

  private get $onFormChanges(): Observable<any> {
    return this.dayForm.valueChanges.pipe(
      tap(form => {
        this.dayForm.patchValue({
          sales: form.sales ? this.moneyPipe.transform(form.sales) : '',
          toStrongBox: form.toStrongBox ? this.moneyPipe.transform(form.toStrongBox) : '',
          toBanks: form.toBanks ? this.moneyPipe.transform(form.toBanks) : '',
          incidents: form.incidents ? this.moneyPipe.transform(form.incidents) : '',
          personalSpending: form.personalSpending ? this.moneyPipe.transform(form.personalSpending) : ''
        }, { emitEvent: false });
        if (this.day) {
          this.day.sales = this.numberPipe.transform(form.sales);
          this.day.toStrongBox = this.numberPipe.transform(form.toStrongBox);
          this.day.toBanks = this.numberPipe.transform(form.toBanks);
          this.day.newConsumtions = form.newConsumtions;
          this.day.incidents = this.numberPipe.transform(form.incidents);
          this.day.personalSpending = this.numberPipe.transform(form.personalSpending);
        }
      }),
      debounceTime(1400),
      tap(() => { if (this.day) this.day.submitDay() })
    )
  }

  ngOnInit(): void {
  }

  nextDay(event: Event): void {
    event.preventDefault();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

}
