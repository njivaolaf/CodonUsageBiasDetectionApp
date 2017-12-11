import { Routes, RouterModule } from '@angular/router';

import { DnaComponent } from './dna.component';

const routes: Routes = [
  {
    path: '',
    component: DnaComponent,
  },
];

export const routing = RouterModule.forChild(routes);
