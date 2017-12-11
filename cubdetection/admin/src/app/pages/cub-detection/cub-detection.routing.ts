import { Routes, RouterModule } from '@angular/router';

import { CubDetectionComponent } from './cub-detection.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: CubDetectionComponent,
  },
];

export const routing = RouterModule.forChild(routes);
