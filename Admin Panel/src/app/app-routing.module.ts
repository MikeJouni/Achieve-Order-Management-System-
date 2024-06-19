import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// *******************************************************************************
// Pages

// *******************************************************************************
// Routes

const routes: Routes = [

  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', loadChildren: './login-form/login-form.module#LoginFormModule' },
  // { path: 'panel', loadChildren: './panel/panel.module#PanelModule' },

  { path: '', loadChildren: './panel/panel.module#PanelModule' },

];

// *******************************************************************************
//

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
