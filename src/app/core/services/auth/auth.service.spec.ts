import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
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
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should be send a link for sign in', () => {
  //   const signedWithoutLink = service.isSigningIn;
  //   expect(signedWithoutLink).toBeFalse();
  // });

  // it('should be send a link for sign in', (done: DoneFn) => {
  //   service.$sendLinkToSingIn('pipefatmotta@gmail.com').subscribe({
  //     next: res => {
  //       expect(res).toBeTrue();
  //       done();
  //     },
  //     error: err => {
  //       expect(err).toBeFalsy();
  //       done();
  //     }
  //   })
  // });

});
