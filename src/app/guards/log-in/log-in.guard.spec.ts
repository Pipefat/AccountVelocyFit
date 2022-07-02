import { TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment';

import { LogInGuard } from './log-in.guard';

describe('LogInGuard', () => {
  let guard: LogInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
    });
    guard = TestBed.inject(LogInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
