import { Component } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  styleUrls: ['./color-editor.component.scss'],
  template: `
    <input type="color"
           [ngClass]="inputClass"
           class="form-control"
           [(ngModel)]="cell.newValue"
           [name]="cell.getId()"
           [placeholder]="cell.getTitle()"
           [disabled]="!cell.isEditable()"
           (click)="onClick.emit($event)"
           (keydown.enter)="onEdited.emit($event)"
           (keydown.esc)="onStopEditing.emit()">
    `
})
export class ColorEditorComponent extends DefaultEditor {

  constructor() {
    super();
  }
}
