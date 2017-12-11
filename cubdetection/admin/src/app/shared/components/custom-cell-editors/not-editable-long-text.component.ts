import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TextViewerModalComponent } from './text-viewer-modal.component';

interface LongText {
    title: string;
    value: string;
    maxlength: number;
}

@Component({
    template: `
        <a *ngIf="isTextTooLong" class="btn btn-default" (click)="showModal()">
            {{ renderValue }}
        </a>
        <span *ngIf="!isTextTooLong">{{ renderValue }}</span>
    `
})
export class NotEditableLongTextComponent extends DefaultEditor implements OnInit {

    renderValue: string;
    isTextTooLong: boolean;
    maxlength = 50;
    longText: LongText;

    constructor(private modalService: NgbModal) {
        super();
    }

    ngOnInit(): void {
        this.longText = JSON.parse(this.cell.getValue() as string) as LongText;
        this.maxlength = (this.longText && this.longText.maxlength) || this.maxlength;
        this.isTextTooLong = this.cell.newValue && this.cell.newValue.length > this.maxlength;
        this.renderValue = this.isTextTooLong ? this.cell.newValue.substring(0, this.maxlength) + '...' : this.cell.newValue;
    }

    showModal() {
        const activeModal = this.modalService.open(TextViewerModalComponent, { backdrop: 'static', keyboard: false });
        activeModal.result.then(result => {
            console.log('result: ', result);
        });
        activeModal.componentInstance.modalHeader = this.longText.title;
        activeModal.componentInstance.value = this.longText.value;
    }
}
