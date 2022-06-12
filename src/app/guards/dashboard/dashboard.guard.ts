import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
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
        mergeMap(result => new Observable<boolean>((observer) => {
          if (!result) {
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
        })),
        tap(access => {
          if (!access) {
            this.router.navigate(['/login'])
          }
        })
      )
  }

}
