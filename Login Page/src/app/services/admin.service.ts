import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url = environment.baseUrl;
  fileUrl = environment.baseUrl + 'file/';

  constructor(
    public http: HttpClient,
    public router: Router
  ) {
  }

  // isAdminTrue: boolean = true;

  loginAdmin(loginData: any) {
    return this.http.post(this.url + 'ap/admin/login', loginData);
  }

  localAdminData() {
    let result = null;
    let localAdmin = localStorage.getItem('adminData');
    if (localAdmin) {
      result = JSON.parse(localAdmin);
    }
    return result;
  }
  getLoginBackground(){
    return this.http.get(this.url + 'ap/custom-variable/get-login-background')
  }
  getEmailVerificationCode(data:any){
    return this.http.post(this.url + 'ap/admin/email-verification-code', data)
  }
  updateAdminPassword(data:any){
    return this.http.patch(this.url + 'ap/admin/update-password', data)
  }
}
