import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../../modules/shared.module';
import { BakeryOrdersComponent } from './bakery-orders.component';

const routes: Route[] = [
  { path: '', component: BakeryOrdersComponent },
]

@NgModule({
  declarations: [
    BakeryOrdersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class BakeryOrdersModule { }