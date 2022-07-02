import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, NEVER, Observable, ReplaySubject, Subscription } from 'rxjs';
import { catchError, finalize, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { DailyCashFlowModel } from 'src/app/core/models/dailyCashFlow/daily-cash-flow.model';
import { MonthlyCashFlowModel } from 'src/app/core/models/monthlyCashFlow/monthly-cash-flow.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CashFlowService } from 'src/app/core/services/cashFlow/cash-flow.service';
import SwiperCore, { Navigation, SwiperOptions } from 'swiper';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.container.html',
  styleUrls: ['./dashboard.container.scss']
})
export class DashboardContainer implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  private slidesPerView = window.innerWidth <= 680 ? 1 : window.innerWidth > 1020 ? 3 : 2;

  public $dashConfig: BehaviorSubject<SwiperOptions> = new BehaviorSubject<SwiperOptions>(this.dashConfig);

  public $viewDay: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);

  public $day: ReplaySubject<DailyCashFlowModel> = new ReplaySubject<DailyCashFlowModel>(1);

  public $month: ReplaySubject<MonthlyCashFlowModel> = new ReplaySubject<MonthlyCashFlowModel>(1);

  public $lastMonth: ReplaySubject<MonthlyCashFlowModel> = new ReplaySubject<MonthlyCashFlowModel>(1);

  constructor(
    private authService: AuthService,
    private cashFlowService: CashFlowService,
    private router: Router
  ) {
    this.subscriptions.push(
      this.$onUserAdmin.subscribe(),
      this.$onDay.subscribe(),
      this.$onMonth.subscribe(),
      this.$onLastMonth.subscribe()
    );
  }

  private get $onUserAdmin(): Observable<boolean> {
    return this.authService.$authState().pipe(
      mergeMap(user => user ?
        this.authService.$isSupportedUser(user.uid).pipe(
          mergeMap(res => res ? new BehaviorSubject(res).pipe(take(1)) : this.authService.$deleteUser(user).pipe(map(() => res))),
          catchError(error => this.handleAuthError(error))
        )
        : new BehaviorSubject(false).pipe(take(1))
      ),
      tap({ next: res => { if (!res) this.router.navigate(['/login']); } }),
      catchError(error => this.handleAuthError(error))
    );
  }

  private get $onDay(): Observable<DailyCashFlowModel> {
    return this.$viewDay.pipe(
      switchMap(dayCode => this.cashFlowService.$onDay(dayCode)),
      catchError(this.handleCashFlowError),
      tap(day => this.$day.next(day))
    );
  }

  private get $onMonth(): Observable<MonthlyCashFlowModel> {
    return this.cashFlowService.$currentMonth.pipe(
      catchError(this.handleCashFlowError),
      tap(month => this.$month.next(month))
    );
  }

  private get $onLastMonth(): Observable<MonthlyCashFlowModel> {
    return this.cashFlowService.$lastMonth.pipe(
      catchError(this.handleCashFlowError),
      tap(month => this.$lastMonth.next(month))
    );
  }

  private get dashConfig(): SwiperOptions {
    return {
      slidesPerView: this.slidesPerView,
      spaceBetween: this.slidesPerView * 4,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    }
  }

  private handleCashFlowError(error: Error): Observable<never> {
    alert('Hubo un error en la base de datos de Flujo de Efectivo, si el problema persiste comunícate con Admin');
    if (error.message) console.log(error.message);
    return NEVER;
  };

  private handleAuthError(error: Error): Observable<never> {
    alert(this.authService.globalErrorMessage);
    if (error.message) console.log(error.message);
    return NEVER;
  };

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const innerWidth = event.target.innerWidth;
    const slidesPerView = innerWidth <= 680 ? 1 : innerWidth > 1020 ? 3 : 2
    if (slidesPerView !== this.slidesPerView) {
      this.slidesPerView = slidesPerView;
      this.$dashConfig.next(this.dashConfig)
    }
  }

}
