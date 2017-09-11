import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
 import { LoopBackConfig } from './app/shared/sdk';
import { environment } from '././environments/environment';


LoopBackConfig.setBaseURL(environment.apiUrl);
LoopBackConfig.setApiVersion(environment.apiVersion);
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
