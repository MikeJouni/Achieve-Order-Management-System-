import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AlertService } from '../../services/alert.service';
import { CustomerService } from '../../services/customer.service';
import { DriverService } from '../../services/driver.service';
import { LocalService } from '../../services/local.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss',
    '../../../vendor/styles/pages/products.scss',
    '../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class DriversComponent {
  companyType:any = localStorage.getItem('companyType')
  driverData = {
    id: null,
    name: null,
    phone: null,
    address: null,
    city: null,
    barcode : null,
    companyId: this.localService.localCompany,
    employeeId: this.localService.localEmployee,
  }
  btnLoading: boolean = false;
  driverArray: any = [];
  originaldriverArray: any = [];
  driverId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private driverService: DriverService,
    private alertService: AlertService,
    private localService: LocalService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Driver list';
    this.loadData();
  }
  loadData() {
    this.driverService.getAlldrivers()
      .subscribe((data: any) => {
        this.originaldriverArray = data.drivers;
        this.update();
      })
  }
  open(content, item) {
    this.driverDataClear()
    if (item) {
      this.driverData.id = item.id;
      this.driverData.name = item.name;
      this.driverData.phone = item.phone;
      this.driverData.address = item.address;
      this.driverData.city = item.city;
      this.driverData.barcode = item.barcode;
      this.driverId = item.id
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  createDriver() {
    if (this.driverData.name && this.driverData.phone && this.driverData.address && this.driverData.city) {
      this.btnLoading = true
      this.driverService.createdriver(this.driverData).subscribe((resp: any) => {
        this.originaldriverArray.push(resp.driver)
        this.update()
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.driverDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateDriver() {
    if (this.driverData.name && this.driverData.phone && this.driverData.address && this.driverData.city) {
      this.btnLoading = true;
      this.driverService.updatedriver(this.driverData).subscribe((resp: any) => {
        this.originaldriverArray[this.originaldriverArray.findIndex(x => x.id === this.driverData.id)] = resp.driver;
        this.update();
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.driverDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', "Please enter all details");
    }
  }
  deleteDriver() {
    this.driverService.deletedriver(this.driverId).subscribe((resp: any) => {
      this.originaldriverArray.splice([this.originaldriverArray.findIndex((x: any) => x.id === this.driverId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  driverDataClear() {
    this.driverData = {
      id: null,
      name: null,
      phone: null,
      address: null,
      city: null,
      barcode : null,
      companyId: this.localService.localCompany,
      employeeId: this.localService.localEmployee,
    };
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['name', 'city', 'phone'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originaldriverArray);

    this.totalItems = data.length;

    this.sort(data);
    this.driverArray = this.paginate(data);
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

