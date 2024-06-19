import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AdminsComponent } from './admins.component';
import { SharedModule } from '../../modules/shared.module';

const routes: Route[] = [
  { path: '', component: AdminsComponent },
]

@NgModule({
  declarations: [AdminsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class AdminsModule { }
