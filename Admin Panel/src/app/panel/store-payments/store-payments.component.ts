import { Component } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AlertService } from '../../services/alert.service';
import { StorePaymentService } from '../../services/store-payment.service';
import { isNumber } from 'util';
import { AdminService } from '../../services/admin.service';
import { TranslationService } from '../../services/translation.service';
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
  selector: 'app-store-payments',
  templateUrl: './store-payments.component.html',
  styleUrls: ['./store-payments.component.scss',
    '../../../vendor/styles/pages/products.scss',
    '../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class StorePaymentsComponent {
  statTypeList:any = [
    { value: "today", label: "General.TODAY" },
    { value: "yesterday", label: "General.YESTERDAY" },
    { value: "7-days", label: "General.7_DAYS" },
    { value: "30-days", label: "General.30_DAYS" },
    { value: "this-month", label: "General.THIS_MONTH" },
    { value: "last-month", label: "General.LAST_MONTH" },
    { value: "custom-date", label: "General.CUSTOM_DATE" },
    { value: "custom-date-range", label: "General.CUSTOM_DATE_RANGE" },
  ]
  showRangePicker:boolean = false
  btnLoading: boolean = false;
  storePaymentData = {
    id: null,
    detail: null,
    amount: null,
    isPaid: null,
  }
  isPaidOptions = [
    { value: true, label: "Paid" },
    { value: false, label: "Pending" }
  ]
  allPayments: any;
  storePaymentArray: any = [];
  originalstorePaymentArray: any = [];
  storePaymnetId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private storePaymentService: StorePaymentService,
    private alertService: AlertService,
    private adminService: AdminService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Store Payment list';
    this.loadData();
    this.getStatsData();
  }
  loadData() {
    this.storePaymentService.getStorePaymentByCompany()
      .subscribe((data: any) => {
        this.originalstorePaymentArray = data.storePayments;
        this.allPayments = data.storePaymentsAmount;
        this.update();
      })
  }

  // ==========================================
  //for  store payment stats
  statsData={
    paid: 0,
    unPaid: 0,
  }
  statFilter = {
    type: 'this-month',
    date: {
      year: null,
      month: null,
      day: null,
    },
  }
 
  getStatsData() {
    this.adminService.getStorePaymentAmountsByCompany(this.statFilter, this.fromDate , this.toDate).subscribe((resp: any) => {
      this.statsData = resp.storePaymentAmounts;
    })
    this.showRangePicker = false
  }
  // ==========================================


  open(content, item) {
    this.storePaymentDataClear()
    if (item) {
      this.storePaymentData.id = item.id;
      this.storePaymentData.amount = item.amount;
      this.storePaymentData.detail = item.detail;
      this.storePaymentData.isPaid = item.isPaid;
      this.storePaymnetId = item.id
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
  createStorePayment() {
    if (this.storePaymentData.amount && this.storePaymentData.detail) {
      this.btnLoading = true
      this.storePaymentService.createstorePayment(this.storePaymentData).subscribe((resp: any) => {
        this.allPayments = resp.storePaymentsAmount;
        this.originalstorePaymentArray.push(resp.storePayment)
        this.update()
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.storePaymentDataClear()
        this.btnLoading = false
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateStorePayment() {
    if (this.storePaymentData.amount && this.storePaymentData.detail) {
      this.btnLoading = true
      this.storePaymentService.updatestorePayment(this.storePaymentData).subscribe((resp: any) => {
        this.allPayments = resp.storePaymentsAmount;
        this.originalstorePaymentArray[this.originalstorePaymentArray.findIndex(x => x.id === this.storePaymentData.id)] = resp.storePayment;
        this.update()
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.storePaymentDataClear()
        this.btnLoading = false
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  deleteStorePayment() {
    this.storePaymentService.deletestorePayment(this.storePaymnetId).subscribe((resp: any) => {
      this.allPayments = resp.storePaymentsAmount;
      this.originalstorePaymentArray.splice([this.originalstorePaymentArray.findIndex((x: any) => x.id === this.storePaymnetId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  onChange(storePaymentId, event) {
    const isPaid = event.target.checked;
    let data = {
      id: storePaymentId,
      isPaid: isPaid
    };

    this.storePaymentService.updatestorePayment(data).subscribe((resp: any) => {
      this.alertService.presentAlert('success', resp.message);
    })
  }
  storePaymentDataClear() {
    this.storePaymentData = {
      id: null,
      amount: null,
      detail: null,
      isPaid: null,
    };
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['amount', 'detail'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originalstorePaymentArray);

    this.totalItems = data.length;

    this.sort(data);
    this.storePaymentArray = this.paginate(data);
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

