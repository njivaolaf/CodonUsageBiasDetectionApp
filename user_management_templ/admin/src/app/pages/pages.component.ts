import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { BaMenuService } from '../theme';
import { ADMIN_PAGES_MENU, PAGES_MENU, GUEST_PAGES_MENU } from './pages.menu';
import { AuthService, User } from '../auth.service';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-right"><img src="assets/images/userIcon.png" style="height: 12px;"></div>
      <div class="al-footer-main clearfix">
        <div class="al-copy" style="color: white;">&copy; <a href="https://www.utm.ac.mu/" style="color: white;" translate>{{'general.utm'}}</a> 2017</div>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages implements OnInit {

  constructor(
    private _menuService: BaMenuService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    const isAdmin = user && user.isAdmin;
    
    if (user === undefined) {
      this._menuService.updateMenuByRoutes(<Routes>GUEST_PAGES_MENU);
    } else if (isAdmin) {
      this._menuService.updateMenuByRoutes(<Routes>ADMIN_PAGES_MENU);
    } else {
      this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    }
  }
}
