import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { NotificationsService } from 'angular2-notifications';
import { Pages } from '../pages.component';

import { LoopBackAuth } from './../../shared/sdk/services/core/auth.service';
import { ADMIN_PAGES_MENU, PAGES_MENU, GUEST_PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';
import { AuthService, User } from '../../auth.service';
import { Container, ContainerApi } from '../../shared/sdk';
import { environment } from '../../../environments/environment';
import { Dna, DnaApi, LoopBackFilter, LoopBackConfig } from '../../shared/sdk';

import { Uploader } from 'angular2-http-file-upload';
import { MyUploadItem } from '../my-upload-item';

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
  providers: [Pages, Uploader],
})
export class CubDetectionComponent implements OnInit, OnDestroy {
  private maxFileUploadSize: number = 1000000; // ~ 1GB
  serverLocation: string = LoopBackConfig.getPath();
  private selectedFile: File = null;
  private pdfContainer: string = 'dnafiles';



  //  isLoggedIn: Observable<any>;
  existingDnaList: Dna[] = [];
  selectedDnaSeqID: number;
  constructor(private authService: AuthService, private dnaApi: DnaApi,
    private _menuService: BaMenuService, private _Page: Pages,
    public uploaderService: Uploader, private loopBackAuth: LoopBackAuth,
    protected containerApi: ContainerApi,

    private notificationsService: NotificationsService) {

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
        // for (let i in this.existingDnaList) {
        //   console.log(i);
        // }
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
    console.log('loading dna list.');
    return true; // if success
  }


  importFromTextClicked(event: any) {


    if (event.currentTarget.files.length > 0) {
      //  event.currentTarget.files[0].name); //---> FILE NAME
      // event.currentTarget.files[0].type); // ---> FILE TYPE
      if ((event.currentTarget.files[0].type === 'text/plain') &&
        (event.currentTarget.files[0].size < this.maxFileUploadSize)) {
        console.log('INFO: It is a TEXT file');

        console.log('PRE-importing into excel now...');
        this.selectedFile = (<HTMLInputElement>window.document.getElementById('fileuploadbox')).files[0];
        const containerToSavePdf: string = this.serverLocation.concat('/api/').
          concat('containers/'.concat(this.pdfContainer).concat('/upload?access_token=')
            .concat(this.loopBackAuth.getAccessTokenId()));
        const myUploadItem = new MyUploadItem(this.selectedFile, containerToSavePdf);


        this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
          /////////Update image url on news/////////////////////////////////////////////////////
          console.log('Success: PDF has been uploaded');


        };
        this.uploaderService.onErrorUpload = (item, response, status, headers) => {
          //   this.onUploadErrorDeleteNewsById(_news.id);
          console.log('ERROR: error on upload');
        };

        this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
          // complete callback, called regardless of success or failure
          console.log('COMPLETED: PDF upload has been completed');
        };
        // this.uploaderService.onProgressUpload  // can be reworked to know PROGRESS of UPLOAD
        this.uploaderService.upload(myUploadItem);
      }
    }
    else {
      console.log('Info: event is undefined');
    }
  }
}
