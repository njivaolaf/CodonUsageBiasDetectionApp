import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from './mainpage.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
];

export const routing = RouterModule.forChild(routes);
