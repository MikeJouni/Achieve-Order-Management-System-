import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { StockDetailComponent } from './stock-detail.component';

const routes: Route[] = [
  { path: '', component: StockDetailComponent },
]

@NgModule({
  declarations: [StockDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class StockDetailModule { }
