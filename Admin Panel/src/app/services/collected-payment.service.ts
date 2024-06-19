import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class CollectedPaymentService {
  url = environment.baseUrl
  constructor(
    public http: HttpClient,
    private localService :LocalService
  ) { 
  }
  createcollectedPayment(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.post(this.url + 'ap/collected-payment/create', data)
  }
  updatecollectedPayment(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.patch(this.url+'ap/collected-payment/update', data)
  }
  deletecollectedPayment(id){
    return this.http.delete(this.url + 'ap/collected-payment/delete/'+ id)
  }
  getOnecollectedPayment(id){
    return this.http.get(this.url+ 'ap/collected-payment/get-one/'+ id)
  }
  getAllcollectedPayments(){
    return this.http.get(this.url + 'ap/collected-payment/get-by-company/' + this.localService.localCompany)
  }
}
