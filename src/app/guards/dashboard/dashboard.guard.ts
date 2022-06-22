import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, NEVER, Observable } from 'rxjs';
import { catchError, mergeMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  private emailForSignIn: string | null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.emailForSignIn = window.localStorage.getItem('emailForSignIn');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.$isInUser().pipe(
        mergeMap(result => {
          if (!result) {
            if (this.authService.isSigningIn) {
              if (!this.emailForSignIn) {
                return new BehaviorSubject(false).pipe(take(1));
              } else {
                return this.authService.$signIn(this.emailForSignIn)
              }
            } else {
              return new BehaviorSubject(false).pipe(take(1));
            }
          } else {
            return new BehaviorSubject(true).pipe(take(1));
          }
        }),
        tap(access => { if (!access) this.router.navigate(['/login']); }),
        catchError(() => {
          alert(this.authService.globalErrorMessage);
          this.router.navigate(['/login']);
          return NEVER;
        })
      )
  }

}
