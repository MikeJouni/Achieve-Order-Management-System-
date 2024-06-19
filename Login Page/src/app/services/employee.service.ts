import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  url = environment.baseUrl;

  constructor(
    public http: HttpClient,
  ) {
  }

  onLogin(data: any) {
    return this.http.post(this.url + 'ap/employee/login', data);
  }

  localEmployeeData() {
    let result = null;
    let localEmployee = localStorage.getItem('employeeData');
    if (localEmployee) {
      result = JSON.parse(localEmployee);
    }
    return result;
  }
  getEmailVerificationCode(data:any){
    return this.http.post(this.url + 'ap/employee/email-verification-code', data)
  }
  updateEmployeePassword(data:any){
    return this.http.patch(this.url + 'ap/employee/update-password', data)
  }
}
