import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Cell, DefaultEditor, Editor } from 'ng2-smart-table';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  styleUrls: ['./date-editor.component.scss'],
  template: `
  
  `,
})
export class DateEditorComponent extends DefaultEditor implements OnInit {

  model;

  currentSelectedDate: String = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.currentSelectedDate = this.cell.newValue;
  }

  myFunction(val) {
    this.cell.newValue = this.dateToString(val);
  }

  dateToString(dateVal): String {
    return dateVal.year.toString().concat('-').concat(this.addZeroToMonthOrDate(dateVal.month.toString())).concat('-')
      .concat(this.addZeroToMonthOrDate(dateVal.day.toString()));
  }

  addZeroToMonthOrDate(_number: string): string {
    if (_number.length > 1) {
      return _number;
    } else {
      return '0'.concat(_number);
    }
  }

}
