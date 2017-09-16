import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { BaMenuService } from '../../theme';
import { AuthService, User } from '../../auth.service';
import { Pages } from '../pages.component';

import { Router, Routes } from '@angular/router';
import { ADMIN_PAGES_MENU, PAGES_MENU, GUEST_PAGES_MENU } from '../pages.menu';
import {
    ColorEditorComponent,
    ColorRenderComponent,
    IconRenderComponent,
    IconEditorComponent,
    NotEditableReportComponent,
    DropdownEditorComponent,
    LongTextRenderComponent,
    NotEditableLongTextComponent, LocationRenderComponent, LocationEditorComponent,
    TextEditorComponent,
} from '../../shared/components';
import { CustomValidations } from '../../shared/customValidation/customValidation';

@Component({
    selector: 'mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.scss'],
    providers: [Pages],
})
export class MainPageComponent {
    constructor(private authService: AuthService,
        private _menuService: BaMenuService,
        private _Page: Pages,
    ) {
     //   _Page.updateRoute();
        this.updateRoute();
    }
    updateRoute() {
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
