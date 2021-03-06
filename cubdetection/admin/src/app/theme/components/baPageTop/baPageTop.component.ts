import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { GlobalState } from '../../../global.state';
import { AuthService, User } from './../../../auth.service';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss'],
})
export class BaPageTop {

  isScrolled: boolean = false;
  isMenuCollapsed: boolean = false;
  userDetail: string;

  constructor(
    private _state: GlobalState,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
   this.recheck_userDetail();
  }

  recheck_userDetail() {
     const user = this.authService.getUser();
    if (user !== undefined) {
          
      this.userDetail = user.firstName || user.lastName ?
        `${(user.firstName + ' ' + user.lastName).trim()} (${user.role.toUpperCase()})` :
        `${user.username || user.email} (${user.role.toUpperCase()})`;
      } else {
        this.reset_userDetail();
      }
  }

  reset_userDetail() {
    console.log('detail has been reset');
    this.userDetail = undefined;
  }
  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  useLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    location.reload(true);
  }

  signOut(event: Event) {
    event.preventDefault();
    this.authService.logout().subscribe(
      () => {
        this.authService.force_clearUser();
        this.recheck_userDetail();
        this.router.navigate(['/login']);
      },
      err => {
        if (err) {
          if (err.statusCode === 401) {
            this.router.navigate(['/login']);
          } else if (err.message) {
            alert(err.message);
          }
        }
      },
    );
  }

  onChangePasswordClicked() {
    this.router.navigate(['/change-password']);
  }

  loginUserClicked() {
    this.router.navigate(['/login']);
  }
  registerUserClicked() {
    this.router.navigate(['/register']);
  }
}
