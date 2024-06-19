import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { EmployeeService } from '../services/employee.service';
import { NgForm } from '@angular/forms';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',
    // '../../vendor/styles/pages/authentication.scss'
  ]
})

export class LoginComponent implements OnInit, OnDestroy {
  forgotPassword: boolean = false;
  constructor(
    public adminService: AdminService,
    private employeeService: EmployeeService,
    private router: Router,
    public translationService: TranslationService,
  ) {
  }

  recaptchaData = {
    token: '',
    isSubmitted: false,
  }

  alertData = {
    show: false,
    type: '',
    message: '',
  }
  loading: boolean = false;
  failedAttempts = 0;
  disabledCondition = false;
  isAdmin: boolean = true;
  credentials = {
    email: '',
    password: '',
  };
  reAttemptTime: any;


  ngOnInit(): void {
    this.checkForremaingTimeOfAttempt();
    this.getBgImage();
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.loading = false
  }

  mainBackgroundImage: any = '';

  getBgImage() {
    this.adminService.getLoginBackground().subscribe((resp: any) => {
      this.mainBackgroundImage = resp.loginBackgroundImage;
    })
  }

  resolved(event: any) {
    // console.log(event);
  }

  async login() {
    if (this.conditionChecker()) {
      if (this.credentials.email && this.credentials.password && this.recaptchaData.token) {
        if (this.isAdmin) {
          await this.adminService.loginAdmin(this.credentials).subscribe((resp: any) => {
            this.presentAlert('success', resp.message);
            this.loading = true
            localStorage.setItem('adminData', JSON.stringify(resp.admin));
            if (resp.company) {
              localStorage.setItem('companyId', JSON.stringify(resp.company.id));
              localStorage.setItem('companyType', resp.company.type);
            }
            localStorage.setItem('token', resp.token);
            //! Set for refreshing local data
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            // this.router.navigateByUrl('/panel/dashboard');
          }, err => {
            this.failedAttempts++;
            localStorage.setItem('attempts', JSON.stringify(this.failedAttempts));
            this.presentAlert('danger', err.error.message);
          })
        } else {
          await this.employeeService.onLogin(this.credentials).subscribe((resp: any) => {
            this.presentAlert('success', resp.message);
            this.loading = true
            localStorage.setItem('employeeData', JSON.stringify(resp.employee));
            localStorage.setItem('companyId', JSON.stringify(resp.company.id));
            localStorage.setItem('companyType', resp.company.type);
            localStorage.setItem('token', resp.token);
            //! Set for refreshing local data
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            // this.router.navigateByUrl('/panel/customer');
          }, err => {
            this.failedAttempts++;
            localStorage.setItem('attempts', JSON.stringify(this.failedAttempts));
            this.presentAlert('danger', err.error.message);
          })
        }
      } else {
        this.presentAlert('warning', "Please fill in all details");
        this.recaptchaData.isSubmitted = true;
      }
    }
  }

  onChange(event: any) {
    this.isAdmin = event.target.checked;
    if (this.isAdmin) {
      this.presentAlert('primary', 'You are interacting as admin')
    } else {
      this.presentAlert('primary', 'You are interacting as employee')
    }
  }


  diff_minutes(dt2: any, dt1: any) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }


  presentAlert(type: any, message: any) {
    this.alertData.type = type;
    this.alertData.message = message;
    this.alertData.show = true;
    setTimeout(() => {
      this.alertData.show = false;
    }, 3000);
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
      let lastFailedAttemptAt = localStorage.getItem('lastFailedAttemptAt');
      let timeDiff = lastFailedAttemptAt ? this.diff_minutes(new Date(), new Date(lastFailedAttemptAt)) : 0;
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


}
