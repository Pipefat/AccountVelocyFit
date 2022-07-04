import { MonthlyCashFlowModel } from 'src/app/core/models/monthlyCashFlow/monthly-cash-flow.model';
import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { ChartDataInterface } from 'src/app/core/interfaces/chart-data.interface';

@Component({
  selector: 'app-reports-dash',
  templateUrl: './reports-dash.component.html',
  styleUrls: ['./reports-dash.component.scss']
})
export class ReportsDashComponent implements OnInit {

  @Input() set month(month: MonthlyCashFlowModel | null) {
    if (month) {
      const firstDayWeek = new Date(month.year, month.month - 1, month.currentDay - 8);
      const lastDayWeek = new Date(month.year, month.month - 1, month.currentDay - 1);
      const sameMonth = firstDayWeek.getMonth() === lastDayWeek.getMonth();
      month.$reportLastWeek.pipe(skip(6), take(1)).subscribe((lastWeek) => {
        this.$salesWeek.next(lastWeek.sales);
        this.$reportWeek.next({
          name: `Ventas del ${firstDayWeek.getDate()} ${sameMonth ? '' : `de ${this.months[firstDayWeek.getMonth()]}`} al ${lastDayWeek.getDate()} de ${this.months[lastDayWeek.getMonth()]}`,
          series: lastWeek.report
        })
      });
      month.lastMonth.then(lastMonth => {
        this.$salesMonth.next(lastMonth.sales);
        this.$reportMonth.next({name: `Ventas de ${this.months[month.month - 2]}`, series: lastMonth.report})
      })
    }
  }

  public $reportWeek: ReplaySubject<ChartDataInterface> = new ReplaySubject<ChartDataInterface>(1);
  public $salesWeek: ReplaySubject<number> = new ReplaySubject<number>(1);

  public $reportMonth: ReplaySubject<ChartDataInterface> = new ReplaySubject<ChartDataInterface>(1);
  public $salesMonth: ReplaySubject<number> = new ReplaySubject<number>(1);

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

  constructor() { }

  ngOnInit(): void {
  }

}
