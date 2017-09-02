import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { CbuDetectComp } from './cbudetectmenu.component';
import { routing } from './cbudetectmenu.routing';

import { PieChart } from './pieChart';
import { PieChartService } from './pieChart/pieChart.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
  ],
  declarations: [
    PieChart,
    CbuDetectComp,
  ],
  providers: [
   
  ],
})
export class CbuDetectModule {}
