import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
localEmployeeId:any;
localEmployee:any;
localCompany:any;
  constructor() { 
   this.localCompanyData();
   this.localEmployeeData()
   this.localEmployee = this.localEmployeeData()
   this.localCompany = this.localCompanyData();
   this.localEmployeeIdCalculator()
  }
  localEmployeeIdCalculator(){
    if (this.localEmployee) {
      this.localEmployeeId = this.localEmployee.id;
    }
  }
  localEmployeeData(){
    let result = null;
    let localEmployee = localStorage.getItem('employeeData');
    if (localEmployee) {
      result = JSON.parse(localEmployee);
    }
    return result;
  }

  localCompanyData(){
    let result = null;
    let localCompany = localStorage.getItem('companyId');
    if (localCompany) {
      result = JSON.parse(localCompany);
    }
    return result;
  }
}
