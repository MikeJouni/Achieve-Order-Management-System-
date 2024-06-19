import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { EmployeesComponent } from './employees.component';

const routes: Route[] = [
  { path: '', component: EmployeesComponent },
]

@NgModule({
  declarations: [
    EmployeesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class EmployeesModule { }
