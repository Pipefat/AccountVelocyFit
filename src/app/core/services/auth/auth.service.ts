import { Injectable } from '@angular/core';
import {
  Auth,
  deleteUser,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
  User,
} from '@angular/fire/auth';
import { Database, equalTo, get, orderByChild, query, ref } from '@angular/fire/database';
import { BehaviorSubject, from, Observable, Subscriber } from 'rxjs';
import { map, mergeMap, take, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public globalErrorMessage = 'Lo sentimos, ha ocurrido un error en el Servicio de Autenticación. Comunícate con Admin si el problema persiste';

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

  private handleError(error: Error, observer?: Subscriber<any>): void {
    if (!environment.production) {
      console.log({error: error});
    }
    if (observer) {
      observer.error(error);
    }
  }

  get isSigningIn(): boolean {
    return isSignInWithEmailLink(this.auth, window.location.href);
  }

  $deleteUser(user: User): Observable<void> {
    return from(deleteUser(user)).pipe(
      catchError(error => {
        this.handleError(error);
        return from(signOut(this.auth))
      }),
      tap({ error: this.handleError })
    );
  }

  $authState(): Observable<User | null> {
    return new Observable<User | null>((observer) => {
      onAuthStateChanged(this.auth, (user) => observer.next(user), error => { if (error) this.handleError(error, observer) });
    });
  }

  $isInUser(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      }, error => this.handleError(error, observer));
    });
  }

  $sendLinkToSingIn(email: string): Observable<boolean> {
    return this.$isSupportedEmail(email).pipe(
      mergeMap(res => res ?
        from(sendSignInLinkToEmail(this.auth, email, this.actionCodeSettings)).pipe(map(() => true))
        : new BehaviorSubject(false).pipe(take(1))
      ),
      tap({
        next: res => { if (res) window.localStorage.setItem('emailForSignIn', email) },
        error: this.handleError
      })
    );
  }

  $signIn(email: string): Observable<boolean> {
    return from(signInWithEmailLink(this.auth, email, window.location.href)).pipe(
      mergeMap((result) => this.$isSupportedUser(result.user.uid).pipe(
        mergeMap(res => res ? new BehaviorSubject(true).pipe(take(1)) : from(deleteUser(result.user)).pipe(map(() => false)))
      )),
      tap({
        next: () => window.localStorage.removeItem('emailForSignIn'),
        error: this.handleError
      })
    );
  }

  $isSupportedUser(id: string): Observable<boolean> {
    return from(get(ref(this.dataBase, `supported-users/${id}`))).pipe(map(snapshot => snapshot.exists() ? true : false));
  }

  $isSupportedEmail(email: string): Observable<boolean> {
    return from(get(query(ref(this.dataBase, 'supported-users'), orderByChild('email'), equalTo(email)))).pipe(
      map(snapshot => snapshot.hasChildren() ? true : false)
    );
  }

}
