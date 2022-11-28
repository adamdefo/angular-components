import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';

import {getDayOfWeek, DAYS_OF_WEEK, MONTHS, Day} from './../schedule.helpers';
// import { PopupService } from '../../popup/popup.service';

interface SelectedDate {
  year: number;
  month: number;
  data: any;
}

enum Mode {
  year = 'year',
  month = 'month',
  week = 'week',
}

@Component({
  selector: 'app-schedule-month',
  templateUrl: './schedule-month.component.html',
  styleUrls: ['./schedule-month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheduleMonthComponent implements OnInit {

  constructor(
    // private popupSvc: PopupService,
  ) { }

  daysOfWeek = DAYS_OF_WEEK;
  months = MONTHS;

  // @ViewChild('tooltip', {static: false}) private tooltipTpl: TemplateRef<any>;
  selectedFlow = null;

  private _selectedDate: SelectedDate = {year: 0, month: 0, data: null};
  @Input() set selectedDate(date: SelectedDate) {
    this._selectedDate = date;
    this.calendar = [...this.createCalendarRows(moment(new Date(date.year, date.month)), date.data)];
  }
  get selectedDate(): SelectedDate {
    return this._selectedDate;
  }

  @Input() isShowMonth = true;

  @Input() mode: Mode = Mode.year;
  Mode = Mode;

  selectedDay: Day | null = null;

  calendar: Day[][] = [];

  selectedDay$: Subject<any> = new Subject<any>();

  ngOnInit(): void {}

  createCalendarRows(now: moment.Moment, data: any[]): any[] {
    const date = now.clone();

    const countDaysFromPrevMonth = getDayOfWeek(date.startOf('month'));
    if (countDaysFromPrevMonth > 0) {
      date.subtract(countDaysFromPrevMonth, 'days');
    }

    let row: Day[] = [];
    const rows = [];

    for (let i = 0; i < 42; i++) {
      const tooltipData = data.filter(d => {
        const dt = new Date(d.date.start);
        return date.date() === dt.getDate() && date.month() === dt.getMonth();
      });

      row.push({
        d: date.date(),
        m: date.month(),
        y: date.year(),
        tooltipData,
        count: tooltipData.length,
        isCurrent: moment().isSame(date, 'date'),
        isDisabled: !now.isSame(date, 'month'),
        isSelected: false,
      } as Day);
      // если в строке 7 значений, то создаем новую
      if (row.length === 7) {
        rows.push(row);
        row = [];
      }
      date.add(1, 'day').clone();
    }

    return rows;
  }

  onSelectDay(day: Day): void {
    if (!day.count) {
      return;
    }

    if (!this.selectedDay) {
      this.selectedDay = day;
      day.isSelected = true;
      // this.popupSvc.commitData({ title: `${day.d} ${this.months[day.m]}`, template: this.tooltipTpl});
      return;
    }

    this.unSelectDay();

    if (this.selectedDay.d === day.d) {
      this.selectedDay = null;
      // this.popupSvc.close();
      return;
    }

    this.selectedDay = day;
    day.isSelected = true;
    // this.popupSvc.commitData({ title: `${day.d} ${this.months[day.m]}`, template: this.tooltipTpl});
  }

  private unSelectDay(): void {
    for (const week of this.calendar) {
      for (const day of week) {
        day.isSelected = false;
      }
    }
  }

}
