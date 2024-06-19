import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { CompanyComponent } from './company.component';

const routes: Route[] = [
  { path: '', component: CompanyComponent },
]

@NgModule({
  declarations: [
    CompanyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class CompanyModule { }
