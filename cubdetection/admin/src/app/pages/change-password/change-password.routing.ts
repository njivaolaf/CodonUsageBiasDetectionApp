import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordComponent } from './change-password.component';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordComponent
  }
];

export const routing = RouterModule.forChild(routes);
