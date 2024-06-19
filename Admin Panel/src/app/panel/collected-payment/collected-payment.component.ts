import { Component } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AlertService } from '../../services/alert.service';
import { CollectedPaymentService } from '../../services/collected-payment.service';
import { LocalService } from '../../services/local.service';
import { AdminService } from '../../services/admin.service';
import { isNumber } from 'util';
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
  selector: 'app-collected-payment',
  templateUrl: './collected-payment.component.html',
  styleUrls: ['./collected-payment.component.scss']
})
export class CollectedPaymentComponent {
  showRangePicker: boolean = false;
  btnLoading: boolean = false;
  unformattedDate: any;
  collectedPaymentData = {
    id: null,
    amount: null,
    date: null,
    description: null,
    amountType: null,
    companyId: this.localService.localCompany,
    employeeId: this.localService.localEmployee,
  }
  validCurrencies = [
    { value: 'dollar', label: '$' },
    { value: 'lebanese', label: 'L.L' },
    { value: 'euro', label: '€' },
  ]
  collectedPaymentArray: any = [];
  originalcollectedPaymentArray: any = [];
  collectedPaymentId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private collectedPaymentService: CollectedPaymentService,
    private alertService: AlertService,
    private localService: LocalService,
    private adminService: AdminService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Collected Payment list';
    this.loadData();
    this.getStatsData();
  }
  loadData() {
    this.collectedPaymentService.getAllcollectedPayments()
      .subscribe((data: any) => {
        this.originalcollectedPaymentArray = data.collectedPayments;
        this.update();
      })
  }
  // ==========================================
  //for  stats
  statsData = {
    dollar: 0,
    lebanese: 0,
    euro: 0,
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
  numberWithCommas(x) {
    if (x)
      if (isNumber(x)) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
  }
  getStatsData() {
    this.adminService.getCollectedPaymentAmountsByCompany(this.statFilter, this.fromDate, this.toDate).subscribe((resp: any) => {
      this.statsData = resp.collectedPaymentAmounts;
    })
    this.showRangePicker = false;
  }
  // ==========================================
  open(content, item) {
    this.collectedPaymentDataClear()
    if (item) {
      this.collectedPaymentData.id = item.id;
      this.collectedPaymentData.amount = item.amount;
      // this.collectedPaymentData.date = item.date;
      this.collectedPaymentData.description = item.description;
      this.collectedPaymentData.amountType = item.amountType;
      this.collectedPaymentId = item.id
      if (item.date) {
        this.unformattedDate = {
          year: parseInt(item.date.substr(0, 4)),
          month: parseInt(item.date.substr(5, 6)),
          day: parseInt(item.date.substr(8, 9)),
        };
      }
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  createCollectedPayment() {
    if (this.collectedPaymentData.amount && this.unformattedDate && this.collectedPaymentData.description && this.collectedPaymentData.amountType) {
      this.collectedPaymentData.date = this.unformattedDate.year + '-' + this.unformattedDate.month + '-' + this.unformattedDate.day
      this.btnLoading = true
      this.collectedPaymentService.createcollectedPayment(this.collectedPaymentData).subscribe((resp: any) => {
        this.originalcollectedPaymentArray.push(resp.collectedPayment)
        this.update()
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.collectedPaymentDataClear()
        this.btnLoading = false
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateCollectedPayment() {
    if (this.collectedPaymentData.amount && this.unformattedDate && this.collectedPaymentData.description && this.collectedPaymentData.amountType) {
      this.collectedPaymentData.date = this.unformattedDate.year + '-' + this.unformattedDate.month + '-' + this.unformattedDate.day
      this.btnLoading = true
      this.collectedPaymentService.updatecollectedPayment(this.collectedPaymentData).subscribe((resp: any) => {
        this.originalcollectedPaymentArray[this.originalcollectedPaymentArray.findIndex(x => x.id === this.collectedPaymentData.id)] = resp.collectedPayment;
        this.update();
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.collectedPaymentDataClear()
        this.btnLoading = false
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false
      })
    } else {
      this.alertService.presentAlert('warning', "Please enter all details");
    }
  }
  deleteCollectedPayment() {
    this.collectedPaymentService.deletecollectedPayment(this.collectedPaymentId).subscribe((resp: any) => {
      this.originalcollectedPaymentArray.splice([this.originalcollectedPaymentArray.findIndex((x: any) => x.id === this.collectedPaymentId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  collectedPaymentDataClear() {
    this.collectedPaymentData = {
      id: null,
      amount: null,
      date: null,
      description: null,
      amountType: null,
      companyId: this.localService.localCompany,
      employeeId: this.localService.localEmployee,
    };
    this.unformattedDate = null
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['amount', 'description'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originalcollectedPaymentArray);

    this.totalItems = data.length;

    this.sort(data);
    this.collectedPaymentArray = this.paginate(data);
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


