import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';


import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { AccountApi } from '../../shared/sdk/services';
import { AuthService } from '../../auth.service';
import { Account, LoopBackFilter } from '../../shared/sdk/models';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  trans: Object;
  existingUserList: Account[] = [];
  public form: FormGroup;
  public firstName: AbstractControl;

  public lastName: AbstractControl;
  public email: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public passwords: FormGroup;
  options = {
    timeOut: 3000,
    showProgressBar: false,
    lastOnBottom: false,
    animate: 'fromLeft'
  };
  public submitted: boolean = false;

  constructor(fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private authService: AuthService,
    protected accountApi: AccountApi,
    private notificationsService: NotificationsService, ) {

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
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
    });

    this.lastName = this.form.controls['lastName'];
    this.firstName = this.form.controls['firstName'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  ngOnInit() {
    this.translate.get([
      'general.common.error',
      'general.common.status',
      'user.user_created',
      'user.email_exist'
    ]).subscribe(
      trans => {
        this.trans = trans;

      });
  }




  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      var form_values = this.form.value;
      var newAccount = new Account();
      newAccount.firstName = form_values.firstName;
      newAccount.lastName = form_values.lastName;
      newAccount.email = form_values.email;
      newAccount.password = form_values.passwords;
      newAccount.locked = false;
      newAccount.active = true;
      this.accountApi.ckeckIfEmailExists(newAccount.email).subscribe(
        (foundEmailBool) => {

          if (foundEmailBool) {

            this.notificationsService.error(this.trans['general.common.error'],
              this.trans['user.email_exist']);
          } else {
            this.createUser(newAccount);
          }

        }, err => {
          if (err & err.message) {
            this.notificationsService.error(this.trans['general.common.error'],
              this.trans['user.email_exist']);
          }
        }
      );
    }
  }

  createUser(item: Account) {
    this.accountApi.create(item).subscribe(
      () => {
        this.notificationsService.success(this.trans['general.common.status'],
          this.trans['user.user_created']);
        setTimeout(() => {
          this.deactivateRoute();
        }, 1500);
      },
      err => {
        if (err && err.message) {
          this.notificationsService.error(err.name, err.message);
        }
      },
    );
  }

  private ReturnNow(): void {
    this.deactivateRoute();
  }

  private deactivateRoute(): void {
    if (this.authService.redirectUrl) {
      this.router.navigate([this.authService.redirectUrl], {
        preserveQueryParams: true,
        preserveFragment: true
      } as NavigationExtras);
    } else {
      this.router.navigate(['/mainpage']);
    }
  }
}
