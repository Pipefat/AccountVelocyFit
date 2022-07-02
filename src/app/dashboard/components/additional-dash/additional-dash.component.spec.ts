import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDashComponent } from './additional-dash.component';

describe('AdditionalDashComponent', () => {
  let component: AdditionalDashComponent;
  let fixture: ComponentFixture<AdditionalDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
