import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { DriverOrderComponent } from './driver-order.component';

const routes: Route[] = [
  { path: '', component: DriverOrderComponent },
]

@NgModule({
  declarations: [
    DriverOrderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class DriverOrderModule { }
