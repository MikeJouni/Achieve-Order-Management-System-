import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  fileUrl: any
  url = environment.baseUrl;
  constructor(
    public http: HttpClient,
    private localService: LocalService
  ) {
    this.fileUrl = this.url + 'file/';
    this.localService
  }

  createEmployee(data) {
    data["companyId"] = this.localService.localCompany;
    data["employeeId"] = this.localService.localEmployee;
    return this.http.post(this.url + 'ap/employee/create', data)
  }

  updateEmployee(data) {
    data["companyId"] = this.localService.localCompany;
    data["employeeId"] = this.localService.localEmployee
    return this.http.patch(this.url + 'ap/employee/update', data)
  }

  deleteEmployee(id) {
    return this.http.delete(this.url + 'ap/employee/delete/' + id)
  }

  updateProfilePhoto(id, data) {
    const fd = new FormData();
    fd.append('file', data);
    return this.http.post(this.url + 'ap/employee/update-profile-photo/' + id, fd)
  }

  getOneEmployee(id) {
    return this.http.get(this.url + 'ap/employee/get-one/' + id)
  }
  getEmployeeByCompany() {
    return this.http.get(this.url + 'ap/employee/get-by-company/' + this.localService.localCompany)
  }

  getAllEmployee() {
    return this.http.get(this.url + 'ap/employee/get-by-company/' + this.localService.localCompany)
  }

  changePassword(data) {
    return this.http.patch(this.url + 'ap/employee/change-password', data)
  }

  updatePassword(data) {
    return this.http.patch(this.url + 'ap/employee/update-password', data)
  }

  onLogin(data) {
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
}
