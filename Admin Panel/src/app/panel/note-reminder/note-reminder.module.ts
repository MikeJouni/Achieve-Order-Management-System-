import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { NoteReminderComponent } from './note-reminder.component';

const routes: Route[] = [
  { path: '', component: NoteReminderComponent },
]

@NgModule({
  declarations: [
    NoteReminderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class NoteRemindersModule { }
