import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { GeoPoint } from '../../../shared/sdk';

@Component({
    template: `{{renderValue}}`
})
export class LocationRenderComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    ngOnInit(): void {
        const location = this.value as GeoPoint;
        this.renderValue = location ? `${location.lat}, ${location.lng}` : '';
    }

}
