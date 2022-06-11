import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoFooterComponent } from './components/logo-footer/logo-footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    LogoFooterComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  exports: [
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    LogoFooterComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
