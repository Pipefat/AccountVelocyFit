import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInContainer } from './containers/log-in/log-in.container'

const routes: Routes = [
  {
    path: '',
    component: LogInContainer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogInRoutingModule { }
