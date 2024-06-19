import { Component, Input, ChangeDetectionStrategy, AfterViewInit, HostBinding, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppService } from '../../../app.service';
import { AdminService } from '../../../services/admin.service';
import { EmployeeService } from '../../../services/employee.service';
import { LayoutService } from '../layout.service';

import { TranslationService } from '../../../services/translation.service';
@Component({
  selector: 'app-layout-sidenav',
  templateUrl: './layout-sidenav.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSidenavComponent implements AfterViewInit {
  @Input() orientation = 'vertical';

  @HostBinding('class.layout-sidenav') private hostClassVertical = false;
  @HostBinding('class.layout-sidenav-horizontal') private hostClassHorizontal = false;
  @HostBinding('class.flex-grow-0') private hostClassFlex = false;
  currentActiveUrl: string;
  companyType: any = localStorage.getItem('companyType')
  constructor(
    private router: Router,
    private appService: AppService,
    private layoutService: LayoutService,
    private adminService: AdminService,
    private employeeService: EmployeeService,
    public activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public translationService: TranslationService,
  ) {
    this.currentActiveUrl = this.activatedRoute.snapshot.url.join('/');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentActiveUrl = event.urlAfterRedirects;
        if (this.currentActiveUrl != '/login') {
          this.cdr.detectChanges();
        }
      }
    });

    // Set host classes
    this.hostClassVertical = this.orientation !== 'horizontal';
    this.hostClassHorizontal = !this.hostClassVertical;
    this.hostClassFlex = this.hostClassHorizontal;
  }

  ngAfterViewInit() {
    // Safari bugfix
    this.layoutService._redrawLayoutSidenav();
  }

  getClasses() {
    let bg = this.appService.layoutSidenavBg;

    if (this.orientation === 'horizontal' && (bg.indexOf(' sidenav-dark') !== -1 || bg.indexOf(' sidenav-light') !== -1)) {
      bg = bg
        .replace(' sidenav-dark', '')
        .replace(' sidenav-light', '')
        .replace('-darker', '')
        .replace('-dark', '');
    }

    return `${this.orientation === 'horizontal' ? 'container-p-x ' : ''} bg-${bg}`;
  }

  isActive(url) {
    return this.router.isActive(url, true);
  }

  isMenuActive(url) {
    return this.router.isActive(url, false);
  }

  isMenuOpen(url) {
    return this.router.isActive(url, false) && this.orientation !== 'horizontal';
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }
  linksVisibilityReturn(link) {
    var result = null;
    const localAdmin = localStorage.getItem('adminData');
    const localEmployee = localStorage.getItem('employeeData');
    if (localAdmin) {
      const adminType = JSON.parse(localAdmin).isSuperAdmin;
      if (adminType == true) {
        const myLinks = [
          '/company',
          '/admin',
          '/database-backup',
        ];
        if (myLinks.includes(link)) {
          result = true;
        } else {
          result = false;
        }
      } else {
        if (this.companyType == 'normal') {
          const myLinks = [
            '/dashboard',
            '/customer-debt',
            '/database-backup',
            '/note-reminder',
            '/employee',
            '/customer',
            '/driver',
            '/stock',
            '/order',
            '/activity',
            '/store-payment',
            '/collected-payment',
          ];
          if (myLinks.includes(link)) {
            result = true;
          } else {
            result = false;
          }
        }
        if (this.companyType == 'bakery') {
          const myLinks = [
            '/dashboard',
            '/database-backup',
            '/note-reminder',
            '/employee',
            '/customer',
            '/driver',
            '/bakery-stock',
            '/bakery-order',
            '/order',
            '/activity',
            '/store-payment',
            '/collected-payment',
          ];
          if (myLinks.includes(link)) {
            result = true;
          } else {
            result = false;
          }
        }
      }
    }
    if (localEmployee) {
      const employeeType = JSON.parse(localEmployee)
      if (this.companyType == 'normal') {
        const myLinks = [
          '/customer',
          '/driver',
          '/customer-debt',
          '/note-reminder',
          '/stock',
          '/order',
          '/store-payment',
          '/collected-payment',
        ];
        if (myLinks.includes(link)) {
          result = true;
        } else {
          result = false;
        }
      }
      if (this.companyType == 'bakery') {
        const myLinks = [
          '/create-bakery-order',
          '/bakery-order',
          '/order',
        ];
        if (myLinks.includes(link)) {
          result = true;
        } else {
          result = false;
        }
      }
    }
    return result;
  }

  onChildButtonClicked(event) {
  }
}
