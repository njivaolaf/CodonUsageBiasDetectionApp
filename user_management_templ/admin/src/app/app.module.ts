import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';
import { AUTH_PROVIDERS } from './auth.service';
import { AuthGuard } from './auth-guard.service';
// import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { SDKBrowserModule } from './shared/sdk/index';
import { SharedModule } from './shared/shared.module';

// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    routing,
    SDKBrowserModule.forRoot(),
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({ // TODO: Outsource API_KEY in a config file
      apiKey: 'AIzaSyDFxWeEU-yG99A5O6vURYtNrnt5Xg4u9PE'
    }),
    SharedModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS,
    AUTH_PROVIDERS,
    AuthGuard//,
    // CanDeactivateGuard
  ]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}
