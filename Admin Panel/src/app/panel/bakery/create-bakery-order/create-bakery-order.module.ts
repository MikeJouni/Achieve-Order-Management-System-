import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../../modules/shared.module';
import { CreateBakeryOrderComponent } from './create-bakery-order.component';

const routes: Route[] = [
  { path: '', component: CreateBakeryOrderComponent },
]

@NgModule({
  declarations: [
    CreateBakeryOrderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class CreateBakeryOrderModule { }