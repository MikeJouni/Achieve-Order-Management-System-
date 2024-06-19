import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { DebtsComponent } from './debts.component';

const routes: Route[] = [
  { path: '', component: DebtsComponent },
]

@NgModule({
  declarations: [
    DebtsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class DebtsModule { }
