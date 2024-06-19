import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
url = environment.baseUrl;
  constructor(
    public http : HttpClient,
    public localService : LocalService
  ) { }

  createcompany(data){
    return this.http.post(this.url + 'ap/company/create', data)
  }
  updatecompany(data){
    return this.http.patch(this.url+'ap/company/update', data)
  }
  deletecompany(id){
    return this.http.delete(this.url + 'ap/company/delete/'+ id)
  }
  getOnecompany(id){
    return this.http.get(this.url+ 'ap/company/get-one/'+ id)
  }
  getAllcompanys(){
    return this.http.get(this.url + 'ap/company/get-all')
  }
  companyStatusDelete(data){
    return this.http.patch(this.url +'ap/company/update-deleted', data )
  }
  getByStatus(type){
    return this.http.get(this.url + 'ap/company/get-by-deleted/' + type)
  }
  getProfitCostVisible(){
    return this.http.get(this.url + 'ap/company/get-one-profit-cost-visible/' + this.localService.localCompany)
  }
  updateProfitCostVisible(data:any){
    data["id"]= this.localService.localCompany;
    return this.http.patch(this.url + 'ap/company/update-profit-cost-visible', data)
  }
}
