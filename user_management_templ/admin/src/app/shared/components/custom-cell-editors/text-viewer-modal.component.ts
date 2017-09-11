import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'text-viewer-modal',
    styleUrls: [('./text-viewer-modal.component.scss')],
    templateUrl: './text-viewer-modal.component.html'
})
export class TextViewerModalComponent implements OnInit {

    modalHeader: string;
    value: string;

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit(): void {
    }

    discardAndCloseModal() {
        this.activeModal.dismiss();
    }

    saveAndCloseModal() {
        this.activeModal.close();
    }
}
