import { MonthlyCashFlowModel } from 'src/app/core/models/monthlyCashFlow/monthly-cash-flow.model';
import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { ChartDataInterface } from 'src/app/core/interfaces/chart-data.interface';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BoxData } from 'src/app/core/interfaces/box-data';

@Component({
  selector: 'app-reports-dash',
  templateUrl: './reports-dash.component.html',
  styleUrls: ['./reports-dash.component.scss']
})
export class ReportsDashComponent implements OnInit {

  @Input() set month(month: MonthlyCashFlowModel | null) {
    if (month) {
      month.$reportLastWeek.pipe(take(1)).subscribe((chartData) => {
        this.$lastWeek.next(chartData);
      });
      if (!this._month || (this._month && this._month.id !== month.id)) {
        month.reportSemiAnnual
          .then(chartData => this.$semester.next(chartData))
          .catch(() => alert('Hubo un error al obtener el reporte del Semestre, RECARGA LA PÁGINA y si el problema persiste, comunícate con Admin'));
      }
      this._month = month;
    }
  }

  @Input() set lastMonth(lastMonth: MonthlyCashFlowModel | null) {
    if (lastMonth) {
      lastMonth.reportMonth
        .then(chartData => this.$lastMonth.next(chartData))
        .catch(() => alert('Hubo un error al obtener el reporte del último mes, RECARGA LA PÁGINA y si el problema persiste, comunícate con Admin'));
    }
  }

  private _month!: MonthlyCashFlowModel | null;

  public $lastWeek: ReplaySubject<BoxData> = new ReplaySubject<BoxData>(1);

  public $lastMonth: ReplaySubject<BoxData> = new ReplaySubject<BoxData>(1);

  public $semester: ReplaySubject<BoxData> = new ReplaySubject<BoxData>(1);

  public view: [number, number] = [300, 200];

  public colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#505050', '#ff5252', '#4caf50', '#ffeb3b'],
  };

  constructor() { }

  ngOnInit(): void {
  }

}
