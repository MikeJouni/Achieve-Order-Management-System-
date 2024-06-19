import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CollectedPaymentComponent } from './collected-payment.component';
import { SharedModule } from '../../modules/shared.module';

const routes: Route[] = [
  { path: '', component: CollectedPaymentComponent },
]

@NgModule({
  declarations: [
    CollectedPaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class CollectedPaymentModule { }
