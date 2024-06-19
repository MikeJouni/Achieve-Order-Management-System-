import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { EmployeeService } from '../services/employee.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPassword:boolean = false;
  constructor(
    public adminService: AdminService,
    private employeeService: EmployeeService,
    private router: Router,
    public translationService: TranslationService,
  ) {
  }

  alertData = {
    show: false,
    type: '',
    message: '',
  }
  newPassword={
    id:null,
    password:null,
    confirmPassword:null,
  }
  afterOtpSent:boolean = false;
  changePassword:boolean = false;
  loading: boolean = false;
  failedAttempts = 0;
  disabledCondition = false;
  isAdmin: boolean = true;
  credentials = {
    email: '',
    password: '',
  };
  reAttemptTime: any;
  otpArray:any;

  ngOnInit(): void {
    this.checkForremaingTimeOfAttempt();
    this.getBgImage()
    this.loading = false
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
  onCodeCompleted(event:any){
    if (this.otpArray.code==event) {
      this.changePassword = true
      this.presentAlert('success', 'OTP matched')
      if (this.isAdmin) {
        this.newPassword.id = this.otpArray.admin.id
      } else {
        this.newPassword.id = this.otpArray.employee.id
      }
    } else {
      this.presentAlert('warning', 'Wrong OTP')
    }
  }
  onUpdatePassword(){
   if (this.newPassword.password && this.newPassword.confirmPassword) {
    if (this.newPassword.password == this.newPassword.confirmPassword) {
      if (this.isAdmin) {
        this.adminService.updateAdminPassword(this.newPassword).subscribe((resp:any)=>{
          this.presentAlert('success', resp.message)
          this.router.navigateByUrl('/login')
        }, err =>{
          this.presentAlert('danger', err.error.message)
        })
      } else {
        this.employeeService.updateEmployeePassword(this.newPassword).subscribe((resp:any)=>{
          this.presentAlert('success', resp.message)
          this.router.navigateByUrl('/login')
        }, err =>{
          this.presentAlert('danger', err.error.message)
        })
      }
    } else {
      this.presentAlert('warning','Password and confirm password do not match')
    }
   } else {
    this.presentAlert('warning','Please fill in all details')
   }
  }
  async onSendOTP(){
    if (this.credentials.email) {
      if (this.isAdmin) {
        this.loading=true
        await this.adminService.getEmailVerificationCode(this.credentials).subscribe((resp: any) => {
          this.otpArray= resp
          this.afterOtpSent = true;
          this.presentAlert('success', resp.message);
          this.loading=false
        }, err => {
          this.presentAlert('danger', err.error.message);
          this.loading=false
        })
      } else {
        this.loading=true
        await this.employeeService.getEmailVerificationCode(this.credentials).subscribe((resp: any) => {
          this.afterOtpSent = true;
          this.otpArray= resp
          this.presentAlert('success', resp.message);
          this.loading=false
        }, err => {
          this.presentAlert('danger', err.error.message);
          this.loading=false
        })
      }
    } else {
      this.presentAlert('warning', "Please fill in all detail");
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

