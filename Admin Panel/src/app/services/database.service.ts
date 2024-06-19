import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  url = environment.baseUrl
  constructor(
    public http: HttpClient,
    private localService :LocalService
  ) { 
  }
  BackupAllDatabase(){
    return this.http.get(this.url + 'ap/backup-restore/backup-database')
  }
  restoreDatabase(data){
    const fd = new FormData();
    fd.append('file', data);
    return this.http.post(this.url+'ap/backup-restore/restore-database', fd)
  }
  BackupCompanyDatabase(){
    return this.http.get(this.url + 'ap/backup-restore/backup-database-by-company/' + this.localService.localCompany)
  }
}
