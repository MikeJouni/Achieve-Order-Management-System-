import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { OrderDetailComponent } from './order-detail.component';
import { OrderReceiptComponent } from '../components/order-receipt/order-receipt.component';

const routes: Route[] = [
  { path: '', component: OrderDetailComponent },
]

@NgModule({
  declarations: [
    OrderDetailComponent,
    OrderReceiptComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class OrderDetailModule { }
