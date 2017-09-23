import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { NotificationsService } from 'angular2-notifications';
import { Pages } from '../pages.component';

import { ADMIN_PAGES_MENU, PAGES_MENU, GUEST_PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';
import { AuthService, User } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { Dna, DnaApi, LoopBackFilter, LoopBackConfig } from '../../shared/sdk';

export class DropDownDNAValue {
  value: string;
  label: string;
  constructor(value: string, label: string) {
    this.value = value;
    this.label = label;
  }
}

// import { Observable } from '../../../../node_modules/rxjs/src/Observable';
@Component({
  selector: 'cub-detection',
  templateUrl: './cub-detection.html',
  styleUrls: ['./cub-detection.scss'],
  providers: [Pages],
})
export class CubDetectionComponent implements OnInit, OnDestroy {
  //  isLoggedIn: Observable<any>;
  existingDnaList: Dna[] = [];
  selectedDnaSeqID: number;
  constructor(private authService: AuthService, private dnaApi: DnaApi,
    private _menuService: BaMenuService, private _Page: Pages,
    private notificationsService: NotificationsService ) {

    //   _Page.updateRoute();
  }
  ngOnInit(): void {
    this.updateRoute();
    this.loadDna();
  }
  // checkLoggedUpdateMenu() {
  //   const isLoggedIn = this.authService.isLoggedIn();
  //   if (typeof isLoggedIn === 'boolean') {
  //     if (!isLoggedIn) {

  //     console.log('updated to guest_pages_menu()');
  //     this._menuService.updateMenuByRoutes(<Routes>GUEST_PAGES_MENU);
  //     }
  //   }
  // }

  loadDna(): void { // and put into combobox
    this.dnaApi.find<Dna>().subscribe(
      data => {
        this.existingDnaList = data;

        for (let i in this.existingDnaList) {
          console.log(i);
        }
      },
      err => { if (err && err.message) this.notificationsService.error(err.name, err.message); }
    );
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
