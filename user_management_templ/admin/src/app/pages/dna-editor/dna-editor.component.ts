import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';

import {
  LoopBackFilter, LoopBackConfig,
  Container, ContainerApi,
} from '../../shared/sdk';

import { DnaApi } from './../../shared/sdk/services';
import { Dna } from './../../shared/sdk/models';
// import { MyUploadItem } from './my-upload-item';
import { LoopBackAuth } from '../../shared/sdk/services/core/auth.service';
import { DropdownEditorComponent } from '../../shared/components';
import { CustomValidations } from '../../shared/customValidation/customValidation';

import { Pages } from '../pages.component';

import { Uploader } from 'angular2-http-file-upload';
import { MyUploadItem } from '../my-upload-item';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'dna-editor',
  templateUrl: './dna-editor.component.html',
  styleUrls: ['./dna-editor.component.scss'],

  providers: [Pages, Uploader],
})
export class DnaEditorComponent implements OnInit {


  private maxFileUploadSize: number = 10737418240; // ~ 10GB
  serverLocation: string = LoopBackConfig.getPath();
  private pdfContainer: string = 'dnafiles';  // name of the folder in the API
  selectedDnaId: number = 0;
  newOrUpdatedImageUrl: string = '';
  displayImageUrl: string = '';
  customValidations: CustomValidations = new CustomValidations();
  private eventUpload: any;


  private selectedFile: File = null;
  private transferLimitPerFile: number = 20000; // in bytes, should not be higher than the value set in API --config.js

  currentDna: Dna;
  ADD_MODE: number = 1;
  EDIT_MODE: number = 2;
  currentMode: number = 1;
  options = {
    timeOut: 3000,
    showProgressBar: false,
    lastOnBottom: false,
    animate: 'fromLeft',
  };
  trans: Object;
  saveInProgress: Boolean = false;

  constructor(
    private notificationsService: NotificationsService,
    protected dnaApi: DnaApi,
    private translate: TranslateService,
    private router: Router,
    public uploaderService: Uploader,
    private loopBackAuth: LoopBackAuth,
    protected containerApi: ContainerApi,
  ) {
    LoopBackConfig.setBaseURL(environment.apiUrl);
    LoopBackConfig.setApiVersion('api');

    this.selectedDnaId = +sessionStorage.getItem('id');
    if (this.selectedDnaId !== 0) {
      this.currentMode = this.EDIT_MODE;
    } else {
      this.currentDna = new Dna();
      this.currentDna.deleted = false;
      this.currentDna.sequencename = '';
    }
  }

  ngOnInit() {
    this.translate.get([
      'general.common.confirm_save',
      'general.common.error',
      'general.common.title_required',
      'general.common.details_required',
      'general.common.category_required',
      'general.common.upload_required',
      'general.common.reject_dna',
      'general.common.need_to_save',
      'Selected file should be an image (.png, .jpg)',
      'Maximum image size is 500 KB',
    ]).subscribe(
      trans => {
        this.trans = trans;
      });

    this.loadDna();

  }

  OnDestroy(): void {
    sessionStorage.removeItem('id');
  }



  loadDna() {
    console.log('loading dna');
    if (this.currentMode === this.EDIT_MODE) {
      let loopbackFilter: LoopBackFilter;
      loopbackFilter = {
        where: { id: this.selectedDnaId },
      };
      this.dnaApi.findById<Dna>(this.selectedDnaId, loopbackFilter).subscribe(
        (_currentDna) => {

          this.currentDna = _currentDna;
        },
        err => {
          this.notificationsService.error(err.name, err.message);
        },
      );
    }

  }
  onSaveClicked() {
    if (window.confirm(this.trans['general.common.confirm_save'])) {

      if (this.validateDna(this.currentDna)) {
        if (this.currentMode === this.ADD_MODE) {
          this.calculateCUB(this.eventUpload, 0, this.currentDna);
          //  this.createDna(this.currentDna);
        } else {
          this.calculateCUB(this.eventUpload, 1, this.currentDna);
          // this.updateDna(this.currentDna);
        }

      }
    }
  }

  onCancelClicked() {
    if (window.confirm(this.translate.instant('Are you sure you want to cancel'))) {
      sessionStorage.removeItem('id');
      console.log('navigating to dna page now');
      this.router.navigate(['/pages/dna']);
    }
  }

  validateDna(_dna: Dna): Boolean {

    if (!this.customValidations.isNotNullAndNotEmptyString(_dna.sequencename)) {
      this.notificationsService.error(this.trans['general.common.error'],
        this.trans['general.common.title_required']);
      return false;
    }
    if (!this.eventUpload) {
      this.notificationsService.error(this.trans['general.common.error'],
        this.trans['general.common.upload_required']);
      return false;
    }
    return true;
  }


  onFileChange(file) {

  }

  createDna(_dna: Dna) {
    this.saveInProgress = true;
    // ATTACHED A TEMP IMAGE URL
    // _news.imageUrl = 'api/containers/'.concat(this.serverImageContainer).concat('/download/noImage.png');

    this.dnaApi.create(_dna).subscribe(
      (newDna) => {

        sessionStorage.setItem('addDna', 'addDna');
        this.router.navigate(['/pages/dna']);

      },
      err => {
        if (err && err.message) {
          this.notificationsService.error(err.name, err.message);
        }
      },
    );
  }

  updateDna(_dna: Dna) {
    this.saveInProgress = true;
    this.dnaApi.patchAttributes(_dna.id, _dna).subscribe(
      () => {

        sessionStorage.setItem('updateDna', 'updateDna');
        this.router.navigate(['/pages/dna']);

      },
      err => {
        if (err && err.message) {
          this.notificationsService.error(err.name, err.message);
        }
      },
    );
  }

  onUploadErrorDeleteDnaById(_DnaId: Number) {
    this.dnaApi.deleteById(_DnaId).subscribe(
      () => {

      },
      err => {
        if (err && err.message) {
          this.notificationsService.error(err.name, err.message);
        }
      },
    );
  }


  importFromTextClicked(event: any) {
    //  this.calculateCUB(event, 0);
    this.eventUpload = event;

  }

  calculateCUB(event: any, create0Edit1: number, myDNA: Dna) {

    this.notificationsService.warn('Status', 'Uploading...');
    const preset_filename = 'yourDNA';

    let initFileSize: number;
    let initFileName: string;
    let eventfilesCount: number;
    let filetype: string;
    eventfilesCount = event.target.files.length;
    if (eventfilesCount > 0) {
      filetype = event.target.files[0].type;
      initFileSize = event.target.files[0].size;
      initFileName = event.target.files[0].name;
      this.selectedFile = (<HTMLInputElement>window.document.getElementById('fileuploadbox')).files[0];

      initFileName = initFileName.slice(0, -4);
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
            console.log('all files have been uploaded');
            this.currentDna.partsCount = totalFilesToBeUploaded;
            this.currentDna.filePath = uploadDateStr.concat('$').
              concat(initFileName); // setting filePath
            switch (create0Edit1) {
              case 0:
                //creating
                this.createDna(this.currentDna);

                break;
              case 1:
                //updating
                this.updateDna(this.currentDna);
                break;
            }
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


  private blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob; // casting to FILE type
  }


}
