import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../../app.service';
import { AlertService } from '../../../services/alert.service';
import { OrderService } from '../../../services/order.service';
import { TranslationService } from '../../../services/translation.service';
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
      selector: 'app-bakery-orders',
      templateUrl: './bakery-orders.component.html',
      styleUrls: ['./bakery-orders.component.scss',
    '../../../../vendor/styles/pages/products.scss',
    '../../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class BakeryOrdersComponent {
  statusData = {
    id: null,
    status: null,
    cancelReason: null,
  }
  showRangePicker:boolean = false;
  companyType:any;
  loading: boolean = false
  currentDate = new Date()
  inProgressOrdersArray: any;
  completedOrdersArray: any;
  cancelledOrdersArray: any;
  myStatus: any;
  orderArray: any = [];
  originalorderArray: any = [];
  orderId: any;
  bindType: any;
  bindDate: any;
  selectType = [
    { value: "today", label: "General.TODAY" },
    { value: "yesterday", label: "General.YESTERDAY" },
    { value: "7-days", label: "General.7_DAYS" },
    { value: "30-days", label: "General.30_DAYS" },
    { value: "this-month", label: "General.THIS_MONTH" },
    { value: "last-month", label: "General.LAST_MONTH" },
    { value: "custom-date", label: "General.CUSTOM_DATE" },
    { value: "custom-date-range", label: "General.CUSTOM_DATE_RANGE" },
  ]
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private orderService: OrderService,
    public translationService: TranslationService,
    private alertService: AlertService
  ) {
    this.appService.pageTitle = 'Order list';
    this.myStatus = 'completed'
    this.bindType = 'today'
    this.loadData();
  }
  async loadData() {
    this.originalorderArray = null;
    this.orderService.getByDateBakery(this.bindType, this.bindDate, this.fromDate , this.toDate)
      .subscribe((data: any) => {
        this.inProgressOrdersArray = data.orders.inProgress;
        this.completedOrdersArray = data.orders.completed;
        this.cancelledOrdersArray = data.orders.cancelled;
        this.getOrderByStatus();
      })
      // to get company type
      if (localStorage.getItem('companyType')) {
        this.companyType = localStorage.getItem('companyType')
      }
      this.showRangePicker =false
  }
  getOrderByStatus() {
    if (this.myStatus == 'inProgress') {
      this.originalorderArray = null
      this.originalorderArray = this.inProgressOrdersArray
      this.update()
    }
    if (this.myStatus == 'completed') {
      this.originalorderArray = null
      this.originalorderArray = this.completedOrdersArray
      this.update()
    }
    if (this.myStatus == 'cancelled') {
      this.originalorderArray = null
      this.originalorderArray = this.cancelledOrdersArray
      this.update()
    }
  }
  open(content, item) {
    if (item) {
      this.statusData.id = item.id;
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  deleteOrder() {
    this.orderService.deleteorder(this.orderId).subscribe((resp: any) => {
      this.originalorderArray.splice([this.originalorderArray.findIndex((x: any) => x.id === this.orderId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  //*on statuses changes
  onStatusChange() {
    this.statusData.cancelReason = null;
    this.loading = true
    this.orderService.updateOrderStatus(this.statusData)
      .subscribe((resp: any) => {
        this.originalorderArray[this.originalorderArray.findIndex(x => x.id === this.statusData.id)].status = this.statusData.status;
        this.originalorderArray.splice([this.originalorderArray.findIndex((x: any) => x.id === this.statusData.id)], 1)
        this.update()
        this.loading = false
      })
    // this.orderService.cancelOrder(this.statusData = { id: this.statusData.id, status: this.statusData.status, cancelReason: null })
    //   .subscribe()
  }
  onStatusCancel() {
    if (this.statusData.cancelReason) {
      this.loading = true
      this.orderService.cancelOrder(this.statusData)
        .subscribe((resp: any) => {
          this.originalorderArray[this.originalorderArray.findIndex(x => x.id === this.statusData.id)].status = this.statusData.status;
          this.originalorderArray.splice([this.originalorderArray.findIndex((x: any) => x.id === this.statusData.id)], 1)
          this.update()
          this.loading = false
        })
      this.modalService.dismissAll()
    } else {
      this.alertService.presentAlert("warning", "PLease enter cancelation reason")
    }
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['uniqueId', 'amount', 'customerName'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originalorderArray);

    this.totalItems = data.length;

    this.sort(data);
    this.orderArray = this.paginate(data);
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


