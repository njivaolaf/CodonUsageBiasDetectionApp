import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { Router, NavigationExtras } from '@angular/router';
import { DnaApi } from './../../shared/sdk/services';
import { Dna } from './../../shared/sdk/models';
import { ColorEditorComponent, ColorRenderComponent } from './../../shared/components';
import { CustomValidations } from './../../shared/customValidation/customValidation';

@Component({
  selector: 'dna',
  templateUrl: './dna.component.html',
  styleUrls: ['./dna.component.scss']
})
export class DnaComponent implements OnInit {

  customValidations: CustomValidations = new CustomValidations();
  existingDnaList: Dna[] = [];
  source: LocalDataSource;
  settings: Object;
  options = {
    timeOut: 3000,
    showProgressBar: false,
    lastOnBottom: false,
    animate: 'fromLeft'
  };
  trans: Object;

  constructor(
    protected dnaApi: DnaApi,
    private notificationsService: NotificationsService,
    private translate: TranslateService, 
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.translate.get([
      'general.common.actions',
      'general.common.No_data_found',
      'general.common.sequencename',
      'general.common.confirm_save',
      'general.common.confirm_delete',
      'general.common.error',
      'general.common.sequencename_required',
      'general.common.sequencename_exist',
      'general.common.dna',
      'general.common.dna_created',
      'general.common.dna_saved',
      'general.common.dna_deleted',
      'general.common.Error',
      'general.common.This dna has been used, cannot delete.',
      'general.common.Cannot delete several dnaes at the same time.'
    ]).subscribe(
      trans => {
        this.trans = trans;
        this.source = new LocalDataSource();
        this.settings = {
          mode: 'external',
          actions: {
            columnTitle: this.trans['general.common.actions']
          },
          noDataMessage: this.trans['general.common.No_data_found'],
          add: {
            addButtonContent: '<i class="ion-ios-plus-outline"></i>',
            createButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmCreate: true
          },
          edit: {
            editButtonContent: '<i class="ion-edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmSave: true
          },
          delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true
          },
          columns: {
            sequencename: {
              title: this.trans['general.common.sequencename'],
              type: 'string',
            },
          },
        };
        this.loadData();
      });
  }

  loadData(): void {
    this.dnaApi.find<Dna>().subscribe(
      data => {
        this.existingDnaList = data;
        this.source.load(data);
      },
      err => { if (err && err.message) this.notificationsService.error(err.name, err.message); }
    );
  }
  onAddOrEdit(event) {
    console.log('clicked on add or edit');
    let selectedDnaId: number = 0;
    if (event.data) {
      selectedDnaId = (event.data as Dna).id;
    }
    // Set session data
    sessionStorage.setItem('id', selectedDnaId.toString());
    // Redirect toeditor
    console.log('redirecting');
    this.router.navigate(['/pages/dna-editor']);
  }
  onCreateConfirm(event): void {
    const item = event.newData as Dna;
    if (this.validateDna(item)) {
      this.createDna(item);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event) {
    if (window.confirm(this.trans['general.common.confirm_save'])) {
      const item = event.newData as Dna;
      if (this.validateDna(item)) {
        this.updateDna(item);
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
    } else {
      event.confirm.reject();
    }
  }

  onDeleteConfirm(event): void {
    console.log('clicked on delete');
    if (window.confirm(this.trans['general.common.confirm_delete'])) {
      const item = event.data as Dna;
      this.deleteDna(item);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  validateDna(item: Dna): boolean {
    if (!this.customValidations.isNotNullAndNotEmptyString(item.sequencename)) {
      this.notificationsService.error(this.trans['general.common.error'],
        this.trans['general.common.sequencename_required']);
      return false;
    }
    // Validate unique sequencename
    // TODO: Move this logic to server side
    const filteredDnaList: Dna[] = this.existingDnaList.filter(
      c => c.sequencename.trim().toLowerCase() === item.sequencename.trim().toLowerCase());
    if (filteredDnaList.length > 0 && filteredDnaList[0].id !== item.id) {
      this.notificationsService.error(this.trans['general.common.error'],
        this.trans['general.common.sequencename_exist']);
      return false;
    }
    // End validate unique sequencename
    return true;
  }

  createDna(item: Dna) {
    this.dnaApi.create(item).subscribe(
      () => {
        this.loadData();
        this.notificationsService.success(this.trans['general.common.dna'],
          this.trans['general.common.dna_created']);
      },
      err => {
        if (err && err.message) {
          this.notificationsService.error(err.name, err.message);
          this.loadData();
        }
      }
    );
  }

  updateDna(item: Dna) {
    this.dnaApi.patchAttributes(item.id, item).subscribe(
      () => {
        this.notificationsService.success(this.trans['general.common.dna'],
          this.trans['general.common.dna_saved']);
        this.loadData();
      },
      err => {
        if (err && err.message) {
          this.notificationsService.error(err.name, err.message);
          this.loadData();
        }
      }
    );
  }

  deleteDna(item: Dna) {
    this.dnaApi.deleteById(item.id).subscribe(
      () => {
        this.notificationsService.success(this.trans['general.common.dna'],
          this.trans['general.common.dna_deleted']);
        this.loadData();
      },
      err => {
        if (err && err.message) {
          const name = this.trans['general.common.' + err.name] ? this.trans['general.common.' + err.name] : err.name;
          const message = this.trans['general.common.' + err.message] ? this.trans['general.common.' + err.message] : err.message;
          this.notificationsService.error(name, message);
          this.loadData();
        }
      }
    );
  }
}
