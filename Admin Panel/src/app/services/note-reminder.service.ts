import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class NoteReminderService {

  url = environment.baseUrl
  constructor(
    public http: HttpClient,
    private localService :LocalService
  ) { 
  }
  createnoteReminder(data){
    data["companyId"]= this.localService.localCompany;
    return this.http.post(this.url + 'ap/note-reminder/create', data)
  }
  updatenoteReminder(data){
    data["companyId"]= this.localService.localCompany;
    return this.http.patch(this.url+'ap/note-reminder/update', data)
  }
  deletenoteReminder(id){
    return this.http.delete(this.url + 'ap/note-reminder/delete/'+ id)
  }
  getOnenoteReminder(id){
    return this.http.get(this.url+ 'ap/note-reminder/get-one/'+ id)
  }
  getAllnoteReminders(){
    return this.http.get(this.url + 'ap/note-reminder/get-by-company/' + this.localService.localCompany)
  }
}
