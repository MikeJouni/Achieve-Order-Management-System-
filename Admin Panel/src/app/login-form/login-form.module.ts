import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form.component';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../guards/auth.guard';

const routes: Route[] = [
  { path: '', component: LoginFormComponent, canActivate: [AuthGuard] },
]

@NgModule({
  declarations: [
    LoginFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class LoginFormModule { }
