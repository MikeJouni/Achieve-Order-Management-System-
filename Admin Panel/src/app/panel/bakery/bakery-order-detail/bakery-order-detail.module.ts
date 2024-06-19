import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../../modules/shared.module';
import { BakeryOrderDetailComponent } from './bakery-order-detail.component';
import { OrderReceiptComponent } from '../../components/order-receipt/order-receipt.component';

const routes: Route[] = [
  { path: '', component: BakeryOrderDetailComponent },
]

@NgModule({
  declarations: [
    BakeryOrderDetailComponent,
    OrderReceiptComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class BakeryOrderDetailModule { }