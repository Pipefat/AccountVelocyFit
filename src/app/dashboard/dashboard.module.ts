import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';

import { DashboardRoutingModule } from './dashboard-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SwiperModule
  ]
})
export class DashboardModule { }
