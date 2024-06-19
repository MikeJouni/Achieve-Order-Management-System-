import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { OrderService } from '../../services/order.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-driver-order',
  templateUrl: './driver-order.component.html',
  styleUrls: ['./driver-order.component.scss']
})
export class DriverOrderComponent implements OnInit {
  companyType = localStorage.getItem('companyType')
  driverOrderArray:any;
  originaldriverOrderArray:any;
  driverId= this.active.snapshot.params.id;
  driverInfo:any;
  constructor(
    private orderService: OrderService,
    private active: ActivatedRoute,
    private location :Location,
    private driverService : DriverService,
    public translationService: TranslationService,
  ) {
    this.loadData()
    this.getDriverInfo()
  }
  ngOnInit() {
  }
  loadData(){
    this.orderService.getByDriver(this.driverId)
    .subscribe((resp:any)=>{
      this.originaldriverOrderArray = resp.orders;
      this.update()
    })
  }
  getDriverInfo(){
    this.driverService.getOnedriver(this.driverId)
    .subscribe((resp:any)=>{
      this.driverInfo = resp.driver;
    })
  }
  onBack(){
    this.location.back()
  }
  //! by default properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['amount', 'status', 'uniqueId'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;
  filterVal = '';
  currentPage = 1;
  totalItems = 0;
  update() {
    const data = this.filter(this.originaldriverOrderArray);
    this.totalItems = data.length;
    this.sort(data);
    this.driverOrderArray = this.paginate(data);
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
