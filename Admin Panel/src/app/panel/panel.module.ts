import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';

import { SharedModule } from '../modules/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { LayoutService } from './layout/layout.service';
import { BakeryOrdersComponent } from './bakery/bakery-orders/bakery-orders.component';
import { CategoryComponent } from './category/category.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PanelRoutingModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-lg btn-primary',
      cancelButtonClass: 'btn btn-lg btn-default'
    }),
    SharedModule,
  ],
  providers: [
  ]
})
export class PanelModule { }
