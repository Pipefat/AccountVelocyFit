import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsDashComponent } from './reports-dash.component';

describe('ReportsDashComponent', () => {
  let component: ReportsDashComponent;
  let fixture: ComponentFixture<ReportsDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
