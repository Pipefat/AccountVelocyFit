import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, skip, take } from 'rxjs/operators';
import { MonthlyCashFlowModel } from 'src/app/core/models/monthlyCashFlow/monthly-cash-flow.model';

@Component({
  selector: 'app-principal-dash',
  templateUrl: './principal-dash.component.html',
  styleUrls: ['./principal-dash.component.scss']
})
export class PrincipalDashComponent implements OnInit {

  @Input() set month(month: MonthlyCashFlowModel | null) {
    if (month) {
      month.$salesLastWeek.pipe(skip(6), take(1)).subscribe(() => this.$month.next(month));
    };
  };

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

  constructor() { }

  ngOnInit(): void {
  }

}
