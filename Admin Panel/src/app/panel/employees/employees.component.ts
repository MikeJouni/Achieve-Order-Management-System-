import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AlertService } from '../../services/alert.service';
import { EmployeeService } from '../../services/employee.service';
import { LocalService } from '../../services/local.service';
 import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss',
    '../../../vendor/styles/pages/products.scss',
    '../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class EmployeesComponent {
  btnLoading: boolean = false;
  profilePhotoVar: any;
  fileToUpload: File | null = null;
  employeeData = {
    id: null,
    name: '',
    email: '',
    password: '',
    companyId: this.localService.localCompany,
  }
  profileData: any;
  employeeArray: any = [];
  originalemployeeArray: any = [];
  editEmployee: boolean = true;
  imageUrl: any;
  newPassword = {
    id: null,
    password: null,
    confirmPassword: null
  };
  employeeId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private localService: LocalService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Employees list';
    this.loadData();
  }
  loadData() {
    this.employeeService.getEmployeeByCompany()
      .subscribe((data: any) => {
        this.originalemployeeArray = data.employees;
        this.update();
      })
  }
  open(content, item) {
    this.employeeDataClear()
    if (item) {
      this.employeeData.id = item.id;
      this.employeeData.name = item.name;
      this.employeeData.email = item.email;
      this.employeeId = item.id
      this.newPassword.id = item.id;
      this.profilePhotoVar = item.profilePhoto
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  modalUpdatePassword() {
    this.editEmployee = false;
  }
  createEmployee() {
    if (this.employeeData.name && this.employeeData.email && this.employeeData.password) {
      if (this.employeeData.password == this.newPassword.confirmPassword) {
        this.btnLoading = true;
        this.employeeService.createEmployee(this.employeeData).subscribe((resp: any) => {
          this.originalemployeeArray.push(resp.employee)
          if (this.fileToUpload) {
            this.updateProfilePhoto(resp.employee.id)
          } else {
          }
          this.update();
          this.modalService.dismissAll();
          this.alertService.presentAlert('success', resp.message);
          this.employeeDataClear()
          this.btnLoading = false;
        }, (err) => {
          this.alertService.presentAlert('danger', err.error.message);
          this.btnLoading = false;
        })
      } else {
        this.alertService.presentAlert('warning', 'Password and Confirm password does not match')
      }
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateEmployee() {
    if (this.employeeData.name && this.employeeData.email) {
      this.btnLoading = true;
      this.employeeService.updateEmployee(this.employeeData).subscribe((resp: any) => {
        this.originalemployeeArray[this.originalemployeeArray.findIndex(x => x.id === this.employeeData.id)] = resp.employee;
        this.update()
        if (this.fileToUpload) {
          this.updateProfilePhoto(resp.employee.id);
        } else {
        }
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.employeeDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  deleteEmployee() {
    this.employeeService.deleteEmployee(this.employeeId).subscribe((resp: any) => {
      this.originalemployeeArray.splice([this.originalemployeeArray.findIndex((x: any) => x.id === this.employeeId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  handleFileInput(files: FileList) {
    if (files[0].size < 2000 * 1024) {
      this.fileToUpload = files.item(0);
    } else {
      this.alertService.presentAlert('warning', "You can't upload file more than 2 MB")
    }
  }
  employeeDataClear() {
    this.employeeData = {
      id: null,
      name: '',
      email: '',
      password: '',
      companyId: this.localService.localCompany,
    };
    this.fileToUpload = null;
    this.newPassword = {
      password: null,
      confirmPassword: null,
      id: null
    }
  }
  updatePassword() {
    if (this.newPassword.password && this.newPassword.confirmPassword) {
      if (this.newPassword.password == this.newPassword.confirmPassword) {
        this.btnLoading = true;
        this.employeeService.updatePassword(this.newPassword).subscribe((resp: any) => {
          this.originalemployeeArray[this.employeeArray.findIndex(x => x.id === this.employeeData.id)] = resp.admin;
          this.modalService.dismissAll()
          this.alertService.presentAlert('success', resp.message);
          this.btnLoading = false;
        }, (err) => {
          this.alertService.presentAlert('danger', err.error.message);
          this.btnLoading = false;
        })
      } else {
        this.alertService.presentAlert('warning', 'Password and confirm password does not match');
      }
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateProfilePhoto(profileId) {
    this.employeeService.updateProfilePhoto(profileId, this.fileToUpload)
      .subscribe((resp: any) => {
        this.fileToUpload = null;
        let index = this.originalemployeeArray.findIndex(x => x.id === profileId);
        this.originalemployeeArray[index] = resp.employee;
        this.update()
      })
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['name', 'email'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originalemployeeArray);

    this.totalItems = data.length;

    this.sort(data);
    this.employeeArray = this.paginate(data);
  }

  filter(data: any) {
    const filter = this.filterVal.toLowerCase();
    return !filter ?
      data.slice(0) :
      data.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(filter) !== -1 || !filter;
      });
  }

  sort(data) {
    data.sort((a: any, b: any) => {
      a = typeof (a[this.sortBy]) === 'string' ? a[this.sortBy].toUpperCase() : a[this.sortBy];
      b = typeof (b[this.sortBy]) === 'string' ? b[this.sortBy].toUpperCase() : b[this.sortBy];

      if (a < b) { return this.sortDesc ? 1 : -1; }
      if (a > b) { return this.sortDesc ? -1 : 1; }
      return 0;
    });
  }

  paginate(data) {
    const perPage = parseInt(String(this.perPage), 10);
    const offset = (this.currentPage - 1) * perPage;

    return data.slice(offset, offset + perPage);
  }

  setSort(key) {
    if (this.sortBy !== key) {
      this.sortBy = key;
      this.sortDesc = false;
    } else {
      this.sortDesc = !this.sortDesc;
    }

    this.currentPage = 1;
    this.update();
  }

}

