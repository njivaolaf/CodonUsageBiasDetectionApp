import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import {
    ColorEditorComponent,
    ColorRenderComponent,
    IconRenderComponent,
    IconEditorComponent,
    NotEditableReportComponent,
    DropdownEditorComponent,
    LongTextRenderComponent,
    NotEditableLongTextComponent, LocationRenderComponent, LocationEditorComponent,
    TextEditorComponent,
} from '../../shared/components';
import { CustomValidations } from '../../shared/customValidation/customValidation';

@Component({
    selector: 'mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.scss']
})
export class MainPageComponent {
    
}
