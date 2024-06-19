import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AdminService } from '../../services/admin.service';
import { AlertService } from '../../services/alert.service';
import { CompanyService } from '../../services/company.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss',
    '../../../vendor/styles/pages/account.scss',
  ]
})
export class AdminSettingsComponent {
  constructor(private appService: AppService,
    private adminService: AdminService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private location: Location,
    public translationService: TranslationService,
    public companyService : CompanyService
  ) {
    this.appService.pageTitle = 'Account settings - Pages';
    this.loadData()
  }
  isProfitCostVisible: boolean = this.appService.isProfitCostVisible;
  profilePhotoVar: any;
  adminData = {
    id: null,
    name: '',
    email: '',
    password: '',
  }
  passwordData = {
    id: null,
    oldPassword: '',
    newPassword: ''
  }
  adminId = this.adminService.localAdminData().id;
  confirmPassword;
  curTab = 'general';
  adminArray: any;
  loginPageBackground: any;
  loadData() {
    //get admin data
    this.adminService.getOneAdmin(this.adminId)
      .subscribe((data: any) => {
        this.adminArray = data.admin
      })
    //get background image
    this.adminService.getLoginBackground()
      .subscribe((data: any) => {
        this.loginPageBackground = data.loginBackgroundImage
      })
  }
  open(content, item) {
    this.adminData = {
      id: null,
      name: '',
      email: '',
      password: '',
    }
    this.passwordData.id = this.adminId
    this.adminData.id = this.adminId;
    this.adminData.name = this.adminArray.name;
    this.adminData.email = this.adminArray.email;
    this.profilePhotoVar = this.adminArray.profilePhoto
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  updateAdmin() {
    this.adminService.updateAdmin(this.adminData).subscribe((resp: any) => {
      if (this.fileToUpload) {
        this.updateProfilePhoto()
      } else {
      }
      this.adminArray = resp.admin;
      localStorage.setItem('adminData', JSON.stringify(resp.admin));
      this.adminData = {
        id: null,
        name: '',
        email: '',
        password: '',
      }
      this.modalService.dismissAll();
    }, (err) => {
    })
  }
  changePassword() {
    if (this.passwordData.newPassword == this.confirmPassword) {
      this.adminService.changePassword(this.passwordData).subscribe((resp: any) => {
        this.passwordData = {
          id: null,
          oldPassword: '',
          newPassword: ''
        }
        this.confirmPassword = null;
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
      })
    } else {
      this.alertService.presentAlert('warning', 'Password and confirm password does not match');
    }
  }
  fileToUpload: File | null = null;
  handleFileInput(files: FileList) {
    if (files[0].size < 2000 * 1024) {
      this.fileToUpload = files.item(0);
    } else {
      this.alertService.presentAlert('warning', "You can't upload file more than 2 MB")
    }
  }
  updateProfilePhoto() {
    this.adminService.updateImage(this.adminId, this.fileToUpload)
      .subscribe((resp: any) => {
        this.adminArray = resp.admin;
      })
  }
  onBack() {
    this.location.back()
  }
  updateBackground() {
    this.adminService.updateLoginBackground(this.fileToUpload).subscribe((resp: any) => {
      this.loginPageBackground = resp.loginBackgroundImage
      this.alertService.presentAlert('success', resp.message)
      this.loginPageBackground = null;
      this.modalService.dismissAll()
    })
  }
  onChange(event) {
    const isProfitCostVisible = event.target.checked;
    let data = {
      isProfitCostVisible: isProfitCostVisible
    };
    this.companyService.updateProfitCostVisible(data).subscribe((resp: any) => {
      this.alertService.presentAlert('success', resp.message);
    })
  }
}

