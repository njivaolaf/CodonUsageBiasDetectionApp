import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    styleUrls: ['./date-render.component.scss'],
    template: `{{renderValue}}`,
})
export class DateRenderComponent implements ViewCell, OnInit {

    renderValue;

    @Input() value: string | number;
    @Input() rowData: any;

    ngOnInit(): void {
        this.renderValue = this.value;         
    }
    // Model: {{ model | json }} {{renderValue}}
}
