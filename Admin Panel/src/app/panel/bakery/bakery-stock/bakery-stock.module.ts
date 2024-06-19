import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../../modules/shared.module';
import { BakeryStockComponent } from './bakery-stock.component';

const routes: Route[] = [
  { path: '', component: BakeryStockComponent },
]

@NgModule({
  declarations: [
    BakeryStockComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class BakeryStockModule { }