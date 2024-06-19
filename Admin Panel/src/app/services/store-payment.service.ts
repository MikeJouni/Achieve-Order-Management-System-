import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class StorePaymentService {
url = environment.baseUrl;
  constructor(
    public http: HttpClient,
    private localService :LocalService
  ) { }
  createstorePayment(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.post(this.url + 'ap/store-payment/create', data)
  }
  updatestorePayment(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.patch(this.url+'ap/store-payment/update', data)
  }
  deletestorePayment(id){
    return this.http.delete(this.url + 'ap/store-payment/delete/'+ id)
  }
  getOnestorePayment(id){
    return this.http.get(this.url+ 'ap/store-payment/get-detail/'+ id)
  }
  getStorePaymentByCompany(){
    return this.http.get(this.url + 'ap/store-payment/get-by-company/' + this.localService.localCompany)
  }
}
