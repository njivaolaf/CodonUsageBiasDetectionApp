import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
    icon: string;
}

@Component({
    selector: 'location-picker-modal',
    styleUrls: [('./location-picker-modal.component.scss')],
    templateUrl: './location-picker-modal.component.html'
})
export class LocationPickerModalComponent implements OnInit {

    modalHeader: string;
    zoom: number = 10;
    lat: number = -20.348404;
    lng: number = 57.55215199999998;
    markers: marker[] = [];
    currentCamera: marker;
    isWarningSign: Boolean;
    txtLat: number;
    txtLng: number;

    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit(): void {
       // this.modalHeader = this.isWarningSign ? 'Warning sign' : 'GPS Sensor';  //if want to display gps sensor on title
       this.modalHeader = this.isWarningSign ? 'Warning sign' : ' ';
        if (this.currentCamera) {
            this.markers.push(this.currentCamera);
        }
        if (this.markers.length > 0) {
            this.lat = this.txtLat ? this.txtLat : -20.348404;
            this.lng = this.txtLng ? this.txtLng : 57.55215199999998;
            this.zoom = this.txtLat ? 16 : 10;
            this.markers = this.markers;
        }
    }

    mapClicked($event: MouseEvent) {
        this.txtLat = $event['coords'].lat;
        this.txtLng = $event['coords'].lng;
        this.markers = [{
            lat: $event['coords'].lat,
            lng: $event['coords'].lng,
            label: `${$event['coords'].lat}, ${$event['coords'].lng}`,
            draggable: true,
            icon: this.isWarningSign ? 'http://res.cloudinary.com/eboard/image/upload/v1499172930/sign_figupz.png' : 'https://lh4.ggpht.com/UHGFFlMfJPYVxFpKDoIeqvr1aKmM1PMNfS9cYtCFlNbgJGFFpDps0JfcLlN40JAMCmS7=w50'
        }];
        if (this.currentCamera) {
            this.markers.push(this.currentCamera);
        }
    }

    markerDragEnd(m: marker, $event: MouseEvent) {
        m.lat = $event['coords'].lat;
        m.lng = $event['coords'].lng;
        this.txtLat = $event['coords'].lat;
        this.txtLng = $event['coords'].lng;
        console.log('dragEnd', m, $event);
    }

    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`);
        if (label !== 'CAMERA_GPS') {
            this.markers.splice(index, 1);
        }
        console.log('Markers: ', this.markers);
    }

    discardAndCloseModal() {
        this.activeModal.dismiss();
    }

    saveAndCloseModal() {
        if (this.txtLat && this.txtLng) {
            this.markers = [{
                lat: parseFloat(this.txtLat.toString()),
                lng: parseFloat(this.txtLng.toString()),
                label: `${this.txtLat}, ${this.txtLng}`,
                draggable: true,
                icon: this.isWarningSign ? 'http://res.cloudinary.com/eboard/image/upload/v1499172930/sign_figupz.png' : 'https://lh4.ggpht.com/UHGFFlMfJPYVxFpKDoIeqvr1aKmM1PMNfS9cYtCFlNbgJGFFpDps0JfcLlN40JAMCmS7=w50'
            }];
        }
        this.activeModal.close(this.markers[0]);
    }
}
