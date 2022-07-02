import { TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { MoneyPipe } from './money.pipe';

describe('MoneyPipe', () => {
  let currencyPipe: CurrencyPipe;

  beforeEach(() => {
    currencyPipe = TestBed.inject(CurrencyPipe);
  });

  it('create an instance', () => {
    const pipe = new MoneyPipe(currencyPipe);
    expect(pipe).toBeTruthy();
  });

});
