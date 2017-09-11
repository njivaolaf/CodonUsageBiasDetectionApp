import { Component, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    styleUrls: ['./icon-render.component.scss'],
    template: `<i class="fa {{value}}"></i>`
})
export class IconRenderComponent implements ViewCell {

    @Input() value: string | number;
    @Input() rowData: any;

}
