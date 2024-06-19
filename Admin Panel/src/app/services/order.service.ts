import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  url = environment.baseUrl
  newFromDate: string;
  newToDate: string;
  constructor(
    public http: HttpClient,
    private localService: LocalService
  ) {
  }
  createorder(data) {
    data["companyId"] = this.localService.localCompany;
    data["employeeId"] = this.localService.localEmployeeId;
    return this.http.post(this.url + 'ap/order/create', data)
  }
  updateOrderStatus(data) {
    data["companyId"] = this.localService.localCompany;
    data["employeeId"] = this.localService.localEmployeeId;
    return this.http.patch(this.url + 'ap/order/update-status', data)
  }
  cancelOrder(data) {
    data["companyId"] = this.localService.localCompany;
    data["employeeId"] = this.localService.localEmployeeId;
    return this.http.patch(this.url + 'ap/order/cancel-re-cancel', data)
  }
  deleteorder(id) {
    if (this.localService.localEmployeeId) {
      return this.http.delete(this.url + 'ap/order/delete/' + id, { params: { employeeId: this.localService.localEmployeeId } })
    } else {
      return this.http.delete(this.url + 'ap/order/delete/' + id)
    }
  }
  getOrderDetail(id) {
    return this.http.get(this.url + 'ap/order/get-detail/' + id)
  }
  getAllorders() {
    return this.http.get(this.url + 'ap/order/get-by-company/' + this.localService.localCompany)
  }
  getByCustomer(id) {
    return this.http.get(this.url + 'ap/order/get-by-customer/' + id)
  }
  getByDriver(id) {
    return this.http.get(this.url + 'ap/order/get-by-driver/' + id)
  }
  selectedDate: any;
  getByDateNormal(type, date, fromDate, toDate) {
    if (date) {
      this.selectedDate = date.year + '-' + date.month + '-' + date.day
    } else {
      this.selectedDate = date
    }
    if (fromDate) {
      this.newFromDate = fromDate.year + '-' + fromDate.month + '-' + fromDate.day
    }
    if (toDate) {
      this.newToDate = toDate.year + '-' + toDate.month + '-' + toDate.day
    }
    return this.http.get(this.url + 'ap/order/get-by-company-and-date', { params: {orderType: 'normal', date: this.selectedDate, type: type, companyId: this.localService.localCompany, fromDate : this.newFromDate, toDate : this.newToDate, } })
  }
  getByDateBakery(type, date, fromDate, toDate) {
    if (date) {
      this.selectedDate = date.year + '-' + date.month + '-' + date.day
    } else {
      this.selectedDate = date
    }
    if (fromDate) {
      this.newFromDate = fromDate.year + '-' + fromDate.month + '-' + fromDate.day
    }
    if (toDate) {
      this.newToDate = toDate.year + '-' + toDate.month + '-' + toDate.day
    }
    return this.http.get(this.url + 'ap/order/get-by-company-and-date', { params: {orderType: 'bakery', date: this.selectedDate, type: type, companyId: this.localService.localCompany, fromDate : this.newFromDate, toDate : this.newToDate, } })
  }

}
