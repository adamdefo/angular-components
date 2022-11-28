import {Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {getDayOfWeek, getFormattedDate, MONTHS} from './schedule.helpers';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheduleComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
  ) { }

  months = MONTHS;

  // диапозон даты для заполнения календаря (на месяц, на год)
  @Output() datePeriodChange: EventEmitter<any> = new EventEmitter();

  private _data: any;
  @Input() set data(data: any) {
    this._data = data;
  }
  get data(): any {
    return this._data;
  }

  calendarModeList = [
    // {code: 'week', name: 'Неделя'},
    {code: 'month', name: 'Месяц'},
    {code: 'year', name: 'Год'},
  ];
  formCalendarMode: FormGroup = this.fb.group({calendarMode: ['month']});
  calendarMode = this.formCalendarMode.controls['calendarMode'].value;

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  currentDay = this.currentDate.getDate();

  selectedYear = this.currentYear;
  selectedMonth = this.currentMonth;
  selectedDay = this.currentDay;

  ngOnInit(): void {
    this.defineDatePeriod(this.calendarMode, true);
  }

  private defineDatePeriod(mode: 'month' | 'year', isInit: boolean = false): void {
    let dateFrom = null;
    let dateTo = null;

    const selectedDate = mode === 'month'
      ? moment(new Date(this.selectedYear, this.selectedMonth))
      : moment(new Date(this.selectedYear, 0));


    let dwLastDayPrevMonth;
    const dateFromClone = selectedDate.clone().startOf('month'); // создаем переменную, из которой будем рассчитывать dateFrom
    if (getDayOfWeek(dateFromClone) > 0) { // если у выбранного месяца день недели не пн. (если год, то у января)
      dateFromClone.subtract(1, 'month').endOf('month'); // последний день предыдущего месяца
      dwLastDayPrevMonth = getDayOfWeek(dateFromClone); // день недели у последнего дня предыдущего месяца
      if (dwLastDayPrevMonth > 0) { 
        dateFromClone.subtract(dwLastDayPrevMonth, 'days');
      }
    }
    dateFrom = getFormattedDate(dateFromClone);
    dateFromClone.add(41, 'days');
    dateTo = getFormattedDate(dateFromClone);

    if (mode === 'year') {
      const dateToClone = selectedDate.clone().endOf('year'); // декабрь
      if (getDayOfWeek(dateToClone) > 0) { // если у выбранного месяца день недели не пн.
        dateToClone.subtract(1, 'month').endOf('month'); // последний день предыдущего месяца
        dwLastDayPrevMonth = getDayOfWeek(dateToClone); // день недели у последнего дня предыдущего месяца
        if (dwLastDayPrevMonth > 0) { 
          dateToClone.subtract(dwLastDayPrevMonth, 'days');
        }
      }
      dateToClone.add(41, 'days');
      dateTo = getFormattedDate(dateToClone);
    }

    this.datePeriodChange.emit({dateFrom, dateTo, isInit});
  }

  onChangeCalendarMode(mode: string): void {
    this.calendarMode = mode;
    this.defineDatePeriod(this.calendarMode);
  }

  prev(): void {
    if (this.formCalendarMode.controls['calendarMode'].value === 'month') {
      if (this.selectedMonth === 0) {
        this.selectedMonth = 11;
        this.selectedYear--;
      } else {
        this.selectedMonth--;
      }
    } else {
      this.selectedMonth = 0;
      this.selectedYear--;
    }

    this.defineDatePeriod(this.calendarMode);
  }

  next(): void {
    if (this.formCalendarMode.controls['calendarMode'].value === 'month') {
      if (this.selectedMonth === 11) {
        this.selectedMonth = 0;
        this.selectedYear++;
      } else {
        this.selectedMonth++;
      }
    } else {
      this.selectedMonth = 0;
      this.selectedYear++;
    }

    this.defineDatePeriod(this.calendarMode);
  }

  today(): void {
    this.selectedYear = this.currentYear;
    this.selectedMonth = this.currentMonth;
  }
}
