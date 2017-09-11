import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Cell, DefaultEditor, Editor } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LocationPickerModalComponent } from './location-picker-modal.component';
import { GeoPoint } from '../../../shared/sdk';

@Component({
    styleUrls: ['./location-editor.component.scss'],
    template: `
        <button class="btn btn-default btn-with-icon btn-xs" type="button"
                (click)="showModal()" style="color:#163174;">
            <i class="ion-location"></i>{{ renderValue }}
        </button>
    `
})
export class LocationEditorComponent extends DefaultEditor implements OnInit {

    renderValue: string;
    private _location: GeoPoint;

    constructor(private modalService: NgbModal) {
        super();
    }

    ngOnInit(): void {
        this._location = this.cell.getValue() as GeoPoint;
        this.renderValue = this._location ? `${this._location.lat}, ${this._location.lng}` : '';
    }

    showModal() {
        const activeModal = this.modalService.open(LocationPickerModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        activeModal.result.then(result => {
            const newValue = { lat: result.lat, lng: result.lng } as GeoPoint;
            this.cell.newValue = newValue;
            this._location = newValue;
            this.renderValue = this._location ? `${this._location.lat}, ${this._location.lng}` : '';
        });
        if (this._location) {
            activeModal.componentInstance.lat = this._location.lat;
            activeModal.componentInstance.lng = this._location.lng;
        }
    }
}
