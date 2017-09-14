import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { ADMIN_PAGES_MENU, PAGES_MENU, GUEST_PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';
import { AuthService, User } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { LoopBackFilter, LoopBackConfig } from '../../shared/sdk';

// import { Observable } from '../../../../node_modules/rxjs/src/Observable';
@Component({
  selector: 'cub-detection',
  templateUrl: './cub-detection.html',
  styleUrls: ['./cub-detection.scss'],
})
export class CubDetectionComponent implements OnInit, OnDestroy {
//  isLoggedIn: Observable<any>;
  constructor( private authService: AuthService,
    private _menuService: BaMenuService ) {
      this.checkLoggedUpdateMenu();
  }

  checkLoggedUpdateMenu() {
 console.log('reaccessing cub detection');
    const isLoggedIn = this.authService.isLoggedIn();
    if (typeof isLoggedIn === 'boolean') {
      if (!isLoggedIn) {
        
      this._menuService.updateMenuByRoutes(<Routes>GUEST_PAGES_MENU);
      }
    }
  }

  ngOnInit() {
  
  }

  ngOnDestroy() {
    
  }
  calculateClicked() {
    console.log('submitted');
  }
  clearClicked() {
    console.log('clearing..');
  }
  loadDnaListFromDB(): boolean {
    console.log('loading dna list..');
    return true; // if success
  }

}
