import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { CustomersOrderComponent } from './customers-order.component';

const routes: Route[] = [
  { path: '', component: CustomersOrderComponent },
]

@NgModule({
  declarations: [
    CustomersOrderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class CustomersOrderModule { }
