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


import { ChartistJsService } from './chartistJs.service';



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
  styleUrls: ['./cub-detection.scss',],
  providers: [Pages, Uploader, ChartistJsService],
})
export class CubDetectionComponent implements OnInit, OnDestroy {
  private maxFileUploadSize: number = 1000000; // ~ 1GB
  serverLocation: string = LoopBackConfig.getPath();
  private selectedFile: File = null;
  private pdfContainer: string = 'dnafiles';

  private viewMode: number = 0; // toggle between 0 or 1 , 0 = initial, 1 = CHART view

  private transferLimitPerFile: number = 200000; // in bytes, should match with SERVER

  data: any; // to be used in CHART

  existingDnaList: Dna[] = [];
  selectedDnaSeqID: number;
  constructor(private authService: AuthService, private dnaApi: DnaApi,
    private _menuService: BaMenuService, private _Page: Pages,
    public uploaderService: Uploader, private loopBackAuth: LoopBackAuth,
    protected containerApi: ContainerApi,

    private notificationsService: NotificationsService,
    private _chartistJsService: ChartistJsService,

  ) {

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


  getResponsive(padding, offset) {
    return this._chartistJsService.getResponsive(padding, offset);
  }

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
    let initFileSize: number;
    if (event.currentTarget.files.length > 0) {
      //  event.currentTarget.files[0].name); //---> FILE NAME
      // event.currentTarget.files[0].type); // ---> FILE TYPE
      initFileSize = event.currentTarget.files[0].size;
      if ((event.currentTarget.files[0].type === 'text/plain') &&
        (event.currentTarget.files[0].size < this.maxFileUploadSize)) {

        console.log('INFO: It is a TEXT file');

        console.log('PRE-importing into excel now...');
        this.selectedFile = (<HTMLInputElement>window.document.getElementById('fileuploadbox')).files[0];
        const containerToSavePdf: string = this.serverLocation.concat('/api/').
          concat('containers/'.concat(this.pdfContainer).concat('/upload?access_token=')
            .concat(this.loopBackAuth.getAccessTokenId()));


        const uploadDate = new Date().toDateString();

        // SLICING the file into different BLOBS
        const partOfFile = this.selectedFile.slice(0, 10, '');
        // const myUploadItem = new MyUploadItem(partOfFile, containerToSavePdf);
        // myUploadItem.headers = { HeaderName: 'TestHeader' };
        // myUploadItem.formData = { newfilename: 'SUCCESS FILE NAME' };


        const uploadLimitInBytesPerFile = this.transferLimitPerFile; // 700 000 bytes
        const totalFilesToBeUploaded = Math.ceil(initFileSize / uploadLimitInBytesPerFile);
        const lastBytesRemaining = initFileSize % uploadLimitInBytesPerFile;
        console.log('totalFilesToBeUploaded', totalFilesToBeUploaded);
        console.log('lastBytesRemaining:', lastBytesRemaining);

        let myUploadItem: MyUploadItem[] = [];
        let blobsToBeSent: Blob[] = [];
        let bytesSliced = 0;
        var blobIndexNum = 0;

        for (let blobIndex = 0; blobIndex < totalFilesToBeUploaded; blobIndex++) {
          console.log('entered for');
          if (blobIndex < (totalFilesToBeUploaded - 1)) {
            blobsToBeSent.push(this.selectedFile.slice(bytesSliced, bytesSliced + uploadLimitInBytesPerFile));
            bytesSliced += uploadLimitInBytesPerFile;
          }
          else {
            blobsToBeSent.push(this.selectedFile.slice(bytesSliced, bytesSliced + lastBytesRemaining));
          }
          myUploadItem.push(new MyUploadItem(blobsToBeSent[blobIndex], containerToSavePdf));
          console.log('pushed upload item')
        }
        // ------------------------------UPLOADING THE FILES-----------
        //   console.log(' myUploadItem.headers', myUploadItem.headers);
        this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
          /////////Update image url on news/////////////////////////////////////////////////////
          console.log('Success: PDF has been uploaded');
          this.setupCHART();

        }
        this.uploaderService.onErrorUpload = (item, response, status, headers) => {
          console.log('ERROR: error on upload');
        };

        this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
          // complete callback, called regardless of success or failure
          console.log('COMPLETED: PDF upload has been completed');
        };

        myUploadItem.forEach(oneUploadItem => {
          console.log('uploading now');
          this.uploaderService.upload(oneUploadItem);
        });
      }
    } else {
      console.log('Info: event is undefined');
    }
  }

  private setupCHART(): void {
    this.viewMode = 1;

    this.data = this._chartistJsService.getAll();
  }
}
