import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  url = environment.baseUrl
  constructor(
    public http: HttpClient,
    private localService :LocalService
  ) { 
  }
  createstock(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.post(this.url + 'ap/stock/create', data)
  }
  updatestock(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.patch(this.url+'ap/stock/update', data)
  }
  updateVisible(data){
    return this.http.patch(this.url+'ap/stock/update-visible', data)
  }
  deletestock(id){
    return this.http.delete(this.url + 'ap/stock/delete/'+ id)
  }
  getOnestock(id){
    return this.http.get(this.url+ 'ap/stock/get-detail/'+ id)
  }
  getAllstocks(){
    return this.http.get(this.url + 'ap/stock/get-by-company/' + this.localService.localCompany)
  }
  getAllstocksByCategory(categoryId:any){
    return this.http.get(this.url + 'ap/stock/get-by-company-and-category', { params: {categoryId: categoryId, companyId: this.localService.localCompany}})
  }
  getAllVisibleStocksByCompany(){
    return this.http.get(this.url + 'ap/stock/get-visible-list-by-company/' + this.localService.localCompany)
  }
  updateImage( id,data){
    const fd = new FormData();
    fd.append('file', data);
    return this.http.post(this.url + 'ap/stock/update-image/'+ id,fd)
  }
}
