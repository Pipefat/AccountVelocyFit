import { BehaviorSubject, NEVER, Observable, ReplaySubject } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";
import { BoxData } from "../../interfaces/box-data";
import { ChartDataInterface } from "../../interfaces/chart-data.interface";
import { MonthlyCashFlowInterface } from "../../interfaces/monthly-cash-flow.interface";
import { CashFlowService } from "../../services/cashFlow/cash-flow.service";
import { DailyCashFlowModel } from "../dailyCashFlow/daily-cash-flow.model";

export class MonthlyCashFlowModel {

  private months: string[] = [
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

  private monthsRes: string[] = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ];

  public feForResults: number = this.monthlyCashFlowData['fe-forResults'];

  public feForUtility: number = this.monthlyCashFlowData['fe-forUtility'];

  public operatingExpenses: number = this.monthlyCashFlowData['operating-expenses'];

  public sales: number = this.monthlyCashFlowData['sales'];

  public year: number = Math.trunc(this.id / -100);

  public month: number = (this.id * -1) - (Math.trunc(this.id / -100) * 100);

  public lastDay: number = new Date(this.year, this.month, 0).getDate();

  public additionalIncome: number = this.monthlyCashFlowData["additional-income"];

  public incidents: number = this.monthlyCashFlowData['incidents'];

  public personalSpending: number = this.monthlyCashFlowData['personal-spending'];

  public $salesLastWeek: ReplaySubject<number> = new ReplaySubject<number>(7);
  private salesLastWeek = 0;

  public $reportLastWeek: ReplaySubject<BoxData>
    = new ReplaySubject<BoxData>(1);

  constructor(
    private cashFlowService: CashFlowService,
    private currentDay: number,
    private monthlyCashFlowData: MonthlyCashFlowInterface,
  ) {
    this.$onLastWeek.subscribe();
  }

  get id(): number {
    return this.monthlyCashFlowData['month-code'];
  }

  get utility(): number {
    const forecastSales = (this.sales + ((this.salesLastWeek / 7) * (this.lastDay - this.currentDay)));
    const forecastExpenses = ((this.operatingExpenses / this.currentDay) * this.lastDay);
    return (forecastSales * 0.4) - forecastExpenses - this.feForUtility;
  }

  get results(): number {
    const forecastSales = (this.sales + ((this.salesLastWeek / 7) * (this.lastDay - this.currentDay)));
    const forecastExpenses = ((this.operatingExpenses / this.currentDay) * this.lastDay);
    return (forecastSales * 0.4) - forecastExpenses - this.feForResults + this.additionalIncome - this.incidents;
  }

  get profits(): number {
    return this.utility + this.additionalIncome - this.incidents - this.personalSpending
  }

  get $onLastWeek(): Observable<DailyCashFlowModel> {
    const firstDayWeek = new Date(this.year, this.month - 1, this.currentDay - 8);
    const lastDayWeek = new Date(this.year, this.month - 1, this.currentDay - 1);
    const sameMonth = firstDayWeek.getMonth() === lastDayWeek.getMonth();
    const names = ['Ventas', 'Gastos'];
    let report: ChartDataInterface['series'][] = [[], []];
    let consumtions: number = 0;
    return this.cashFlowService.$onLastWeek.pipe(
      catchError(() => NEVER),
      tap(day => {
        const days: string[] = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        const values = [day.sales, day.expenses];
        report = report.map((val, i) => [
          ...val,
          {
            name: days[day.dayWeek],
            value: values[i]
          }
        ]);
        consumtions = consumtions + day.newConsumtions;
        this.$salesLastWeek.next(this.salesLastWeek + day.sales);
        this.salesLastWeek = this.salesLastWeek + day.sales;
      }),
      finalize(() => this.$reportLastWeek.next({
        sales: this.salesLastWeek,
        consumtions: consumtions,
        report: report.map((val, i) => ({
          name: `${names[i]} del ${firstDayWeek.getDate()} ${sameMonth ? '' : `de ${this.months[firstDayWeek.getMonth()]}`} al ${lastDayWeek.getDate()} de ${this.months[lastDayWeek.getMonth()]}`,
          series: val
        }))
      }))
    )
  }

