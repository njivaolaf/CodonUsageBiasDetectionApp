import { Component } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
    selector: 'cbu-dropdown-editor',
    template: `
    <select [ngClass]="inputClass"
            class="form-control"
            [(ngModel)]="cell.newValue"
            [name]="cell.getId()"
            [disabled]="!cell.isEditable()"
            (click)="onClick.emit($event)"
            (keydown.enter)="onEdited.emit($event)"
            (keydown.esc)="onStopEditing.emit()">

        <option *ngFor="let option of cell.getColumn().getConfig()?.list" [value]="option.id">
            {{ option[cell.getColumn().getConfig()?.displayField] }}
        </option>
    </select>
    `,
})
export class DropdownEditorComponent extends DefaultEditor {

    constructor() {
        super();
    }
}
