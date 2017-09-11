import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../../environments/environment';

@Component({
    selector: 'media-viewer-modal',
    styleUrls: [('./media-viewer-modal.component.scss')],
    templateUrl: './media-viewer-modal.component.html'
})
export class MediaViewerModalComponent implements OnInit {

    modalHeader: string;
    apiUrl: string;

    constructor(private activeModal: NgbActiveModal) {
        this.apiUrl = environment.apiUrl;
    }

    ngOnInit(): void {
       
    }

    discardAndCloseModal() {
        this.activeModal.dismiss();
    }

    saveAndCloseModal() {
        this.activeModal.close();
    }
}
