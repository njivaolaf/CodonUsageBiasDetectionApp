import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule',
  },
  
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'cbudetectmenu', pathMatch: 'full' },
      { path: 'cbudetectmenu', loadChildren: './cbudetectmenu/cbudetectmenu.module#CbuDetectModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
