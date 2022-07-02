import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SwiperModule } from 'swiper/angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardContainer } from './containers/dashboard/dashboard.container';
import { SharedModule } from '../shared/shared.module';
import { PrincipalDashComponent } from './components/principal-dash/principal-dash.component';
import { AdditionalDashComponent } from './components/additional-dash/additional-dash.component';
import { ReportsDashComponent } from './components/reports-dash/reports-dash.component';
import { CoreModule } from '../core/core.module';
import { DayBoxDashComponent } from './components/day-box-dash/day-box-dash.component';


@NgModule({
  declarations: [
    DashboardContainer,
    PrincipalDashComponent,
    AdditionalDashComponent,
    ReportsDashComponent,
    DayBoxDashComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SwiperModule,
    SharedModule,
    CoreModule
  ]
})
export class DashboardModule { }
