import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AlertService } from '../../services/alert.service';
import { EmployeeService } from '../../services/employee.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.scss',
    '../../../vendor/styles/pages/account.scss',
  ]
})
export class EmployeeSettingsComponent {
  constructor(private appService: AppService,
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private alertService : AlertService,
    private location : Location,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Account settings - Pages';
    this.loadData()
  }
  profilePhotoVar:any;
  employeeData = {
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
  employeeId = this.employeeService.localEmployeeData().id;
  confirmPassword;
  employeeArray: any;
  loadData() {
    this.employeeService.getOneEmployee(this.employeeId)
      .subscribe((data: any) => {
        this.employeeArray = data.employee
      })
  }
  open(content, item) {
    this.employeeData = {
      id: null,
      name: '',
      email: '',
      password: '',
    }
    this.passwordData.id = this.employeeId
    this.employeeData.id = this.employeeId;
    this.employeeData.name = this.employeeArray.name;
    this.employeeData.email = this.employeeArray.email;
    this.profilePhotoVar = this.employeeArray.profilePhoto
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  updateEmployee() {
    this.employeeService.updateEmployee(this.employeeData).subscribe((resp: any) => {
      if (this.fileToUpload) {
        this.updateProfilePhoto()
      } else {
      }
      this.employeeArray = resp.employee;
      this.employeeData = {
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
      this.employeeService.changePassword(this.passwordData).subscribe((resp: any) => {
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
    this.employeeService.updateProfilePhoto(this.employeeId, this.fileToUpload)
      .subscribe((resp: any) => {
        this.employeeArray = resp.employee;
      })
  }
  onBack(){
    this.location.back()
  }
}
