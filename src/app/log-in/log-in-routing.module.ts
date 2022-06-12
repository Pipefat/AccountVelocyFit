import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInGuard } from '../guards/log-in/log-in.guard';
import { LogInContainer } from './containers/log-in/log-in.container'

const routes: Routes = [
  {
    path: '',
    canActivate: [LogInGuard],
    component: LogInContainer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogInRoutingModule { }
