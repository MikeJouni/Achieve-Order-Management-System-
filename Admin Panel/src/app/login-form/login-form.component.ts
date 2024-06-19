import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { AdminService } from '../services/admin.service';
import { AlertService } from '../services/alert.service';
import { EmployeeService } from '../services/employee.service';
import { FileService } from '../services/file.service';
import { LocalService } from '../services/local.service';
@Component({
  selector: 'app-login-form',  // tslint:disable-line
  templateUrl: './login-form.component.html',
  styleUrls: [
    './login-form.component.scss',
    '../../vendor/styles/pages/authentication.scss',
    '../../vendor/libs/spinkit/spinkit.scss'
  ]
})
export class LoginFormComponent implements OnDestroy {
  ngOnDestroy(): void {
    this.loading = false
  }
  constructor(
    private appService: AppService,
    private adminService: AdminService,
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private router: Router,
    private localService: LocalService,
    private fileService: FileService,
  ) {
    this.appService.pageTitle = 'Login';
    this.checkForremaingTimeOfAttempt();
    this.getBgImage()
    this.loading = false

  }
  loading: boolean
  failedAttempts = 0;
  disabledCondition = false;
  isAdmin: boolean = true;
  credentials = {
    email: '',
    password: '',
  };
  mainBackgroundImage: any = '';
  getBgImage() {
    this.adminService.getLoginBackground().subscribe((resp: any) => {
      this.mainBackgroundImage = resp.loginBackgroundImage;
    })
  }
  async login() {
    if (this.conditionChecker()) {
      if (this.credentials.email && this.credentials.password) {
        if (this.isAdmin) {
          await this.adminService.loginAdmin(this.credentials).subscribe((resp: any) => {
            this.alertService.presentAlert('success', resp.message);
            this.loading = true
            localStorage.setItem('adminData', JSON.stringify(resp.admin));
            localStorage.setItem('companyId', JSON.stringify(resp.companyId));
            this.localService.localCompanyData;
            localStorage.setItem('token', resp.token);
            //! Set for refreshing local data
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            // this.router.navigateByUrl('/panel/dashboard');
            this.adminService.isAdminTrue = this.isAdmin;
          }, err => {
            this.failedAttempts++;
            localStorage.setItem('attempts', JSON.stringify(this.failedAttempts));
            this.alertService.presentAlert('danger', err.error.message);
          })
        } else {
          await this.employeeService.onLogin(this.credentials).subscribe((resp: any) => {
            this.alertService.presentAlert('success', resp.message);
            this.loading = true
            localStorage.setItem('employeeData', JSON.stringify(resp.employee));
            localStorage.setItem('companyId', JSON.stringify(resp.employee.companyId));
            localStorage.setItem('token', resp.token);
            //! Set for refreshing local data
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            // this.router.navigateByUrl('/panel/customer');
            this.adminService.isAdminTrue = this.isAdmin;
          }, err => {
            this.failedAttempts++;
            localStorage.setItem('attempts', JSON.stringify(this.failedAttempts));
            this.alertService.presentAlert('danger', err.error.message);
          })
        }
      } else {
        this.alertService.presentAlert('warning', "Please fill in all details");
      }
    }
  }
  onChange(event) {
    this.isAdmin = event.target.checked;
    if (this.isAdmin) {
      this.alertService.presentAlert('primary', 'You are interacting as admin')
    } else {
      this.alertService.presentAlert('primary', 'You are interacting as employee')
    }
  }
  reAttemptTime;
  diff_minutes(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));

  }
  conditionChecker() {
    // ! todo make it 5 attempts
    if (this.failedAttempts == 4) {
      localStorage.setItem('lastFailedAttemptAt', new Date().toLocaleString());
      this.disabledCondition = true;
      this.checkForremaingTimeOfAttempt();;
      return false;
    } else {
      return true;
    }
  }
  checkForremaingTimeOfAttempt() {
    if (localStorage.getItem('lastFailedAttemptAt')) {
      this.disabledCondition = true;
      let timeDiff = this.diff_minutes(new Date(), new Date(localStorage.getItem('lastFailedAttemptAt')));
      this.reAttemptTime = 10 - timeDiff;
      if (timeDiff > 9) {
        this.disabledCondition = false;
        localStorage.clear();
      } else {
        setTimeout(() => {
          this.reAttemptTime = '';
          this.disabledCondition = false;
          localStorage.clear()
        }, this.reAttemptTime * 60000);
      }
    } else {
      this.disabledCondition = false;
    }
  }

  // bgReturner() {
  //   if (this.mainBackgroundImage) {
  //     return 'url(' + this.fileService?.fileUrl + this.mainBackgroundImage + ')';
  //   } else {
  //     return '';
  //   }
  // }
}
