import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { CubDetectionComponent } from './cub-detection.component';
import { routing } from './cub-detection.routing';


import { AppTranslationModule } from '../../app.translation.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    AppTranslationModule,
    SharedModule, NgxChartsModule,// BrowserAnimationsModule
  ],
  declarations: [
    CubDetectionComponent,
  ],
})
export class CubDetectionModule { }
