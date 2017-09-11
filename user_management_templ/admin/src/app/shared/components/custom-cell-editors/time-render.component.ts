import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    styleUrls: ['./time-render.component.scss'],
    template: `{{renderValue}}`,
})
export class TimeRenderComponent implements ViewCell, OnInit {

    renderValue;

    @Input() value: string | number;
    @Input() rowData: any;

    ngOnInit(): void {
        this.renderValue = this.value;         
    }
}
