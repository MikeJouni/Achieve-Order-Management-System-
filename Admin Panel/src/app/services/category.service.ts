import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.baseUrl
  constructor(
    public http: HttpClient,
    private localService :LocalService
  ) { 
  }
  createCategory(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.post(this.url + 'ap/category/create', data)
  }
  updateCategory(data){
    data["companyId"]= this.localService.localCompany;
    data["employeeId"]= this.localService.localEmployeeId;
    return this.http.patch(this.url+'ap/category/update', data)
  }
  deleteCategory(id){
    return this.http.delete(this.url + 'ap/category/delete/'+ id)
  }
  getOneCategory(id){
    return this.http.get(this.url+ 'ap/category/get-one/'+ id)
  }
  getAllCategorys(){
    return this.http.get(this.url + 'ap/category/get-by-company/' + this.localService.localCompany)
  }
}
