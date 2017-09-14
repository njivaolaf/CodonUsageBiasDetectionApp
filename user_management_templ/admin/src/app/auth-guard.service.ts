import { Injectable } from '@angular/core';
import {
  Router,
  CanActivateChild,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AuthService, User } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const url: string = state.url;
    const isLoggedIn = this.authService.isLoggedIn();
    if (typeof isLoggedIn === 'boolean') {
      if (!isLoggedIn) {
        this.authService.redirectUrl = url;
       // this.router.navigate(['/login']);
       // this.router.navigate(['../cub-detection']);
      }
      if (isLoggedIn) {
        const user = this.authService.getUser();
        if (user && user.changePasswordRequired) {
          this.authService.redirectUrl = url;
          this.router.navigate(['/change-password']);
        }
      }
      return isLoggedIn;
    }
    return isLoggedIn
      .map((response) => {
        this.authService.setUser(response.json() as User);
        const _isLoggedIn = response.status === 200;
        if (_isLoggedIn) {
          const user = this.authService.getUser();
          if (user && user.changePasswordRequired) {
            this.authService.redirectUrl = url;
            this.router.navigate(['/change-password']);
          }
        }
        return _isLoggedIn;
      })
      .catch((error) => {
        if (error.status === 401) { // Unauthorized
          this.authService.redirectUrl = url;
          this.router.navigate(['/login']);
        }
        let errMsg: string;
        if (error instanceof Response) {
          const body = error.json() || '';
          const err = JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
          errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
      });
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }
}
