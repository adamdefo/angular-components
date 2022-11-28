import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {PopupModule} from './../popup/popup.module';
import {SheduleComponent} from './schedule.component';
import {SheduleMonthComponent} from './schedule-month/schedule-month.component';


@NgModule({
    declarations: [
        SheduleComponent,
        SheduleMonthComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        // PopupModule,
    ],
    exports: [
        SheduleComponent,
        SheduleMonthComponent,
    ],
})
export class ScheduleModule { }
