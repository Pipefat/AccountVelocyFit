import { TestBed } from '@angular/core/testing';
import { DailyCashFlowInterface } from '../../interfaces/daily-cash-flow.interface';
import { CashFlowService } from '../../services/cashFlow/cash-flow.service';
import { DailyCashFlowModel } from './daily-cash-flow.model';

describe('DailyCashFlowModel', () => {
  let cashFlowService: CashFlowService;
  let mockDayData: DailyCashFlowInterface;

  beforeEach(() => {
    cashFlowService = TestBed.inject(CashFlowService);
    mockDayData = {
      "day-code": -20220421,
      "incidents": 0,
      "new-consumtions": 0,
      "personal-spending": 0,
      "sales": 0,
      "to-banks": 0,
      "to-strong-box": 0
    }
  })

  it('should create an instance', () => {
    expect(new DailyCashFlowModel(cashFlowService, mockDayData)).toBeTruthy();
  });

});
