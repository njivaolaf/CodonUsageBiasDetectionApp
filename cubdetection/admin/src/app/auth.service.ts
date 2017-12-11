import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http } from '@angular/http';

import { LoopBackConfig } from './shared/sdk';
import { Account, AccessToken } from './shared/sdk/models';
import { AccountApi } from './shared/sdk/services';
import { environment } from '../environments/environment';

export interface User {
  id: number,
  email: string,
  username: string,
  active: boolean,
  changePasswordRequired: boolean,
  locked: boolean,
  role: string,
  isAdmin: boolean,
  firstName: string,
  lastName: string
}

@Injectable()
export class AuthService {

  redirectUrl: string;

  private currentUser: User;

  constructor(private accountApi: AccountApi, private http: Http) {
    LoopBackConfig.setBaseURL(environment.apiUrl);
    LoopBackConfig.setApiVersion('api');
  }

  login(account: Account): Observable<AccessToken> {
    return this.accountApi.login(account);
  }

  logout(): Observable<any> {
    return this.accountApi.logout();
  }

  isLoggedIn(): boolean | Observable<any> {
    const userId = this.accountApi.getCurrentId();
    const token = this.accountApi.getCurrentToken() ? this.accountApi.getCurrentToken().id : null;
    if (userId && token) {
      return this.http.get(`${LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion()}/Accounts/${userId}?access_token=${token}`);
      // return this.accountApi.findById(userId);
    }
    return false;
  }

  setUser(user: User): void {
    this.currentUser = user;
  }

  force_clearUser(): void{
    this.currentUser = undefined;
  }

  getUser(): User {
    return this.currentUser;
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.accountApi.changePassword(oldPassword, newPassword);
  }

  resetPassword(email: string) {
    return this.accountApi.resetAccountPassword(email);
  }

  getAccessToken() {
    const token = this.accountApi.getCurrentToken();
    return (token && token.id) || null;
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