  get reportMonth(): Promise<BoxData> {
    const names = ['Ventas', 'Gastos'];
    let reportLastMonth: ChartDataInterface['series'][] = [[], []];
    let consumtions: number = 0;
    return new Promise<BoxData>((res, rej) => {
      this.cashFlowService.$onReportMonth(`${this.year}-${this.month < 10 ? `0${this.month}` : this.month}`, this.currentDay)
        .subscribe({
          next: day => {
            const values = [day.sales, day.expenses];
            reportLastMonth = reportLastMonth.map((val, i) => [
              ...val,
              {
                name: day.day.toString(),
                value: values[i]
              }
            ]);
            consumtions = consumtions + day.newConsumtions;
          },
          error: error => rej(error),
          complete: () => res({
            sales: this.sales,
            consumtions: consumtions,
            report: reportLastMonth.map((val, i) => ({
              name: `${names[i]} de ${this.months[this.month - 1]}`,
              series: val
            }))
          })
        });
    });
  }

  get reportSemiAnnual(): Promise<BoxData> {
    const names: string[] = ['Ventas', 'Utilidad', 'Ganancias', 'Resultados'];
    let reportSemiAnnual: ChartDataInterface['series'][] =[[], [], [], []];
    let totals: number[] = [0, 0, 0, 0];
    return new Promise<BoxData>((res, rej) => {
      this.cashFlowService.$onReportSemiAnnual(this.year, this.month)
        .subscribe({
          next: month => {
            const values = [month.sales, month.utility, month.profits, month.results]
            reportSemiAnnual = reportSemiAnnual.map((val, i) => [
              ...val,
              {
                name: this.monthsRes[month.month - 1],
                value: values[i]
              }
            ]);
            totals = totals.map((val, i) => val + values[i])
          },
          error: error => rej(error),
          complete: () => res({
            sales: totals[0],
            utility: totals[1],
            profits: totals[2],
            results: totals[3],
            report: reportSemiAnnual.map((val, i) => ({
              name: names[i],
              series: val
            }))
          })
        })
    });
  }

  set addAdditionalIncome(value: number){
    this.additionalIncome = this.monthlyCashFlowData['additional-income'] + value;
  }

  submitAdditionalIncome() {
    const keyMonth = `${this.year}-${this.month < 10 ? `0${this.month}` : this.month}`;
    const value: Partial<MonthlyCashFlowInterface> = {
      'additional-income': this.additionalIncome
    };
    if (this.additionalIncome !== this.monthlyCashFlowData["additional-income"]) {
      this.cashFlowService.updateMonthlyCashFlow(keyMonth, value)
    };
  }

  set addIncidents(value: number){
    this.incidents = this.monthlyCashFlowData['incidents'] + value;
  }

  submitIncidents() {
    const keyMonth = `${this.year}-${this.month < 10 ? `0${this.month}` : this.month}`;
    const value: Partial<MonthlyCashFlowInterface> = {
      'incidents': this.incidents
    };
    if (this.incidents !== this.monthlyCashFlowData.incidents) {
      this.cashFlowService.updateMonthlyCashFlow(keyMonth, value)
    };
  }

  set addPersonalSpending(value: number){
    this.personalSpending = this.monthlyCashFlowData['personal-spending'] + value;
  }

  submitPersonalSpending() {
    const keyMonth = `${this.year}-${this.month < 10 ? `0${this.month}` : this.month}`;
    const value: Partial<MonthlyCashFlowInterface> = {
      'personal-spending': this.personalSpending
    };
    if (this.personalSpending !== this.monthlyCashFlowData["personal-spending"]) {
      this.cashFlowService.updateMonthlyCashFlow(keyMonth, value)
    };
  }

}
