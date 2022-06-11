import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isInUser: boolean;
  private emailForSignIn: string | null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isInUser = this.authService.isInUser;
    this.emailForSignIn = window.localStorage.getItem('emailForSignIn');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>((observer) => {
      if (!this.isInUser) {
        if (this.authService.isSigningIn) {
          if (!this.emailForSignIn) {
            observer.next(false);
            observer.complete();
          } else {
            this.authService.$signIn(this.emailForSignIn).subscribe({
              next: res => {
                observer.next(res);
                observer.complete();
              }
            })
          }
        } else {
          observer.next(false);
          observer.complete();
        }
      } else {
        observer.next(true);
        observer.complete();
      }
    }).pipe(
      tap(access => {
        if (!access) {
          this.router.navigate(['/login'])
        }
      })
    );
  }

}
