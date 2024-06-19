import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { DriversComponent } from './drivers.component';

const routes: Route[] = [
  { path: '', component: DriversComponent },
]

@NgModule({
  declarations: [DriversComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class DriversModule { }
