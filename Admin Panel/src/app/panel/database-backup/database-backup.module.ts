import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { DatabaseBackupComponent } from './database-backup.component';
import { SharedModule } from '../../modules/shared.module';

const routes: Route[] = [
  { path: '', component: DatabaseBackupComponent },
]

@NgModule({
  declarations: [DatabaseBackupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class DatabaseBackupsModule { }
