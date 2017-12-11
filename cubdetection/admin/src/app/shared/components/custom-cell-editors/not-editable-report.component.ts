import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
    template: `<span>{{ renderValue }}</span>`
})
export class NotEditableReportComponent extends DefaultEditor implements OnInit {

    renderValue: string;

    constructor() {
        super();
    }

    ngOnInit(): void {
        if (this.cell.getId() === 'uploads' && this.cell.newValue) {
            const uploads = this.cell.newValue as Array<Object>;
            if (uploads.length > 0) {
                const plural = uploads.length > 1 ? 's' : '';
                this.renderValue = `${uploads.length} upload${plural}`;
            } else {
                this.renderValue = 'No upload';
            }
        } else {
            this.renderValue = this.cell.getValue();
        }
    }
}
