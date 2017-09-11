import { Component } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
    selector: 'cbu-dropdown-gender-editor',
    template: `
    <select [ngClass]="inputClass"
            class="form-control"
            [(ngModel)]="cell.newValue"
            [name]="cell.getId()"
            [disabled]="!cell.isEditable()"
            (click)="onClick.emit($event)"
            (keydown.enter)="onEdited.emit($event)"
            (keydown.esc)="onStopEditing.emit()">

        <option *ngFor="let option of cell.getColumn().getConfig()?.list" [value]="option">
            {{ option }}
        </option>
    </select>
    `,
})
export class DropdownGenderEditorComponent extends DefaultEditor {

    constructor() {
        super();
    }
}
