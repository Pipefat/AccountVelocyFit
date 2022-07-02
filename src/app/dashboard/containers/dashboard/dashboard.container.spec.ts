import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment';

import { DashboardContainer } from './dashboard.container';

describe('DashboardContainer', () => {
  let component: DashboardContainer;
  let fixture: ComponentFixture<DashboardContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardContainer ],
      imports: [
        RouterTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => {
          const fireAuth = getAuth();
          connectAuthEmulator(fireAuth, 'http://localhost:9099');
          return fireAuth;
        }),
        provideDatabase(() => {
          const fireDatabase = getDatabase();
          connectDatabaseEmulator(fireDatabase, 'localhost', 9000);
          return fireDatabase;
        })
      ],
      providers: [
        AuthService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
