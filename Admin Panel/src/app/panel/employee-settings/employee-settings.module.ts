import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { EmployeeSettingsComponent } from './employee-settings.component';

const routes: Route[] = [
  { path: '', component: EmployeeSettingsComponent },
]

@NgModule({
  declarations: [EmployeeSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class EmployeeSettingsModule { }
