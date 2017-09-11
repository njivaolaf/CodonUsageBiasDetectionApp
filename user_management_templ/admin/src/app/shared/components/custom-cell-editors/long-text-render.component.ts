import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TextViewerModalComponent } from './text-viewer-modal.component';

interface LongText {
    title: string;
    value: string;
    maxlength: number;
}

@Component({
    template: `
        <a *ngIf="isTextTooLong" class="btn btn-default" (click)="showModal()" style="padding-left: 0; padding-right: 0;">
            {{ renderValue }}
        </a>
        <span *ngIf="!isTextTooLong">{{ renderValue }}</span>
    `
})
export class LongTextRenderComponent implements ViewCell, OnInit {

    renderValue: string;
    isTextTooLong: boolean;
    maxlength = 50;
    longText: LongText;

    @Input() value: string | number;
    @Input() rowData: any;

    constructor(private modalService: NgbModal) { }

    ngOnInit(): void {
        this.longText = JSON.parse(this.value as string) as LongText;
        this.maxlength = (this.longText && this.longText.maxlength) || this.maxlength;
        this.isTextTooLong = this.longText.value && this.longText.value.length > this.maxlength;
        this.renderValue = this.isTextTooLong ? this.longText.value.substring(0, this.maxlength) + '...' : this.longText.value;
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
