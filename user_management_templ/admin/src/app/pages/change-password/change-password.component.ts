import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { EqualPasswordsValidator } from '../../theme/validators';
import { AuthService, User } from '../../auth.service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  form: FormGroup;
  oldPassword: AbstractControl;
  password: AbstractControl;
  repeatPassword: AbstractControl;
  passwords: FormGroup;
  submitted: boolean = false;
  isCompleted: boolean = false;
  isChangePasswordLocked: boolean = false;
  options = {
    timeOut: 3000,
    showProgressBar: false,
    lastOnBottom: false,
    animate: 'fromLeft'
  };

  constructor(
    fb: FormBuilder,
    private notificationsService: NotificationsService,
    private authService: AuthService,
    private router: Router
  ) {
    const isLoggedIn = this.authService.isLoggedIn();
    if (typeof isLoggedIn === 'boolean') {
      if (!isLoggedIn)
        this.deactivateRoute();
    } else {
      isLoggedIn.subscribe(
        response => {
          if (response.status === 200) {
            this.authService.setUser(response.json() as User);
            const currentUser = this.authService.getUser();
            if (currentUser)
              this.isChangePasswordLocked = currentUser.changePasswordRequired;
          } else
            this.deactivateRoute();
        },
        error => this.deactivateRoute()
      );
    }

    this.form = fb.group({
      'oldPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
    });

    this.oldPassword = this.form.controls['oldPassword'];
    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      if (this.isPasswordStrong(this.password.value)) {
        this.authService.changePassword(this.oldPassword.value, this.password.value).subscribe(
          () => {
            this.notificationsService.success('Status',
              'Password changed successfully. You will need to use your new password on next login');
              setTimeout(() => {
                this.deactivateRoute();
              }, 2000);
            // this.authService.logout().subscribe(
            //   () => this.router.navigate(['/login']),
            //   err => {
            //     if (err) {
            //       if (err.statusCode === 401) {
            //         this.router.navigate(['/login']);
            //       } else if (err.message) {
            //         this.notificationsService.error(err.name, err.message);
            //       }
            //     }
            //   }
            // );
          },
          err => {
            if (err && err.message) {
              if (err.name === 'INVALID_NEW_PASSWORD') {
                this.notificationsService.error('Error', 'New password should not contain user name OR email');
              } else {
                this.notificationsService.error(err.name, err.message);
              }
              return;
            }
          }
        );
      } else {
        this.notificationsService.error('Error', 'New password does not meet required criteria');
      }
    }
  }

  isPasswordStrong(_newPassword: string): boolean {
    const minOneNumeric = /[0-9]/g;
    const minOneUpper = /[A-Z]/g;
    const minOneLower = /[a-z]/g;
    const doesNotHaveSpecial = new RegExp('^[a-zA-Z0-9]*$');
    if (!minOneLower.test(_newPassword))
      return false;
    if (!minOneUpper.test(_newPassword))
      return false;
    if (!minOneNumeric.test(_newPassword))
      return false;
    if (doesNotHaveSpecial.test(_newPassword))
      return false;
    return true;
  }

  onCancelClicked(event: Event) {
    event.preventDefault();
    this.deactivateRoute();
  }

  private deactivateRoute(): void {
    if (this.authService.redirectUrl) {
      this.router.navigate([this.authService.redirectUrl], {
        preserveQueryParams: true,
        preserveFragment: true
      } as NavigationExtras);
    } else {
      this.router.navigate(['mainpage']);
    }
  }
}
