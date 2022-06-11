import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterBoxComponent } from './enter-box.component';

describe('EnterBoxComponent', () => {
  let component: EnterBoxComponent;
  let fixture: ComponentFixture<EnterBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
