import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
url = environment.baseUrl
  constructor(
    public http: HttpClient,
    private localService :LocalService
  ) { 
  }
  createdriver(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.post(this.url + 'ap/driver/create', data)
  }
  updatedriver(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.patch(this.url+'ap/driver/update', data)
  }
  deletedriver(id){
    return this.http.delete(this.url + 'ap/driver/delete/'+ id)
  }
  getOnedriver(id){
    return this.http.get(this.url+ 'ap/driver/get-one/'+ id)
  }
  getAlldrivers(){
    return this.http.get(this.url + 'ap/driver/get-by-company/' + this.localService.localCompany)
  }
}
