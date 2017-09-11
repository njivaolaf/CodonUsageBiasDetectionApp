import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { NgaModule } from '../../theme/nga.module';
import { MainPageComponent } from './mainpage.component';
import { routing } from './mainpage.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
    SharedModule
  ],
  declarations: [MainPageComponent],
})
export class MainPageModule { }
