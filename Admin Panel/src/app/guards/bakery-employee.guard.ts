import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { EmployeeService } from '../services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class BakeryEmployeeGuard implements CanActivate {

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private adminService: AdminService,
  ) { }
  compnayType = localStorage.getItem('companyType')
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.adminService.localAdminData()) {
      return true;
    }
    if (this.employeeService.localEmployeeData()) {
      if (this.compnayType == 'bakery') {
        this.router.navigateByUrl('/create-bakery-order')
        return false;
      } else {
        return true;
      }

    }
  }
}
