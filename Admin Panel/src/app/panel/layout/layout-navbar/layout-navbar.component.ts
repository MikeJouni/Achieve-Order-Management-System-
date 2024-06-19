import { Component, Input, HostBinding } from '@angular/core';
import { AppService } from '../../../app.service';
import { LayoutService } from '../../layout/layout.service';
import { AdminService } from '../../../services/admin.service';
import { EmployeeService } from '../../../services/employee.service';
import { TranslationService } from '../../../services/translation.service';
@Component({
  selector: 'app-layout-navbar',
  templateUrl: './layout-navbar.component.html',
  styles: [':host { display: block; }']
})
export class LayoutNavbarComponent {
  isExpanded = true;
  @Input() sidenavToggle = true;
  @HostBinding('class.layout-navbar') private hostClassMain = true;
  constructor(private appService: AppService,
    private layoutService: LayoutService,
    private adminService: AdminService,
    private employeeService : EmployeeService,
    public translationService: TranslationService,
    ) {
    this.loadData()
  }
  dataArray:any;
  currentBg() {
    return `bg-${this.appService.layoutNavbarBg}`;
  }
  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }
  onLogout(){
    this.adminService.onLogout()
  }
  loadData(){
    if (this.adminService.localAdminData()) {
      this.dataArray = this.adminService.localAdminData();
    } else {
      this.dataArray = this.employeeService.localEmployeeData();
    }
  }
}
