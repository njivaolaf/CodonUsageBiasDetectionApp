import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent
  }
];

export const routing = RouterModule.forChild(routes);
