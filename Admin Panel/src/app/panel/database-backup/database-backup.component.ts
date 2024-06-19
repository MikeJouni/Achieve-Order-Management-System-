import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { DatabaseService } from '../../services/database.service';
import { LocalService } from '../../services/local.service';
import { FileService } from '../../services/file.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-database-backup',
  templateUrl: './database-backup.component.html',
  styleUrls: ['./database-backup.component.scss']
})
export class DatabaseBackupComponent implements OnInit {
  fileToUpload: File | null = null;
  constructor(
    private databaseService: DatabaseService,
    private alertService: AlertService,
    private fileService: FileService,
    public translationService: TranslationService,
  ) {
    this.getLocalAdmin()
  }
  exportedFile: any;
  loading: boolean = false
  ngOnInit() {
  }
  AdminArray: any;
  getLocalAdmin() {
    this.AdminArray = JSON.parse(localStorage.getItem('adminData'))
  }
  onExportDatabase(data) {
    if (this.AdminArray.isSuperAdmin == false) {
      this.loading = true
      this.databaseService.BackupCompanyDatabase().subscribe((resp: any) => {
        this.exportedFile = resp.fileName
        this.alertService.presentAlert('success', resp.message)
        this.loading = false

      })
    } else {
      this.loading = true
      this.databaseService.BackupAllDatabase().subscribe((resp: any) => {
        this.alertService.presentAlert('success', resp.message)
        this.exportedFile = resp.fileName
        this.alertService.presentAlert('success', resp.message)
        this.loading = false
      })
    }
  }
  onImportDatabase() {
    if (this.fileToUpload) {
      this.loading = true
      this.databaseService.restoreDatabase(this.fileToUpload).subscribe((resp: any) => {
        this.alertService.presentAlert('success', resp.message)
        this.fileToUpload = null
        this.loading = false

      })
    } else {
      this.alertService.presentAlert('warning', 'Please select a file')
    }
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}

