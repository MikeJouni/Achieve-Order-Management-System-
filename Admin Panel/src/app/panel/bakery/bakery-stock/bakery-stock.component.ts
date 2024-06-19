import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isNumber } from 'util';
import { AppService } from '../../../app.service';
import { AdminService } from '../../../services/admin.service';
import { AlertService } from '../../../services/alert.service';
import { CategoryService } from '../../../services/category.service';
import { FileService } from '../../../services/file.service';
import { LocalService } from '../../../services/local.service';
import { StockService } from '../../../services/stock.service';
import { TranslationService } from '../../../services/translation.service';
@Component({
  selector: 'app-bakery-stock',
  templateUrl: './bakery-stock.component.html',
  styleUrls: ['./bakery-stock.component.scss',
    '../../../../vendor/styles/pages/products.scss',
    '../../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class BakeryStockComponent {
isEmployee:boolean = false;
companyType: any;
  stockData = {
    id: null,
    title: null,
    price: null,
    quantity: null,
    cost: null,
    profit: null,
    source: null,
    note: null,
    fileName: null,
    barcode: null,
    categoryId: null,
    isUnlimitedQty: false,
  }
  btnLoading: boolean = false;
  stockArray: any = [];
  originalstockArray: any = [];
  stockStats: any;
  stockId: any;
  // used in create and update functions
  categoryArray: any;
  //used while displaying
  categoryArrayForListing = [
    { id : 0 , title : 'All'},
    { id : null , title : 'None'},
  ]
  showCategorySelector:boolean = false;
  categoryId:any = 0;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private stockService: StockService,
    private alertService: AlertService,
    private fileService: FileService,
    private localService: LocalService,
    private adminService: AdminService,
    public categoryService : CategoryService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Stock list';
    this.loadData();
    this.getCategories()
  }
  loadData() {
    this.stockService.getAllstocksByCategory(this.categoryId)
      .subscribe((data: any) => {
        this.originalstockArray = data.stocks;
        this.stockStats = data.stockAmount
        // this.originalstockArray.map(item=>{
        //   item["profit"] = item.price - 1;
        //   return item
        // })
        this.update();
      })
    
    if (localStorage.getItem('employeeData')) {
      this.isEmployee = true
    }
    if (localStorage.getItem('companyType')) {
      this.companyType = localStorage.getItem('companyType')
    }
  }
  getCategories() {
    this.categoryService.getAllCategorys().subscribe((resp: any) => {
      this.categoryArray = resp.categories;
      this.categoryArrayForListing.push(...resp.categories)
      this.showCategorySelector = true
    })
  }
  numberWithCommas(x) {
    if (x)
      if (isNumber(x)) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
  }
  open(content, item) {
    this.stockDataClear()
    if (item) {
      this.stockData.id = item.id;
      this.stockData.title = item.title;
      this.stockData.price = item.price;
      this.stockData.quantity = item.quantity;
      this.stockData.cost = item.cost;
      this.stockData.profit = item.profit;
      this.stockData.source = item.source;
      this.stockData.barcode = item.barcode;
      this.stockData.note = item.note;
      this.stockData.fileName = item.fileName;
      this.stockData.categoryId = item.categoryId;
      this.stockData.isUnlimitedQty = item.isUnlimitedQty;
      this.stockId = item.id
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  profitGenerator(price, cost) {
    this.stockData.profit = price - cost;
    this.stockData.profit = this.stockData.profit.toFixed(2);
  }
  // createStock(){
  //   if (this.fileToUpload) {
  //     this.fileService.uploadFile(this.fileToUpload).subscribe((resp:any)=>{
  //       this.stockData.fileName = resp
  //       this.createStockData()
  //     })
  //   } else {
  //     this.createStockData()
  //   }
  // }
  createStock() {
    if (this.stockData.title && this.stockData.price && (this.stockData.quantity || this.stockData.isUnlimitedQty)) {
      this.btnLoading = true;
      this.stockService.createstock(this.stockData).subscribe((resp: any) => {
        this.alertService.presentAlert('success', resp.message);
        this.originalstockArray.push(resp.stock)
        if (this.fileToUpload) {
          this.updateStockImage(resp.stock.id)
        }
        this.update()
        this.modalService.dismissAll();
        this.stockDataClear();
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  // updateStock(){
  //   if (this.fileToUpload) {
  //     this.fileService.uploadFile(this.fileToUpload).subscribe((resp:any)=>{
  //       this.stockData.fileName = resp
  //       this.updateStockData()
  //     })
  //   } else {
  //     this.updateStockData()
  //   }
  // }
  updateStock() {
    this.btnLoading = true;
    this.stockService.updatestock(this.stockData).subscribe((resp: any) => {
      this.originalstockArray[this.originalstockArray.findIndex(x => x.id === this.stockData.id)] = resp.stock;
      if (this.fileToUpload) {
        this.updateStockImage(resp.stock.id)
      }
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
      this.stockDataClear()
      this.btnLoading = false;
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
      this.btnLoading = false;
    })
  }
  deleteStock() {
    this.stockService.deletestock(this.stockId).subscribe((resp: any) => {
      this.originalstockArray.splice([this.originalstockArray.findIndex((x: any) => x.id === this.stockId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  updateStockImage(stockId) {
    this.stockService.updateImage(stockId, this.fileToUpload).subscribe((resp: any) => {
      this.fileToUpload = null;
      let index = this.originalstockArray.findIndex(x => x.id === stockId);
      this.originalstockArray[index] = resp.stock;
      this.update()
    })
  }
  onChange(item, event) {
    const isVisible = event.target.checked;
    let data = {
      id: item.id,
      isVisible: isVisible
    };
    this.stockService.updateVisible(data).subscribe((resp: any) => {
      this.update()
      this.alertService.presentAlert('success', resp.message);
    })
  }
  onUnlimitedQty(event) {
    this.stockData.isUnlimitedQty = event.target.checked
    if (this.stockData.isUnlimitedQty==true) {
      this.stockData.quantity = null
    }
  }
  stockDataClear() {
    this.stockData = {
      id: null,
      title: null,
      price: null,
      quantity: null,
      cost: null,
      profit: null,
      source: null,
      note: null,
      fileName: null,
      barcode: null,
      categoryId: null,
      isUnlimitedQty : false
    };
    this.fileToUpload = null
  }
  fileToUpload: File | null = null;
  handleFileInput(files: FileList) {
    if (files[0].size < 2000 * 1024) {
      this.fileToUpload = files.item(0);
    } else {
      this.alertService.presentAlert('warning', "You can't upload file more than 2 MB")
    }
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['title', 'price', 'barcode'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originalstockArray);

    this.totalItems = data.length;

    this.sort(data);
    this.stockArray = this.paginate(data);
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




