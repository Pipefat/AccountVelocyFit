import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInContainer } from './log-in.container';

describe('LogInContainer', () => {
  let component: LogInContainer;
  let fixture: ComponentFixture<LogInContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInContainer ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
