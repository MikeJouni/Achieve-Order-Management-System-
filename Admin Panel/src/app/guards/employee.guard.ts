import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { EmployeeService } from '../services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private adminService: AdminService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.adminService.localAdminData()) {
        return true;
      }
      if (this.employeeService.localEmployeeData()) {
      this.router.navigateByUrl('/customer')
      return false;
    }
  }
}
