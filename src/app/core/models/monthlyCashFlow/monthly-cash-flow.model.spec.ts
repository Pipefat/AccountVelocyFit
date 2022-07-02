import { TestBed } from '@angular/core/testing';
import { CashFlowService } from '../../services/cashFlow/cash-flow.service';
import { MonthlyCashFlowInterface } from './../../interfaces/monthly-cash-flow.interface';
import { MonthlyCashFlowModel } from './monthly-cash-flow.model';

describe('MonthlyCashFlowModel', () => {
  let mockMonthData: MonthlyCashFlowInterface;
  let cashFlowService: CashFlowService;

  beforeEach(() => {
    cashFlowService = TestBed.inject(CashFlowService);
    mockMonthData = {
      "additional-income": 890000,
      "fe-forResults": 2206000,
      "fe-forUtility": 2607000,
      "incidents": 682000,
      "month-code": -202201,
      "operating-expenses": 770000,
      "personal-spending": 63000,
      "sales": 4102700
    }
  });

  it('should create an instance', () => {
    expect(new MonthlyCashFlowModel(cashFlowService, mockMonthData)).toBeTruthy();
  });

});
