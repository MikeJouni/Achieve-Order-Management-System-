import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AdminSettingsComponent } from './admin-settings.component';
import { SharedModule } from '../../modules/shared.module';

const routes: Route[] = [
  { path: '', component: AdminSettingsComponent },
]

@NgModule({
  declarations: [
    AdminSettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class AdminSettingsModule { }
