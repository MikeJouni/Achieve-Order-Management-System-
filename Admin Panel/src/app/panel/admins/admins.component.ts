import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AdminService } from '../../services/admin.service';
import { AlertService } from '../../services/alert.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss',
    '../../../vendor/styles/pages/products.scss',
    '../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class AdminsComponent {
  btnLoading: boolean = false;
  profilePhotoVar: any;
  fileToUpload: File | null = null;
  adminData = {
    id: null,
    name: '',
    email: '',
    password: '',
  }
  profileData: any;
  adminArray: any = [];
  originaladminArray: any = [];
  editAdmin: boolean = true;
  imageUrl: any;
  newPassword = {
    id: null,
    password: null,
    confirmPassword: null
  };
  adminId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private adminService: AdminService,
    private alertService: AlertService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Admin list';
    this.loadData();
  }
  loadData() {
    this.adminService.getAllAdmin()
      .subscribe((data: any) => {
        this.originaladminArray = data.admins;
        this.update();
      })
  }
  open(content, item) {
    this.admindataClear()
    if (item) {
      this.adminData.id = item.id;
      this.adminData.name = item.name;
      this.adminData.email = item.email;
      this.adminId = item.id
      this.newPassword.id = item.id;
      this.profilePhotoVar = item.profilePhoto;
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  modalUpdatePassword() {
    this.editAdmin = false;
  }
  createAdmin() {
    if (this.adminData.name && this.adminData.email && this.adminData.password) {
      if (this.adminData.password == this.newPassword.confirmPassword) {
        this.btnLoading = true;
        this.adminService.createAdmin(this.adminData).subscribe((resp: any) => {
          this.originaladminArray.push(resp.admin)
          if (this.fileToUpload) {
            this.updateProfilePhoto(resp.admin.id)
          } else {
            this.update();
          }
          this.modalService.dismissAll();
          this.alertService.presentAlert('success', resp.message);
          this.admindataClear()
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
  updateAdmin() {
    if (this.adminData.name && this.adminData.email) {
      this.btnLoading = true;
      this.adminService.updateAdmin(this.adminData).subscribe((resp: any) => {
        this.originaladminArray[this.originaladminArray.findIndex(x => x.id === this.adminData.id)] = resp.admin;
        this.update()
        if (this.fileToUpload) {
          this.updateProfilePhoto(resp.admin.id);
        } else {
        }
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.admindataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  deleteAdmin() {
    this.adminService.deleteAdmin(this.adminId).subscribe((resp: any) => {
      this.originaladminArray.splice([this.originaladminArray.findIndex((x: any) => x.id === this.adminId)], 1)
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
  admindataClear() {
    this.adminData = {
      id: null,
      name: '',
      email: '',
      password: '',
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
        this.adminService.updatePassword(this.newPassword).subscribe((resp: any) => {
          this.originaladminArray[this.adminArray.findIndex(x => x.id === this.adminData.id)] = resp.admin;
          this.modalService.dismissAll()
          this.alertService.presentAlert('success', resp.message);
          this.btnLoading = false
        }, (err) => {
          this.alertService.presentAlert('danger', err.error.message);
          this.btnLoading = false
        })
      } else {
        this.alertService.presentAlert('warning', 'Password not matched');
      }
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateProfilePhoto(profileId) {
    this.adminService.updateImage(profileId, this.fileToUpload)
      .subscribe((resp: any) => {
        this.fileToUpload = null;
        let index = this.originaladminArray.findIndex(x => x.id === profileId);
        this.originaladminArray[index] = resp.admin;
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
    const data = this.filter(this.originaladminArray);

    this.totalItems = data.length;

    this.sort(data);
    this.adminArray = this.paginate(data);
  }

  filter(data) {
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

