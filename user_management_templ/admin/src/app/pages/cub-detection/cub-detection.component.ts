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
import { NgxChartsModule } from '@swimlane/ngx-charts';

export class DropDownDNAValue {
  value: string;
  label: string;
  constructor(value: string, label: string) {
    this.value = value;
    this.label = label;
  }
}
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

  existingDnaList: Dna[] = [];
  selectedDnaSeqID: number;

  // SETTINGS for CHART
  graphDATA: any[] = [];
  view: any[] = [1200, 400];  // size of CHART

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'DNA';
  showYAxisLabel = true;
  yAxisLabel = 'counts';

  colorScheme = {
    domain: ['#FAEBD7', '#2D767F', '#F38181', '#00FFF5']
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

  ) {

  }
  ngOnInit(): void {
    this.updateRoute();
    this.loadDna();
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
    var dnaTextBox = <HTMLInputElement>window.document.getElementById('dnaseqInput');
    var dnaTextBoxValue = dnaTextBox.value;
    this.calculateCUB(dnaTextBoxValue, 1);
  }
  clearClicked() {
    var dnaTextBox = <HTMLInputElement>window.document.getElementById('dnaseqInput');
    dnaTextBox.value = '';
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


  calculateCUB(event: any, submitMode: number) {  //submitMode 0 : txtfile, 1 : textbox

    const preset_filename = 'yourDNA';

    let initFileSize: number;
    let initFileName: string;
    let eventfilesCount: number;
    let filetype: string;
    switch (submitMode) {
      case 0:
        eventfilesCount = event.currentTarget.files.length;
        break;
      case 1:
        eventfilesCount = 1;
        initFileSize = event.length;
        initFileName = preset_filename.concat('.txt');
        filetype = 'text/plain';
        break;
    }

    if (eventfilesCount > 0) {
      if (submitMode === 0) {
        filetype = event.currentTarget.files[0].type;
        initFileSize = event.currentTarget.files[0].size;
        initFileName = event.currentTarget.files[0].name;
        this.selectedFile = (<HTMLInputElement>window.document.getElementById('fileuploadbox')).files[0];

      } else {
        var fileInArray = [event];
        var selectedFileBLOB = new Blob(fileInArray);
        this.selectedFile = this.blobToFile(selectedFileBLOB, initFileName.slice(0, -4) );
      }
      initFileName = initFileName.slice(0, -4);
      this.xAxisLabel = initFileName; //change CHART's x label to FILENAME
      if ((filetype === 'text/plain') &&
        (initFileSize < this.maxFileUploadSize)) {

        const containerToSavePdf: string = this.serverLocation.concat('/api/').
          concat('containers/'.concat(this.pdfContainer).concat('/upload?access_token=')
            .concat(this.loopBackAuth.getAccessTokenId()));

        // date is used as an identifier for each file part to be sent to the server
        //e.g format: <date>_<filename>.txt
        const uploadDate = new Date();
        const uploadDateStr = uploadDate.getDate().toString().concat(uploadDate.getMonth().toString()).
          concat(uploadDate.getFullYear().toString()).concat('_').
          concat(uploadDate.getHours().toString()).concat(uploadDate.getMinutes().toString()).
          concat(uploadDate.getSeconds().toString()).
          concat(uploadDate.getMilliseconds().toString())
          ;

        // -----------------SLICING the file into several parts

        const uploadLimitInBytesPerFile = this.transferLimitPerFile; // 20 000 bytes actually // can be changed and re-tested with higher values
        // the transferlimitperfile should match the value in config.json in the API(server)
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
            this.containerApi.getCubResults(uploadDateStr.concat('$').
              concat(initFileName), totalFilesToBeUploaded).subscribe(
              results => {
                console.log('results:', results);

                this.setupCHART(results);
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



  importFromTextClicked(event: any) {
    this.calculateCUB(event, 0);
  }

  // setting up the DATA containing the calculation results
  // & displaying into stacked vertical bar chart
  private setupCHART(calculationDATA): void {
    var codonNamesValues;
    calculationDATA.cbuResults.acidsResult.forEach(
      oneAcidData => {
        codonNamesValues = [];
        oneAcidData.currentCodons.forEach(
          oneCodonData => {
            codonNamesValues.push(
              {
                "name": oneCodonData.codonName,
                "value": oneCodonData.codonFoundCounter
              }
            );
          }
        );
        this.graphDATA.push(
          {
            "name": oneAcidData.acidName,
            "series": codonNamesValues
          },
        );

      }
    );


    //displaychart
    this.viewMode = 1;  //viewMode =1 [displaying chart]; viewMode=2 [cub detection page]
  }
}
