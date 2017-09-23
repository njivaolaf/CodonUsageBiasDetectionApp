import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { routing } from './dna-editor.routing';
import { SharedModule } from '../../shared/shared.module';
import { DnaEditorComponent } from './dna-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
    SharedModule,
  ],
  declarations: [DnaEditorComponent],
})
export class DnaEditorModule { }
