import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDetailComponent } from './admin-detail.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';

const routes: Route[] = [
  { path: '', component: AdminDetailComponent },
]


@NgModule({
  declarations: [
    AdminDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class AdminDetailModule { }
