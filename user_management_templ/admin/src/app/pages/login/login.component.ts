import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../auth.service';
import { Account } from '../../shared/sdk/models';
import { CustomValidations } from '../../shared/customValidation/customValidation';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;
  options = {
    timeOut: 3000,
    showProgressBar: false,
    lastOnBottom: false,
    animate: 'fromLeft'
  };
  customValidations: CustomValidations = new CustomValidations();

  private account: Account = new Account();

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    const isLoggedIn = this.authService.isLoggedIn();
    if (typeof isLoggedIn === 'boolean') {
      if (isLoggedIn)
        this.deactivateRoute();
    } else {
      isLoggedIn.subscribe(
        response => {
          if (response.status === 200)
            this.deactivateRoute();
        }
      );
    }

    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  onSubmit(values: Object): void {
    this.account.email = values['email'];
    this.account.password = values['password'];
    this.submitted = true;
    if (this.form.valid) {
      this.authService.login(this.account).subscribe(
        token => {
          if (this.authService.redirectUrl !== undefined && this.authService.redirectUrl !== null) {
            const navigationExtras: NavigationExtras = {
              preserveQueryParams: true,
              preserveFragment: true
            };
            this.router.navigate([this.authService.redirectUrl], navigationExtras);
            return;
          }
          this.router.navigate(['/home']);
        },
        err => {
          if (err && err.message) {
            this.notificationsService.error(err.name, err.message);
          }
        }
      );
    }
  }

  ReturnNow() {
    this.router.navigate(['/cub-detection']);
  }
  onForgetPassword() {
    if (window.confirm('Are you sure you want to reset your password')) {
      this.email = this.form.controls['email'];
      if (this.validateEmailBeforeReset()) {
        this.authService.resetPassword(this.email.value.toString()).subscribe(
          (result) => {
            this.notificationsService.success('Status', 'Your new password have been sent by mail');
          },
          err => {
            if (err && err.message) {
              if (err.name === 'ACCOUNT_NOT_FOUND') {
                this.notificationsService.error('Error', 'Wrong email');
              } else {
                this.notificationsService.error(err.name, err.message);
              }
            }
          },
        );
      }
    }
  }

  validateEmailBeforeReset(): Boolean {
    if (!this.customValidations.isNotNullAndNotEmptyString(this.email.value)) {
      this.notificationsService.error(
        this.translate.instant('general.common.error'),
        this.translate.instant('Email is required to reset password')
      );
      return false;
    }
    if (!this.customValidations.isValidateEmail(this.email.value)) {
      this.notificationsService.error(
        this.translate.instant('general.common.error'),
        this.translate.instant('Invalid email')
      );
      return false;
    }
    return true;
  }

  private deactivateRoute(): void {
    if (this.authService.redirectUrl) {
      this.router.navigate([this.authService.redirectUrl], {
        preserveQueryParams: true,
        preserveFragment: true
      } as NavigationExtras);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
