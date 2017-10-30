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

import { environment } from '../../../environments/environment';
@Component({
  selector: 'dna-editor',
  templateUrl: './dna-editor.component.html',
  styleUrls: ['./dna-editor.component.scss'],
})
export class DnaEditorComponent implements OnInit {

  selectedDnaId: number = 0;
  newOrUpdatedImageUrl: string = '';
  displayImageUrl: string = '';
  customValidations: CustomValidations = new CustomValidations();

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
    // public uploaderService: Uploader,
    private loopBackAuth: LoopBackAuth,
    protected containerApi: ContainerApi,
  ) {
    LoopBackConfig.setBaseURL(environment.apiUrl);
    LoopBackConfig.setApiVersion('api');

    this.selectedDnaId = +sessionStorage.getItem('id');
    if (this.selectedDnaId !== 0) {
      this.currentMode = this.EDIT_MODE;
    }
  }

  ngOnInit() {
    this.translate.get([
      'general.common.confirm_save',
      'general.common.error',
      'general.common.title_required',
      'general.common.details_required',
      'general.common.category_required',
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
            this.createDna(this.currentDna);
          } else {
            this.updateDna(this.currentDna);
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
      return true;
    }

    // isValidSelectedFile(): Boolean {

    //   this.selectedFile = (<HTMLInputElement>window.document.getElementById('fileuploadbox')).files[0];

    //   /*if (this.selectedFile === null || this.selectedFile === undefined) {
    //     if (this.currentMode === this.ADD_MODE) {
    //       this.notificationsService.error(this.translate.instant('general.common.error'),
    //         this.translate.instant('Please select an image'));
    //       return false;
    //     } else {
    //       // NOTE: Can update without selecting an image
    //       return true;
    //     }
    //   }*/

    //   const fileType: String = this.selectedFile.type;
    //   const allowList: String[] = ['image/png', 'image/jpeg'];
    //   const isvalideType: number = allowList.indexOf(fileType);
    //   if (isvalideType < 0) {
    //     this.notificationsService.error(this.trans['general.common.error'],
    //       this.trans['Selected file should be an image (.png, .jpg)']);
    //     return false;
    //   }

    //   if (this.selectedFile.size > 500000) {
    //     this.notificationsService.error(this.trans['general.common.error'],
    //       this.trans['Maximum image size is 500 KB']);
    //     return false;
    //   }

    //   return true;
    // }

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

  }
