import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'text-editor-modal',
    styleUrls: [('./text-editor-modal.component.scss')],
    templateUrl: './text-editor-modal.component.html'
})
export class TextEditorModalComponent implements OnInit {

    modalHeader: string;
    value: string;
    maxLength = 200;

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit(): void {
    }

    discardAndCloseModal() {
        this.activeModal.dismiss();
    }

    saveAndCloseModal() {
        this.activeModal.close(this.value);
    }
}
