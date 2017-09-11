import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { AccountApi } from '../../shared/sdk/services';
import { Account, LoopBackFilter } from '../../shared/sdk/models';
import { CustomValidations } from '../../shared/customValidation/customValidation';
import { AuthService, User } from '../../auth.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  customValidations: CustomValidations = new CustomValidations();
  existingUserList: Account[] = [];
  source: LocalDataSource;
  settings: Object;
  options = {
    timeOut: 3000,
    showProgressBar: false,
    lastOnBottom: false,
    animate: 'fromLeft'
  };
  trans: Object;
  currentUser: User;

  constructor(
    protected accountApi: AccountApi,
    private notificationsService: NotificationsService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getUser();
  }

  ngOnInit() {
    this.translate.get([
      'general.common.actions',
      'general.common.No_data_found',
      'general.common.confirm_save',
      'general.common.error',
      'general.common.status',
      'user.first_name',
      'user.last_name',
      'user.active',
      'user.locked',
      'login.email',
      'user.email_not_editable',
      'user.first_name_required',
      'user.last_name_required',
      'user.email_required',
      'user.invalid_email',
      'user.email_exist',
      'user.user_created',
      'user.account_not_created',
      'user.user_saved'
    ]).subscribe(
      trans => {
        this.trans = trans;
        this.source = new LocalDataSource();
        this.settings = {
          actions: {
            columnTitle: this.trans['general.common.actions'],
            delete: false
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
          columns: {
            firstName: {
              title: this.trans['user.first_name'],
              type: 'string'
            },
            lastName: {
              title: this.trans['user.last_name'],
              type: 'number'
            },
            email: {
              title: this.trans['login.email'],
              type: 'string'
            },
            _active: {
              title: this.trans['user.active'],
              editor: {
                type: 'checkbox',
                config: {
                  true: 'Yes',
                  false: 'No'
                }
              }
            },
            _locked: {
              title: this.trans['user.locked'],
              editor: {
                type: 'checkbox',
                config: {
                  true: 'Yes',
                  false: 'No'
                }
              }
            }
          }
        };
        this.loadData();
      });
  }

  loadData(): void {
    this.accountApi.find<Account>({
      where: { id: { neq: this.currentUser.id } },
      order: 'email asc'
    } as LoopBackFilter).subscribe(
      data => {
        this.existingUserList = data;
        for (let item of data) {
          item['_active'] = item.active === true ? 'Yes' : 'No';
          item['_locked'] = item.locked === true ? 'Yes' : 'No';
        }
        this.source.load(data);
      },
      err => {
        if (err) {
          if (err.statusCode === 401) this.deactivateRoute();
          else this.notificationsService.error(err.name, err.message);
        }
      }
      );
  }

  onCreateConfirm(event): void {
    const item = event.newData as Account;
    if (this.validateUser(item)) {
      this.createUser(item);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event) {
    const oldValue = event.data;
    const newValue = event.newData;
    if (oldValue['email'] !== newValue['email']
      || oldValue['firstName'] !== newValue['firstName']
      || oldValue['lastName'] !== newValue['lastName']
      || oldValue['_active'] !== newValue['_active']
      || oldValue['_locked'] !== newValue['_locked']) {
      if (window.confirm(this.trans['general.common.confirm_save'])) {
        const item = event.newData as Account;
        if (this.validateUser(item)) {
          this.updateUser(item);
          event.confirm.resolve();
        } else {
          event.confirm.reject();
        }
      } else {
        event.confirm.reject();
      }
    } else {
      event.confirm.resolve();
    }
  }

  validateUser(item: Account): boolean {
    if (!this.customValidations.isNotNullAndNotEmptyString(item.firstName)) {
      this.notificationsService.error(this.trans['general.common.error'],
        this.trans['user.first_name_required']);
      return false;
    }
    if (!this.customValidations.isNotNullAndNotEmptyString(item.lastName)) {
      this.notificationsService.error(this.trans['general.common.error'],
        this.trans['user.last_name_required']);
      return false;
    }
    if (!item.id) { // new item
      if (!this.customValidations.isNotNullAndNotEmptyString(item.email)) {
        this.notificationsService.error(this.trans['general.common.error'],
          this.trans['user.email_required']);
        return false;
      }
      if (!this.customValidations.isValidateEmail(item.email)) {
        this.notificationsService.error(this.trans['general.common.error'],
          this.trans['user.invalid_email']);
        return false;
      }
      // Validate unique email
      const filteredUserList: Account[] = this.existingUserList.filter(
        u => u.email.trim().toLowerCase() === item.email.trim().toLowerCase());
      if (filteredUserList.length > 0 && filteredUserList[0].id !== item.id) {
        this.notificationsService.error(this.trans['general.common.error'],
          this.trans['user.email_exist']);
        return false;
      }
    }
    return true;
  }

  createUser(item: Account) {
    this.accountApi.create(item).subscribe(
      () => {
        this.loadData();
        this.notificationsService.success(this.trans['general.common.status'],
          this.trans['user.user_created']);
      },
      err => {
        if (err && err.message) {
          this.notificationsService.error(err.name, err.message);
          this.loadData();
        }
      },
    );
  }

  updateUser(item: Account) {
    this.setActive(item, item['_active']);
    var oldLockedValue = item.locked;
    this.setLocked(item, item['_locked']);
    if (oldLockedValue !== item.locked && !item.locked)
      item['badPasswordCount'] = 0;
    this.accountApi.patchAttributes(item.id, item).subscribe(
      () => {
        this.loadData();
        this.notificationsService.success(this.trans['general.common.status'],
          this.trans['user.user_saved']);
      },
      err => {
        if (err && err.message) {
          this.notificationsService.error(err.name, err.message);
          this.loadData();
        }
      },
    );
  }

  private setActive(item: Account, active: string): void {
    item.active = active === 'Yes';
  }

  private setLocked(item: Account, locked: string): void {
    item.locked = locked === 'Yes';
  }

  private deactivateRoute(): void {
    if (this.authService.redirectUrl) {
      this.router.navigate([this.authService.redirectUrl], {
        preserveQueryParams: true,
        preserveFragment: true
      } as NavigationExtras);
    } else {
      this.router.navigate(['/pages/mainpage']);
    }
  }
}
