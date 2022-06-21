import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/core/services/auth.service';
import { LogoFooterComponent } from 'src/app/shared/components/logo-footer/logo-footer.component';
import { environment } from 'src/environments/environment';
import { EnterBoxComponent } from '../../components/enter-box/enter-box.component';
import { HeadComponent } from '../../components/head/head.component';

import { LogInContainer } from './log-in.container';

describe('LogInContainer', () => {
  let component: LogInContainer;
  let fixture: ComponentFixture<LogInContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LogInContainer,
        HeadComponent,
        EnterBoxComponent,
        LogoFooterComponent
      ],
      imports: [
        BrowserAnimationsModule,
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
        }),
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule
      ],
      providers: [
        AuthService
      ]
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
