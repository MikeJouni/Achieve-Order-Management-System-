import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';

const routes: Route[] = [
  { path: '', component: ActivityComponent },
]

@NgModule({
  declarations: [
    ActivityComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class ActivityModule { }
