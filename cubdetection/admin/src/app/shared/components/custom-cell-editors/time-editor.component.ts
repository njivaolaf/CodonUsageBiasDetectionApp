import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Cell, DefaultEditor, Editor } from 'ng2-smart-table';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  styleUrls: ['./time-editor.component.scss'],
  template: `

  `,
})
export class TimeEditorComponent extends DefaultEditor implements OnInit {
  // <pre>Selected time: {{currentSelectedtime | json}}</pre>

  currentSelectedtime = { hour: 13, minute: 0 };

  constructor() {
    super();
  }

  ngOnInit(): void {
    const currentDateTime = new Date();

    if (this.cell.newValue === '') {
      this.currentSelectedtime = { hour: currentDateTime.getHours(), minute: currentDateTime.getMinutes() };
      this.setNewCellVal(this.currentSelectedtime);
    } else {
      // GET HOURS AND MINUTES
      const timeArray: string[] = this.cell.newValue.split(':');
      let hours = +timeArray[0];
      const minutes = +timeArray[1];

      // GET AM OR PM
      let amOrPm: string = this.cell.newValue.toString();
      amOrPm = amOrPm.substr(amOrPm.length - 2, amOrPm.length);

      // ADD 12H IF PM
      if (amOrPm === 'PM') {
        hours = hours + 12;
      }

      // DISPLAY TIME IN EDIT MODE
      this.currentSelectedtime = { hour: hours, minute: minutes };

    }
  }

  setNewCellVal(val) {
    this.cell.newValue = val.hour.toString().concat(':').concat(val.minute.toString());
  }

}
