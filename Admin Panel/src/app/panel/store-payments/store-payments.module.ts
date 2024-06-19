import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { StorePaymentsComponent } from './store-payments.component';

const routes: Route[] = [
  { path: '', component: StorePaymentsComponent },
]

@NgModule({
  declarations: [
    StorePaymentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class StorePaymentsModule { }
