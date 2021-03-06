import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LogoFooterComponent } from './components/logo-footer/logo-footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MoneyPipe } from './pipes/money/money.pipe';
import { NumberPipe } from './pipes/number/number.pipe';
import { EnvelopePipe } from './pipes/envelope/envelope.pipe';



@NgModule({
  declarations: [
    LogoFooterComponent,
    MoneyPipe,
    NumberPipe,
    EnvelopePipe
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [
    CurrencyPipe,
    MoneyPipe,
    NumberPipe,
    EnvelopePipe
  ],
  exports: [
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    LogoFooterComponent,
    ReactiveFormsModule,
    MoneyPipe,
    NumberPipe,
    EnvelopePipe
  ]
})
export class SharedModule { }
