import { BehaviorSubject, NEVER, ReplaySubject } from "rxjs";
import { catchError } from "rxjs/operators";
import { ChartDataInterface } from "../../interfaces/chart-data.interface";
import { MonthlyCashFlowInterface } from "../../interfaces/monthly-cash-flow.interface";
import { CashFlowService } from "../../services/cashFlow/cash-flow.service";

export class MonthlyCashFlowModel {

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

  public $reportLastWeek: BehaviorSubject<ChartDataInterface['series']> = new BehaviorSubject<ChartDataInterface['series']>([]);

  constructor(
    private cashFlowService: CashFlowService,
    private currentDay: number,
    private monthlyCashFlowData: MonthlyCashFlowInterface,
  ) {
    this.cashFlowService.$onLastWeek.pipe(catchError(() => NEVER)).subscribe(day => {
      const days: string[] = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
      this.$salesLastWeek.next(this.salesLastWeek + day.sales);
      this.salesLastWeek = this.salesLastWeek + day.sales;
      this.$reportLastWeek.next([
        ...this.$reportLastWeek.value,
        {
          name: days[day.dayWeek],
          value: day.sales
        }
      ]);
    })
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

}
