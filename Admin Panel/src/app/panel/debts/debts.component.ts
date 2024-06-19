import { Component } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isNumber } from 'util';
import { AppService } from '../../app.service';
import { AlertService } from '../../services/alert.service';
import { CustomerService } from '../../services/customer.service';
import { DebtService } from '../../services/debt.service';
import { LocalService } from '../../services/local.service';
import { AdminService } from '../../services/admin.service';
import { TranslationService } from '../../services/translation.service';
const currentDateTime = new Date;
const now = new Date();

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;
@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss',
    '../../../vendor/styles/pages/products.scss',
    '../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class DebtsComponent {
  showRangePicker: boolean = false
  debtData = {
    id: null,
    customerId: null,
    amount: null,
    date: null,
    description: null,
  }
  customerDebtDate = {
    year: currentDateTime.getFullYear(),
    month: currentDateTime.getMonth() + 1,
    day: currentDateTime.getDate(),
  }
  btnLoading: boolean = false;
  customersArray: any;
  debtArray: any = [];
  originaldebtArray: any = [];
  allDebts: any;
  debtId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private debtService: DebtService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private localService: LocalService,
    private adminService: AdminService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Debts list';
    this.loadData();
    this.getStatsData();
  }
  loadData() {
    this.debtService.getAllCustomerDebts()
      .subscribe((data: any) => {
        this.originaldebtArray = data.customerDebts;
        this.allDebts = data.customerDebtsAmount;
        this.update();
      })
    this.customerService.getAllCustomers()
      .subscribe((data: any) => {
        this.customersArray = data.customers;
        this.update();
      })
  }
  // ==========================================
  //for  stats
  statsData = {
    amount: 0,
  }
  statFilter = {
    type: 'this-month',
    date: {
      year: null,
      month: null,
      day: null,
    },
  }
  statTypeList: any = [
    { value: "today", label: "General.TODAY" },
    { value: "yesterday", label: "General.YESTERDAY" },
    { value: "7-days", label: "General.7_DAYS" },
    { value: "30-days", label: "General.30_DAYS" },
    { value: "this-month", label: "General.THIS_MONTH" },
    { value: "last-month", label: "General.LAST_MONTH" },
    { value: "custom-date", label: "General.CUSTOM_DATE" },
    { value: "custom-date-range", label: "General.CUSTOM_DATE_RANGE" },
  ]
  getStatsData() {
    this.adminService.getCustomerDebtAmountsByCompany(this.statFilter, this.fromDate, this.toDate).subscribe((resp: any) => {
      this.statsData.amount = resp.customerDebtAmounts;
    })
    this.showRangePicker = false

  }
  // ==========================================
  open(content, item) {
    this.debtDataClear()
    if (item) {
      this.debtData.id = item.id;
      this.debtData.amount = item.amount;
      this.debtData.customerId = item.customerId;
      this.debtData.description = item.description;
      this.debtId = item.id;
      if (item.date) {
        this.customerDebtDate = {
          year: parseInt(item.date.substr(0, 4)),
          month: parseInt(item.date.substr(5, 6)),
          day: parseInt(item.date.substr(8, 9)),
        };
      } else {
        this.customerDebtDate = {
          year: currentDateTime.getFullYear(),
          month: currentDateTime.getMonth() + 1,
          day: currentDateTime.getDate(),
        }
      }
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  numberWithCommas(x) {
    if (x)
      if (isNumber(x)) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
  }
  createDebt() {
    if (this.debtData.amount && this.debtData.customerId) {
      this.btnLoading = true;
      this.debtData.date = this.customerDebtDate.year + '-' + this.customerDebtDate.month + '-' + this.customerDebtDate.day
      this.debtService.createCustomerDebt(this.debtData).subscribe((resp: any) => {
        this.allDebts = resp.customerDebtsAmount;
        this.customerService.getOneCustomer(resp.customerDebt.customerId).subscribe((data: any) => {
          resp.customerDebt['customerName'] = data.customer.name
        })
        this.originaldebtArray.push(resp.customerDebt)
        this.update()
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.debtDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateDebt() {
    if (this.debtData.customerId && this.debtData.amount) {
      this.btnLoading = true;
      this.debtData.date = this.customerDebtDate.year + '-' + this.customerDebtDate.month + '-' + this.customerDebtDate.day
      this.debtService.updateCustomerDebt(this.debtData).subscribe((resp: any) => {
        this.allDebts = resp.customerDebtsAmount;
        this.customerService.getOneCustomer(resp.customerDebt.customerId).subscribe((data: any) => {
          resp.customerDebt['customerName'] = data.customer.name
        })
        this.originaldebtArray[this.originaldebtArray.findIndex(x => x.id === this.debtData.id)] = resp.customerDebt;
        this.update();
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.debtDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details');
    }
  }
  deleteDebt() {
    this.debtService.deleteCustomerDebt(this.debtId).subscribe((resp: any) => {
      this.allDebts = resp.customerDebtsAmount;
      this.originaldebtArray.splice([this.originaldebtArray.findIndex((x: any) => x.id === this.debtId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  debtDataClear() {
    this.debtData = {
      id: null,
      amount: null,
      date: null,
      customerId: null,
      description: null,
    };
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['amount', 'customerName', 'description'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originaldebtArray);

    this.totalItems = data.length;

    this.sort(data);
    this.debtArray = this.paginate(data);
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
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  onDateChange(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);
}

