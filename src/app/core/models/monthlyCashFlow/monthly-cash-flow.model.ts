import { BehaviorSubject, NEVER, ReplaySubject } from "rxjs";
import { catchError } from "rxjs/operators";
import { ChartDataInterface } from "../../interfaces/chart-data.interface";
import { MonthlyCashFlowInterface } from "../../interfaces/monthly-cash-flow.interface";
import { CashFlowService } from "../../services/cashFlow/cash-flow.service";

export class MonthlyCashFlowModel {

  private salesLastMonth = 0;

  private reportLastMonth: ChartDataInterface['series'] = [];

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

  public $reportLastWeek: BehaviorSubject<{report: ChartDataInterface['series'], sales: number}>
    = new BehaviorSubject<{report: ChartDataInterface['series'], sales: number}>({report: [], sales: 0});

  constructor(
    private cashFlowService: CashFlowService,
    public currentDay: number,
    private monthlyCashFlowData: MonthlyCashFlowInterface,
  ) {
    this.cashFlowService.$onLastWeek.pipe(catchError(() => NEVER)).subscribe(day => {
      const days: string[] = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
      this.$salesLastWeek.next(this.salesLastWeek + day.sales);
      this.salesLastWeek = this.salesLastWeek + day.sales;
      this.$reportLastWeek.next({
        report: [
          ...this.$reportLastWeek.value.report,
          {
            name: days[day.dayWeek],
            value: day.sales
          }
        ],
        sales: this.salesLastWeek + day.sales
      });
    });
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

  get lastMonth(): Promise<{report: ChartDataInterface['series'], sales: number}> {
    const lastDay = new Date(this.year, this.month - 1, 0).getDate();
    return new Promise<{report: ChartDataInterface['series'], sales: number}>((res, rej) => {
      this.cashFlowService.$onLastMonth(`${this.year}-${this.month < 10 ? `0${this.month}` : this.month}`, lastDay)
        .subscribe({
          next: day => {
            this.salesLastMonth = this.salesLastMonth + day.sales;
            this.reportLastMonth = [
              ...this.reportLastMonth,
              {
                name: day.day.toString(),
                value: day.sales
              }
            ];
          },
          error: error => rej(error),
          complete: () => res({report: this.reportLastMonth, sales: this.salesLastMonth})
        });
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
