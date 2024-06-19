import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AlertService } from '../../services/alert.service';
import { CustomerService } from '../../services/customer.service';
import { LocalService } from '../../services/local.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss',
    '../../../vendor/styles/pages/products.scss',
    '../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class CustomersComponent {
  btnLoading: boolean = false;
  customerData = {
    id: null,
    name: null,
    phone: null,
    address: null,
    city: null,
  }
  companyType :any = localStorage.getItem('companyType')
  customerArray: any = [];
  originalcustomerArray: any = [];
  customerId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private customerService: CustomerService,
    private alertService: AlertService,
    private localService: LocalService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Customer list';
    this.loadData();
  }
  loadData() {
    this.customerService.getAllCustomers()
      .subscribe((data: any) => {
        this.originalcustomerArray = data.customers;
        this.update();
      })
  }
  open(content, item) {
    this.customerDataClear()
    if (item) {
      this.customerData.id = item.id;
      this.customerData.name = item.name;
      this.customerData.phone = item.phone;
      this.customerData.address = item.address;
      this.customerData.city = item.city;
      this.customerId = item.id
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  createCustomer() {
    if (this.customerData.name && this.customerData.phone && this.customerData.address && this.customerData.city) {
      this.btnLoading = true;
      this.customerService.createCustomer(this.customerData).subscribe((resp: any) => {
        this.originalcustomerArray.push(resp.customer)
        this.update()
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.customerDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateCustomer() {
    if (this.customerData.name && this.customerData.phone && this.customerData.address && this.customerData.city) {
      this.btnLoading = true;
      this.customerService.updateCustomer(this.customerData).subscribe((resp: any) => {
        this.originalcustomerArray[this.originalcustomerArray.findIndex(x => x.id === this.customerData.id)] = resp.customer;
        this.update();
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.customerDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details');
    }
  }
  deleteCustomer() {
    this.customerService.deleteCustomer(this.customerId).subscribe((resp: any) => {
      this.originalcustomerArray.splice([this.originalcustomerArray.findIndex((x: any) => x.id === this.customerId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  customerDataClear() {
    this.customerData = {
      id: null,
      name: null,
      phone: null,
      address: null,
      city: null,
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
    const data = this.filter(this.originalcustomerArray);

    this.totalItems = data.length;

    this.sort(data);
    this.customerArray = this.paginate(data);
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

