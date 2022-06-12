import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardContainer } from './containers/dashboard/dashboard.container';


@NgModule({
  declarations: [
    DashboardContainer
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SwiperModule
  ]
})
export class DashboardModule { }
