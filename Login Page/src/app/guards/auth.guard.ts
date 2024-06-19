import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { EmployeeService } from '../services/employee.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private adminService: AdminService,
    private employeeService: EmployeeService,
  ) { }

  url = environment.webUrl;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    {
      if (this.adminService.localAdminData() || this.employeeService.localEmployeeData()) {
        // this.router.navigateByUrl(this.url + 'panel');
        window.location.href = this.url + 'panel/';
        return false;
      } else {
        return true;
      }
    }
  }

}
