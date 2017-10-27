import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './../auth-guard.service';
// import { CanDeactivateGuard } from './../can-deactivate-guard.service';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dna', pathMatch: 'full' }, // pathMatch: 'full'
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule',
      },

      {
        path: 'dna',
        loadChildren: './dna/dna.module#DnaModule',
      },
      {
        path: 'dna-editor',
        loadChildren: './dna-editor/dna-editor.module#DnaEditorModule',
      },
    ],
  },
  { path: '', redirectTo: 'mainpage', pathMatch: 'full' },
  {
    path: 'change-password',
    loadChildren: 'app/pages/change-password/change-password.module#ChangePasswordModule',
  },
  {
    path: 'cub-detection',
    component: Pages,
    canActivate: [AuthGuard],
    loadChildren: 'app/pages/cub-detection/cub-detection.module#CubDetectionModule',
  },
  {
    path: 'mainpage',
    component: Pages,
    canActivate: [AuthGuard],
    loadChildren: 'app/pages/mainpage/mainpage.module#MainPageModule',
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
