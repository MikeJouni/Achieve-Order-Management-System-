import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { CreateOrderComponent } from './create-order.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Route[] = [
  { path: '', component: CreateOrderComponent },
]

@NgModule({
  declarations: [
    CreateOrderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    SharedModule,
  ]
})
export class CreateOrderModule { }
