import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalDashComponent } from './principal-dash.component';

describe('PrincipalDashComponent', () => {
  let component: PrincipalDashComponent;
  let fixture: ComponentFixture<PrincipalDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrincipalDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
