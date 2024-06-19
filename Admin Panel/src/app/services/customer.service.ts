import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  url = environment.baseUrl;
  localCompany: any
  localEmployee: any

  constructor(
    public http: HttpClient,
    private localService : LocalService
  ) {
  }

  createCustomer(data) {
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.post(this.url + 'ap/customer/create', data)
  }
  updateCustomer(data) {
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.patch(this.url + 'ap/customer/update', data)
  }
  deleteCustomer(id) {
    return this.http.delete(this.url + 'ap/customer/delete/' + id)
  }
  getOneCustomer(id) {
    return this.http.get(this.url + 'ap/customer/get-one/' + id)
  }
  getAllCustomers() {
    return this.http.get(this.url + 'ap/customer/get-by-company/' + this.localService.localCompany)
  }
}
