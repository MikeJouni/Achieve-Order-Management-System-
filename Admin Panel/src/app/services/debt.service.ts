import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class DebtService {

  url = environment.baseUrl
  constructor(
    public http: HttpClient,
    private localService :LocalService
  ) { 
  }
  createCustomerDebt(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.post(this.url + 'ap/customer-debt/create', data)
  }
  updateCustomerDebt(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.patch(this.url+'ap/customer-debt/update', data)
  }
  deleteCustomerDebt(id){
    return this.http.delete(this.url + 'ap/customer-debt/delete/'+ id)
  }
  getOneCustomerDebt(id){
    return this.http.get(this.url+ 'ap/customer-debt/get-one/'+ id)
  }
  getAllCustomerDebts(){
    return this.http.get(this.url + 'ap/customer-debt/get-by-company/' + this.localService.localCompany)
  }
}
