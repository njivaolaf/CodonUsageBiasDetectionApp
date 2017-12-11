import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { NgaModule } from '../../theme/nga.module';
import { UserComponent } from './user.component';
import { routing } from './user.routing';
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
  declarations: [UserComponent]
})
export class UserModule { }
