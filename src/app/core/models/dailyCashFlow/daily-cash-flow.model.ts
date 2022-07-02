import { DailyCashFlowInterface } from '../../interfaces/daily-cash-flow.interface';
import { MonthlyCashFlowInterface } from '../../interfaces/monthly-cash-flow.interface';
import { CashFlowService } from '../../services/cashFlow/cash-flow.service';


export class DailyCashFlowModel {

  public day: number = parseInt((this.dailyCashFlowData["day-code"] * -1).toString().slice(6, 8));

  public month: number = (this.idMonth * -1) - (Math.trunc(this.idMonth / -100) * 100);

  public year: number = Math.trunc(this.idMonth / -100);

  public sales: number = this.dailyCashFlowData.sales;

  public dayWeek: number;

  public toStrongBox: number = this.dailyCashFlowData['to-strong-box'];

  public toBanks: number = this.dailyCashFlowData['to-banks'];

  public newConsumtions: number = this.dailyCashFlowData['new-consumtions'];

  public incidents: number = this.dailyCashFlowData['incidents'];

  public personalSpending: number = this.dailyCashFlowData['personal-spending'];

  constructor(
    private cashFlowService: CashFlowService,
    private dailyCashFlowData: DailyCashFlowInterface
  ) {
    this.dayWeek = new Date(this.year, this.month - 1, this.day).getDay();
  }

  get id(): number {
    return this.dailyCashFlowData["day-code"];
  }

  get idMonth(): number {
    return Math.trunc(this.dailyCashFlowData["day-code"] / 100);
  }

  get expenses(): number {
    return this.sales - this.toStrongBox - this.toBanks - this.incidents - this.personalSpending;
  }

  get prevExpenses(): number {
    return this.dailyCashFlowData.sales
      - this.dailyCashFlowData['to-strong-box']
      - this.dailyCashFlowData['to-banks']
      - this.dailyCashFlowData.incidents
      - this.dailyCashFlowData['personal-spending'];
  }

  submitDay(): void {
    const keyMonth = `${this.year}-${this.month < 10 ? `0${this.month}` : this.month}`;
    const keyDay = `${keyMonth}-${this.day < 10 ? `0${this.day}` : this.day}`;

    const updates: { [id: string]: DailyCashFlowInterface | MonthlyCashFlowInterface } = {};
    updates[`/daily-cash-flow/${keyDay}`] = {
      "day-code": this.id,
      "incidents": this.incidents,
      "new-consumtions": this.newConsumtions,
      "personal-spending": this.personalSpending,
      "sales": this.sales,
      "to-banks": this.toBanks,
      "to-strong-box": this.toStrongBox
    };
    if (this.cashFlowService.month) {
      updates[`/monthly-cash-flow/${keyMonth}`] = {
        "additional-income": this.cashFlowService.month.additionalIncome,
        "fe-forResults": this.cashFlowService.month.feForResults,
        "fe-forUtility": this.cashFlowService.month.feForUtility,
        "incidents": this.cashFlowService.month.incidents + (this.incidents - this.dailyCashFlowData.incidents),
        "month-code": this.cashFlowService.month.id,
        "operating-expenses": this.cashFlowService.month.operatingExpenses + (this.expenses - this.prevExpenses),
        "personal-spending": this.cashFlowService.month.personalSpending + (this.personalSpending - this.dailyCashFlowData['personal-spending']),
        "sales": this.cashFlowService.month.sales + (this.sales - this.dailyCashFlowData.sales)
      };
    }
    this.cashFlowService.updateCashFlow(updates);
  }

}
