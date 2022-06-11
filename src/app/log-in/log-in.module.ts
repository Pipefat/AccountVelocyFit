import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogInRoutingModule } from './log-in-routing.module';
import { LogInContainer } from './containers/log-in/log-in.container';
import { HeadComponent } from './components/head/head.component';
import { EnterBoxComponent } from './components/enter-box/enter-box.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LogInContainer,
    HeadComponent,
    EnterBoxComponent
  ],
  imports: [
    CommonModule,
    LogInRoutingModule,
    SharedModule
  ]
})
export class LogInModule { }
