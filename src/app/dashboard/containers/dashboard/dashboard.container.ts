import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.container.html',
  styleUrls: ['./dashboard.container.scss']
})
export class DashboardContainer implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private $onUserAdmin: Observable<boolean> = this.authService.$authState().pipe(
    mergeMap((user) => {
      if (!user) {
        return new BehaviorSubject(false);
      } else {
        return this.authService.$isSupportedUser(user.uid).pipe(
          tap((res)=> {
            if (!res) {
              this.authService.deleteUser(user);
            }
          })
        )
      }
    }),
    tap(res => {
      if (!res) {
        this.router.navigate(['/login']);
      }
    })
  );

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.subscriptions.push(this.$onUserAdmin.subscribe());
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(subs => subs.unsubscribe());
  }

}
