import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { StocksComponent } from './stocks.component';

const routes: Route[] = [
  { path: '', component: StocksComponent },
]

@NgModule({
  declarations: [
    StocksComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class StocksModule { }
