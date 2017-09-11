import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TextEditorModalComponent } from './text-editor-modal.component';

interface LongText {
    title: string;
    value: string;
    maxlength: number;
}

@Component({
    template: `
        <a class="btn btn-default" (click)="showModal()">
            <i class="ion-edit"></i> {{ renderValue }}
        </a>
    `
})
export class TextEditorComponent extends DefaultEditor implements OnInit {

    renderValue: string;
    maxlength = 50;
    longText: LongText;

    constructor(private modalService: NgbModal) {
        super();
    }

    ngOnInit(): void {
        this.longText = JSON.parse(this.cell.getValue() as string) as LongText;
        this.maxlength = (this.longText && this.longText.maxlength) || this.maxlength;
        this.renderValue = this.formatValue(this.cell.newValue as string);
    }

    showModal() {
        const activeModal = this.modalService.open(TextEditorModalComponent, { backdrop: 'static', keyboard: false });
        activeModal.result.then(result => {
            this.cell.newValue = result as string;
            this.renderValue = this.formatValue(this.cell.newValue);
        });
        activeModal.componentInstance.modalHeader = this.longText.title;
        activeModal.componentInstance.value = this.cell.newValue;
    }

    private formatValue(input: string): string {
        const isTextTooLong = input && input.length > this.maxlength;
        return isTextTooLong ? input.substring(0, this.maxlength) + '...' : input;
    }
}
