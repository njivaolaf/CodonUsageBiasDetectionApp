import { Component, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    styleUrls: ['./color-render.component.scss'],
    template: `<div class="selectedcolor" [style.background-color]="value"></div>`
})
export class ColorRenderComponent implements ViewCell {

    @Input() value: string | number;
    @Input() rowData: any;

}
