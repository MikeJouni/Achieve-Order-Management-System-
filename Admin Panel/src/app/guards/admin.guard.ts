import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { EmployeeService } from '../services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private adminService: AdminService,
    private employeeService: EmployeeService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.adminService.localAdminData()) {
      if (this.adminService.localAdminData().isSuperAdmin == false) {
        this.router.navigateByUrl('/dashboard')
        return false;
      } else {
        return true
      }
    }
    else {
      this.router.navigateByUrl('/customer')
      return false;
    }
  }
}
