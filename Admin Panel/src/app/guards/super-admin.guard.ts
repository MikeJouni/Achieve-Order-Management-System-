import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private adminService: AdminService,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.adminService.localAdminData()) {
      if (this.adminService.localAdminData().isSuperAdmin == true) {
        this.router.navigateByUrl('/company')
        return false;
      }
      else 
      return true;
    } else {
      return true;
    }
  }
}
