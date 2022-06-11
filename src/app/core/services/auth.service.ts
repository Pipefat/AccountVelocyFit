import { Injectable } from '@angular/core';
import { Auth, deleteUser, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from '@angular/fire/auth'
import { Database, equalTo, get, orderByChild, query, ref } from '@angular/fire/database';

import { Observable, Subscriber } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private actionCodeSettings: {
    url: string,
    handleCodeInApp: boolean
  };

  constructor(
    private auth: Auth,
    private dataBase: Database
  ) {
    this.actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true
    }
  }

  private handleError(error: Error, observer: Subscriber<any>): void {
    if (environment.production) {
      console.log(error);
    }
    if (error.message) {
      observer.error(error.message);
    }
    observer.complete();
  }

  get isInUser(): boolean {
    console.log(this.auth.currentUser);
    return this.auth.currentUser === null ? false : true;
  }

  get isSigningIn(): boolean {
    return isSignInWithEmailLink(this.auth, window.location.href);
  }

  $sendLinkToSingIn(email: string): Observable<boolean> {
    return new Observable((observer) => {
      this.$isSupportedEmail(email).subscribe({
        next: (res) => {
          if (res) {
            sendSignInLinkToEmail(this.auth, email, this.actionCodeSettings)
              .then(() => {
                window.localStorage.setItem('emailForSignIn', email);
                observer.next(true);
                observer.complete();
              })
              .catch(error => this.handleError(error, observer));
          } else {
            observer.next(false);
            observer.complete();
          }
        }
      });
    });
  }

  $signIn(email: string): Observable<boolean> {
    return new Observable((observer) => {
      signInWithEmailLink(this.auth, email, window.location.href)
      .then((result) => {
        window.localStorage.removeItem('emailForSignIn');
        this.$isSupportedUser(result.user.uid).subscribe({
          next: (res) => {
            if (res) {
              observer.next(true);
              observer.complete();
            } else {
              deleteUser(result.user)
                .then(() => {
                  observer.next(false);
                  observer.complete();
                })
                .catch(error => this.handleError(error, observer));
            }
          }
        });
      })
      .catch(error => this.handleError(error, observer));
    })
  }

  $isSupportedUser(id: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      get(ref(this.dataBase, `supported-users/${id}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            observer.next(true);
            observer.complete();
          } else {
            observer.next(false);
            observer.complete();
          }
        })
        .catch(error => this.handleError(error, observer));
    })
  }

  $isSupportedEmail(email: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      get(query(ref(this.dataBase, 'supported-users'), orderByChild('email'), equalTo(email)))
      .then((snapshot) => {
        if (snapshot.hasChildren()) {
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      })
      .catch(error => this.handleError(error, observer));
    })
  }

}
