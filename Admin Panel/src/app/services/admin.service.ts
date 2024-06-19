import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  isAdminTrue: boolean;
  url = environment.baseUrl;
  webUrl = environment.webUrl;
  selectedDate: any;
  fileUrl: any
  localCompany: any;
  newToDate:any;
  newFromDate:any;
  constructor(
    public http: HttpClient,
    public router: Router
  ) {
    this.fileUrl = this.url + 'file/';
    this.localCompany = localStorage.getItem('companyId');
  }
  getAllAdmin() {
    return this.http.get(this.url + 'ap/admin/get-all')
  }

  createAdmin(data) {
    return this.http.post(this.url + 'ap/admin/create', data)
  }

  updateAdmin(data) {
    return this.http.patch(this.url + 'ap/admin/update', data)
  }

  deleteAdmin(id) {
    return this.http.delete(this.url + 'ap/admin/delete/' + id)
  }

  getOneAdmin(id) {
    return this.http.get(this.url + 'ap/admin/get-one/' + id)
  }

  getOneDetail(id) {
    return this.http.get(this.url + 'ap/admin/get-one-detail/' + id)
  }

  changePassword(data) {
    return this.http.patch(this.url + 'ap/admin/change-password', data)
  }

  updatePassword(data) {
    return this.http.patch(this.url + 'ap/admin/update-password', data)
  }

  updateImage(id, data) {
    const fd = new FormData();
    fd.append('file', data);
    return this.http.post(this.url + 'ap/admin/update-profile-photo/' + id, fd)
  }

  loginAdmin(loginData) {
    return this.http.post(this.url + 'ap/admin/login', loginData);
  }

  localAdminData() {
    let result = null;
    let localAdmin = localStorage.getItem('adminData');
    let localCompany = localStorage.getItem('companyId');
    if (localAdmin) {
      result = JSON.parse(localAdmin);
    }
    return result;
  }

  onLogout() {
    localStorage.clear();
    window.location.href = this.webUrl + 'login';
  }

  getSalesAnalyticsWithFilter(month, year, type) {
    return this.http.get(this.url + 'ap/admin/get-sales-analytics-by-company/' + this.localCompany + month + year + type)
  }
  // getSalesAnalytics(){
  //   return this.http.get(this.url + 'ap/admin/get-sales-analytics-by-company/'+ this.localCompany +'?month=03&year=2023&type=year-months')
  // }
  getStockAnalytics() {
    return this.http.get(this.url + 'ap/admin/get-stock-stats-by-company/' + this.localCompany)
  }
  getStorePaymentAnalyticsWithFilter(month, year, type) {
    return this.http.get(this.url + 'ap/admin/get-store-payment-analytics-by-company/' + this.localCompany + month + year + type)
  }
  unassignCompnayAdmins(companyId) {
    return this.http.get(this.url + 'ap/admin/get-unassign-by-company/' + companyId)
  }
  getOrderAmountsByCompany(type, date , fromDate , toDate , categoryId) {
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
    return this.http.get(this.url + 'ap/admin/get-order-amounts-by-company-and-date', { params: { date: this.selectedDate, type: type, categoryId: categoryId, companyId: this.localCompany,fromDate : this.newFromDate, toDate : this.newToDate, } })
  }
  getPaymentAmountsByCompany(type, date, fromDate, toDate) {
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
    return this.http.get(this.url + 'ap/admin/get-store-payment-amounts-by-company-and-date', { params: { date: this.selectedDate, type: type, companyId: this.localCompany,fromDate : this.newFromDate, toDate : this.newToDate, } })
  }
  updateLoginBackground(data) {
    const fd = new FormData();
    fd.append('file', data);
    return this.http.post(this.url + 'ap/custom-variable/update-login-background', fd)
  }
  getLoginBackground() {
    return this.http.get(this.url + 'ap/custom-variable/get-login-background')
  }
  getDashboardStatsByCompany() {
    return this.http.get(this.url + 'ap/admin/get-dashboard-stats-by-company/' + this.localCompany)
  }

  getStorePaymentAmountsByCompany(filterData, fromDate , toDate) {
    const selectedDate = filterData.date ? (filterData.date.year + '-' + filterData.date.month + '-' + filterData.date.day) : null;
    const selectedType = filterData.type;
    if (fromDate) {
      this.newFromDate = fromDate.year + '-' + fromDate.month + '-' + fromDate.day
    }
    if (toDate) {
      this.newToDate = toDate.year + '-' + toDate.month + '-' + toDate.day
    }
    return this.http.get(this.url + 'ap/admin/get-store-payment-amounts-by-company-and-date', { params: { date: selectedDate, type: selectedType, companyId: this.localCompany , fromDate : this.newFromDate, toDate : this.newToDate,} })
  }
  getCollectedPaymentAmountsByCompany(filterData, fromDate , toDate) {///////////////////////
    const selectedDate = filterData.date ? (filterData.date.year + '-' + filterData.date.month + '-' + filterData.date.day) : null;
    const selectedType = filterData.type;
    if (fromDate) {
      this.newFromDate = fromDate.year + '-' + fromDate.month + '-' + fromDate.day
    }
    if (toDate) {
      this.newToDate = toDate.year + '-' + toDate.month + '-' + toDate.day
    }
    return this.http.get(this.url + 'ap/admin/get-collected-payment-amounts-by-company-and-date', { params: { date: selectedDate, type: selectedType, companyId: this.localCompany, fromDate : this.newFromDate, toDate : this.newToDate, } })
  }
  getCustomerDebtAmountsByCompany(filterData, fromDate, toDate) {
    const selectedDate = filterData.date ? (filterData.date.year + '-' + filterData.date.month + '-' + filterData.date.day) : null;
    const selectedType = filterData.type;
    if (fromDate) {
      this.newFromDate = fromDate.year + '-' + fromDate.month + '-' + fromDate.day
    }
    if (toDate) {
      this.newToDate = toDate.year + '-' + toDate.month + '-' + toDate.day
    }
    return this.http.get(this.url + 'ap/admin/get-customer-debt-amounts-by-company-and-date', { params: { date: selectedDate, type: selectedType, companyId: this.localCompany, fromDate : this.newFromDate, toDate : this.newToDate } })
  }
}
