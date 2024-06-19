import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
url = environment.baseUrl;
localCompany:any;
  constructor(
    public http : HttpClient
  ) { 
    this.localCompany = localStorage.getItem('companyId');
  }

  getActivities(month, year, type){
    return this.http.get(this.url + 'ap/activity/get-by-company-and-filter' + month + year + type +'&companyId=' + this.localCompany)
  }
}
