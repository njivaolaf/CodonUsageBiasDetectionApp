import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Cell, DefaultEditor, Editor } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IconPickerModalComponent } from './icon-picker-modal.component';

@Component({
    styleUrls: ['./icon-editor.component.scss'],
    template: `
        <a class="btn btn-default" (click)="showModal()">
            <i *ngIf="renderValue" class="fa {{ renderValue }}"></i>
            <span *ngIf="!renderValue">Select icon</span>
        </a>
    `
})
export class IconEditorComponent extends DefaultEditor implements OnInit {

    renderValue: string;

    constructor(private modalService: NgbModal) {
        super();
    }

    ngOnInit(): void {
        this.renderValue = this.cell.getValue() as string;
    }

    showModal() {
        const activeModal = this.modalService.open(IconPickerModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        activeModal.result.then(result => {
            this.cell.newValue = result;
            this.renderValue = result;
        });
    }
}
