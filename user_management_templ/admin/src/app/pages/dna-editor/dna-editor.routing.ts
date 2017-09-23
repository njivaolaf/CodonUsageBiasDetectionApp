import { Routes, RouterModule } from '@angular/router';

import { DnaEditorComponent } from './dna-editor.component';
// import { ModuleWithProviders } from '@angular/core';

/*export */const routes: Routes = [
  {
    path: '',
    component: DnaEditorComponent,
    children: [],
  },
];

export const routing /*: ModuleWithProviders*/ = RouterModule.forChild(routes);
