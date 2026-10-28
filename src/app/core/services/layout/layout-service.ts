import { Injectable, Service } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

  private _isAuthPage = new BehaviorSubject<boolean>(false);
  isAuthPage$ = this._isAuthPage.asObservable();

  private authRoutes = [
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/verify'
  ];

  constructor(private router: Router) {
    // Listen to route changes
    this.router.events
     .pipe(filter(event => event instanceof NavigationEnd))
     .subscribe((event: any) => {
        const url = event.urlAfterRedirects as string;
        const isAuth = this.authRoutes.some(route => url.includes(route));
        this._isAuthPage.next(isAuth);
      });
  }
}
