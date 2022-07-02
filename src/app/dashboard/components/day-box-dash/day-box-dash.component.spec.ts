import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayBoxDashComponent } from './day-box-dash.component';

describe('DayBoxDashComponent', () => {
  let component: DayBoxDashComponent;
  let fixture: ComponentFixture<DayBoxDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayBoxDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayBoxDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
