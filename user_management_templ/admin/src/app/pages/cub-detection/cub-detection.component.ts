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
import { NgxChartsModule } from '@swimlane/ngx-charts';   // ngx chart


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
  private pdfContainer: string = 'dnafiles';  // name of the folder in the API

  private viewMode: number = 0; // toggle between 0 or 1 , 0 = initial, 1 = CHART view

  private transferLimitPerFile: number = 20000; // in bytes, should match with SERVER

  data: any; // to be used in CHART

  existingDnaList: Dna[] = [];
  selectedDnaSeqID: number;

  //ngx chart PART
  single: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];
  multi: any[] = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "2010",
          "value": 5000002
        },
        {
          "name": "2011",
          "value": 5800000
        }
      ]
    }
  ];;

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'DNA';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#123456', '#A10A28', '#C7B42C', '#BBBBBB']
  };
  //


  onSelect(event) {
    console.log(event);
  }
  constructor(private authService: AuthService, private dnaApi: DnaApi,
    private _menuService: BaMenuService, private _Page: Pages,
    public uploaderService: Uploader, private loopBackAuth: LoopBackAuth,
    protected containerApi: ContainerApi,

    private notificationsService: NotificationsService,
    private _chartistJsService: ChartistJsService,

  ) {
    // Object.assign(this, {this.single, this.multi});  
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


  private blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob; // casting to FILE type
  }

  importFromTextClicked(event: any) {

    // note: assuming all inputs are mRNA (actg)

    let initFileSize: number;
    let initFileName: string;
    if (event.currentTarget.files.length > 0) {
      initFileSize = event.currentTarget.files[0].size;
      initFileName = event.currentTarget.files[0].name;
      initFileName = initFileName.slice(0, -4);
      if ((event.currentTarget.files[0].type === 'text/plain') &&
        (event.currentTarget.files[0].size < this.maxFileUploadSize)) {

        console.log('Preparing the text file now...');
        this.selectedFile = (<HTMLInputElement>window.document.getElementById('fileuploadbox')).files[0];
        const containerToSavePdf: string = this.serverLocation.concat('/api/').
          concat('containers/'.concat(this.pdfContainer).concat('/upload?access_token=')
            .concat(this.loopBackAuth.getAccessTokenId()));

        // date is used as an identifier
        const uploadDate = new Date();
        const uploadDateStr = uploadDate.getDate().toString().concat(uploadDate.getMonth().toString()).
          concat(uploadDate.getFullYear().toString()).concat('_').
          concat(uploadDate.getHours().toString()).concat(uploadDate.getMinutes().toString()).
          concat(uploadDate.getSeconds().toString()).
          concat(uploadDate.getMilliseconds().toString())
          ;

        // -----------------SLICING the file into different BLOBS

        // myUploadItem.headers = { HeaderName: 'TestHeader' };
        // myUploadItem.formData = { newfilename: 'SUCCESS FILE NAME' }
        const uploadLimitInBytesPerFile = this.transferLimitPerFile; // 700 000 bytes
        const totalFilesToBeUploaded = Math.ceil(initFileSize / uploadLimitInBytesPerFile);
        const lastBytesRemaining = initFileSize % uploadLimitInBytesPerFile;
        console.log('totalFilesToBeUploaded', totalFilesToBeUploaded);
        console.log('lastBytesRemaining:', lastBytesRemaining);

        let successUploadCount = 0;
        let myUploadItem: MyUploadItem[] = [];
        let fileParts: File[] = [];
        let bytesSliced = 0;
        let filepartName: string;
        for (let blobIndex = 0; blobIndex < totalFilesToBeUploaded; blobIndex++) {
          //  setting the part name
          filepartName = uploadDateStr.concat('$').concat(initFileName).concat('_').concat(blobIndex.toString()).
            concat('.txt'); // eg: myfilename.txt becomes myfilename0.txt 
          if (blobIndex < (totalFilesToBeUploaded - 1)) {
            fileParts.push(
              this.blobToFile(
                this.selectedFile.slice(
                  bytesSliced, bytesSliced + uploadLimitInBytesPerFile),
                filepartName,
              ),
            );
            bytesSliced += uploadLimitInBytesPerFile;
          } else {
            fileParts.push(
              this.blobToFile(
                this.selectedFile.slice(bytesSliced, bytesSliced + lastBytesRemaining),
                filepartName,
              ),
            );
          }
          myUploadItem.push(new MyUploadItem(fileParts[blobIndex], containerToSavePdf));
          console.log('pushed upload item');
        }
        // ------------------------------UPLOADING THE FILES-----------
        //   console.log(' myUploadItem.headers', myUploadItem.headers);
        this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
          console.log('Success: PDF has been uploaded');
          successUploadCount++;
          if (successUploadCount === totalFilesToBeUploaded) {    // when all files have been uploaded SUCCESSFULLy
            this.containerApi.getCbuResults(uploadDateStr.concat('$').
              concat(initFileName), totalFilesToBeUploaded).subscribe(
              results => {
                console.log('results:', results);

                this.setupCHART();
                successUploadCount = 0;
              }, err => {
                if (err && err.message) {
                  console.log(err.message);
                }
              },
            );
          }

        };
        this.uploaderService.onErrorUpload = (item, response, status, headers) => {
          console.log('ERROR: error on upload');
        };

        this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
          // complete callback, called regardless of success or failure
          // console.log('COMPLETED: PDF upload has been completed');
        };

        myUploadItem.forEach(oneUploadItem => {
          oneUploadItem.formData = { dateUploaded: uploadDate };
          oneUploadItem.alias = 'text/plain';
          console.log('uploading now');
          this.uploaderService.upload(oneUploadItem);
        });
      }
    } else {
      console.log('Alert: Please choose a file.');
    }
  }

  private setupCHART(): void {
    this.viewMode = 1;
    this.data = this._chartistJsService.getAll();
  }
}
