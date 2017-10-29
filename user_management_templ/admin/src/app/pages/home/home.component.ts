import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { BaMenuService } from '../../theme';
import { AuthService, User } from '../../auth.service';
// import { Pages } from '../pages.component';

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
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  
  checkboxModel: boolean[] =[];
  constructor(private authService: AuthService,
    private _menuService: BaMenuService,
  ) {
    //   console.log('before updated');
    //   _Page.updateRoute();
    // this.updateRoute();
  }
  sendnow(){
    console.log('sending now...')
  }
  ngOnInit(): void {
    
    this.updateRoute();
  }
  updateRoute() {
    console.log('updating now...');
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
