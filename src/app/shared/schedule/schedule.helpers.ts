import * as moment from 'moment';


export const DAYS_OF_WEEK = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
export const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

export interface Day {
  d: number;
  m: number; // от 0 до 11
  y: number;
  tooltipData: any[];
  count: number;
  isCurrent: boolean; // текущий день месяца
  isDisabled: boolean; // является ли этот днем выбранного месяца
  isSelected?: boolean;
}

/**
 * номер дня недели, от 0 (пн) до 6 (вс)
 */
export function getDayOfWeek(date: moment.Moment): number {
    const day = date.day();
    return day === 0 ? 6 : day - 1;
}

/**
 * приводит дату к формату YYYY-MM-DD
 */
export function getFormattedDate(date: moment.Moment): string {
  const d = date.date() < 10 ? `0${date.date()}` : date.date();
  const m = date.month() < 10 ? `0${date.month() + 1}` : date.month() + 1;
  return `${date.year()}-${m}-${d}`;
}

/**
 * количество дней в месяце
 */
export function daysInMonth(year = new Date().getFullYear(), month = new Date().getMonth()): number {
    return 33 - new Date(year, month, 33).getDate();
}

/**
 *  выводит в консоль дату
 */
export function showDate(date: moment.Moment): void {
  console.group('Текущая дата');
  console.log('день', date.date());
  console.log('месяц', date.month());
  console.log('год', date.year());
  console.groupEnd();
}
