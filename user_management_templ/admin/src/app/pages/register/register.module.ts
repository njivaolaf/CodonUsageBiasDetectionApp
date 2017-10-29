import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';


import { SharedModule } from '../../shared/shared.module';

import { AppTranslationModule } from '../../app.translation.module';
import { Register } from './register.component';
import { routing } from './register.routing';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, AppTranslationModule,
    FormsModule,
    NgaModule,
    routing,SharedModule
    
  ],
  declarations: [
    Register
  ]
})
export class RegisterModule { }
