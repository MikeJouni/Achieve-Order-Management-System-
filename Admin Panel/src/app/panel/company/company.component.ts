import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AdminService } from '../../services/admin.service';
import { AlertService } from '../../services/alert.service';
import { CompanyService } from '../../services/company.service';
import { formatDate } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss',
    '../../../vendor/styles/pages/products.scss',
    '../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class CompanyComponent {
  companyData = {
    id: null,
    name: null,
    detail: null,
    adminId: null,
    licenseExpiryDate: null,
    type : 'normal',
  }
  selectType = [
    {value :'normal', label : 'Normal'},
    {value :'bakery', label : 'Bakery'},
  ]
  btnLoading: boolean = false;
  unformattedDate: any;
  currentDate: any = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  companyStatus: boolean;
  unAssignAdminsArray: any;
  adminArray: any;
  companyArray: any = [];
  originalcompanyArray: any = [];
  companyId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private companyService: CompanyService,
    private adminService: AdminService,
    public translationService: TranslationService,

  ) {
    this.appService.pageTitle = 'Company list';
    this.companyStatus = false;
    this.loadData();
    this.getAdminArray()
    this.unAssignedAdmin()
  }
  loadData() {
    this.companyService.getByStatus(this.companyStatus)
      .subscribe((data: any) => {
        this.originalcompanyArray = data.companies;
        this.update();
      })
  }
  unAssignedAdmin() {
    this.adminService.unassignCompnayAdmins(this.companyId)
      .subscribe((resp: any) => {
        this.unAssignAdminsArray = resp.admins;
      })
  }
  getAdminArray() {
    this.adminService.getAllAdmin()
      .subscribe((resp: any) => {
        this.adminArray = resp.admins
      })
  }
  open(content, item) {
    this.companyDataClear()
    if (item) {
      this.companyData.id = item.id;
      this.companyData.name = item.name;
      this.companyData.detail = item.detail;
      this.companyData.adminId = item.adminId;
      this.companyData.type = item.type;
      this.companyId = item.id
      if (item.licenseExpiryDate) {
        this.unformattedDate = {
          year: parseInt(item.licenseExpiryDate.substr(0, 4)),
          month: parseInt(item.licenseExpiryDate.substr(5, 6)),
          day: parseInt(item.licenseExpiryDate.substr(8, 9)),
        };
      }
      this.unAssignedAdmin()
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  createCompany() {
    if (this.companyData.name && this.companyData.detail && this.companyData.type && this.companyData.adminId && this.unformattedDate) {
      this.companyData.licenseExpiryDate = this.unformattedDate.year + '-' + this.unformattedDate.month + '-' + this.unformattedDate.day
      this.btnLoading = true
      this.companyService.createcompany(this.companyData).subscribe((resp: any) => {
        this.originalcompanyArray.push(resp.company)
        this.update()
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.companyDataClear()
        this.btnLoading = false
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateCompany() {
    if (this.companyData.name && this.companyData.detail && this.companyData.type && this.companyData.adminId && this.unformattedDate) {
      this.companyData.licenseExpiryDate = this.unformattedDate.year + '-' + this.unformattedDate.month + '-' + this.unformattedDate.day
      this.btnLoading = true
      this.companyService.updatecompany(this.companyData).subscribe((resp: any) => {
        this.originalcompanyArray[this.originalcompanyArray.findIndex(x => x.id === this.companyData.id)] = resp.company;
        this.update();
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.companyDataClear()
        this.btnLoading = false
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  deleteCompany() {
    this.companyService.deletecompany(this.companyId).subscribe((resp: any) => {
      this.originalcompanyArray.splice([this.originalcompanyArray.findIndex((x: any) => x.id === this.companyId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  onChange(companyId, event) {
    const isDeleted = event.target.checked;
    let data = {
      id: companyId,
      isDeleted: isDeleted
    };
    this.companyService.companyStatusDelete(data).subscribe((resp: any) => {
      this.originalcompanyArray.splice([this.originalcompanyArray.findIndex((x: any) => x.id === companyId)], 1)
      this.update()
      this.alertService.presentAlert('success', resp.message);
    })
  }
  calculateDiff(dateSent) {
    var result = {
      type: null,
      days: null,
    }
    if (dateSent) {
      let currentDate = new Date();
      dateSent = new Date(dateSent);
      const difference = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24))
      if (!Number.isNaN(difference)) {
        if (difference >= 0) {
          result = {
            type: true,
            days: difference,
          };
        } else {
          result = {
            type: false,
            days: -(difference),
          };
        }
      }
    }
    return result;
  }
  companyDataClear() {
    this.companyData = {
      id: null,
      name: null,
      detail: null,
      adminId: null,
      licenseExpiryDate: null,
      type: 'normal',
    };
    this.unformattedDate = null
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['name', 'detail'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originalcompanyArray);

    this.totalItems = data.length;

    this.sort(data);
    this.companyArray = this.paginate(data);
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

