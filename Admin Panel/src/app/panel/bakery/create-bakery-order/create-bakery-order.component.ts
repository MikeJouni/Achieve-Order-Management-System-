import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { multiply } from 'numeral';
import { AlertService } from '../../../services/alert.service';
import { CustomerService } from '../../../services/customer.service';
import { DriverService } from '../../../services/driver.service';
import { LocalService } from '../../../services/local.service';
import { OrderService } from '../../../services/order.service';
import { StockService } from '../../../services/stock.service';
import { TranslationService } from '../../../services/translation.service';
@Component({
  selector: 'app-create-bakery-order',
  templateUrl: './create-bakery-order.component.html',
  styleUrls: ['./create-bakery-order.component.scss']
})
export class CreateBakeryOrderComponent implements OnInit {
  orderStatus: any = 'completed';
  customerData = {
    id: null,
    name: null,
    phone: null,
    address: null,
    city: null,
  }
  companyType: any;
  customerArray: any;
  driverArray: any;
  stockArray: any;
  createModal: boolean;
  createModalBtn: boolean;
  orderData = {
    customerId: null,
    driverId: null,
    orderItems: [],
    note: null,
    isAmountNotPaid: null,
    type: 'bakery',
    companyId: this.localService.localCompany,
    employeeId: this.localService.localEmployee,
  }
  btnLoading: boolean = false;
  orderItemsList = [];
  showSelect = true;
  showCustomerSelect = true;
  @ViewChild('stockItemsSelect') stockItemsSelect: NgSelectComponent;
  @ViewChild('stockBarcodeInput') stockBarcodeInput: ElementRef<HTMLInputElement>;
  @ViewChild('driverBarcodeInput') driverBarcodeInput: ElementRef<HTMLInputElement>;
  constructor(
    private customerService: CustomerService,
    private driverService: DriverService,
    private stockService: StockService,
    private orderService: OrderService,
    private alertService: AlertService,
    private location: Location,
    private router: Router,
    private localService: LocalService,
    public translationService: TranslationService,
  ) {
    this.getCompanyType()
    this.getDriverArray();
    this.getVisibleStockArray();
    this.createModal = false;
    this.createModalBtn = true
  }
  orderStockData = {
    id: null,
    title: null,
    quantity: null,
    maxQty: null,
    price: null,
    cost: null,
    profit: null,
    discount: null,
    discountedPrice: null,
    isUnlimitedQty: null,
  }
  ngOnInit() {
    this.orderData.isAmountNotPaid = false;
  }
  getCompanyType() {
    if (localStorage.getItem('companyType')) {
      this.companyType = localStorage.getItem('companyType')
    }
  }

  addItem() {
    this.orderStockData.discount = this.orderStockData.price - this.orderStockData.discountedPrice;
    if (this.orderStockData.id && this.orderStockData.quantity) {
      // const previousItemInd = this.orderItemsList.findIndex(x => x.id == this.orderStockData.id);
      // if (previousItemInd != -1) {
      //   const stock = this.orderItemsList[previousItemInd];
      //   if (this.orderStockData.quantity <= (this.orderStockData.maxQty - stock.quantity)) {
      //     this.orderItemsList[previousItemInd].quantity += this.orderStockData.quantity;
      //     this.orderItemsList[previousItemInd].discount += this.orderStockData.discount;
      //     this.refreshSelect();
      //     // this.clearOrderStockForm();
      //   } else {
      //     this.alertService.presentAlert('warning', 'Quantity must be less than or equal to Max Quantity!');
      //   }
      // } else {
        if ((this.orderStockData.quantity <= this.orderStockData.maxQty) || this.orderStockData.isUnlimitedQty) {
          this.orderItemsList.push({ ...this.orderStockData });
          this.refreshSelect();
          // this.clearOrderStockForm();
        } else {
          this.alertService.presentAlert('warning', 'Quantity must be less than or equal to Max Quantity!');
        }
      // }
    } else {
      this.alertService.presentAlert('warning', 'Please fill the Order Item details!');
    }
  }

  refreshSelect() {
    this.showSelect = false;
    setTimeout(() => {
      this.showSelect = true;
    }, 100);
  }

  refreshCustomerSelect() {
    this.showCustomerSelect = false;
    setTimeout(() => {
      this.showCustomerSelect = true;
    }, 100);
  }

  clearOrderStockForm() {
    this.orderStockData = {
      id: null,
      title: null,
      quantity: null,
      maxQty: null,
      price: null,
      cost: null,
      profit: null,
      discount: null,
      discountedPrice: null,
      isUnlimitedQty: null,
    }
  }
  onChange(event) {
    const status = event.target.checked;
    if (status) {
      this.orderStatus = 'completed'
    }
    if (!status) {
      this.orderStatus = 'pending'
    }
  }

  removeItem(index) {
    this.orderItemsList.splice(index, 1);
  }

  onStockChange(stock) {
    this.orderStockData = {
      id: stock.id,
      title: stock.title,
      quantity: 1,
      maxQty: stock.quantity,
      price: stock.price,
      discount: 0,
      cost: stock.cost,
      profit: stock.profit,
      discountedPrice: stock.price,
      isUnlimitedQty : stock.isUnlimitedQty,
    }
  }
  clearAllData() {
    this.clearOrderStockForm()
    this.orderData.customerId = null
    this.orderData.driverId = null
    this.orderItemsList = null
  }


  createOrderData() {
    if (this.orderData.driverId && this.orderItemsList.length > 0) {
      this.btnLoading = true
      this.orderData.orderItems = this.orderItemsList.map(item => {
        return {
          stockId: item.id,
          quantity: item.quantity,
          discount: item.discount,
        }
      })
      this.orderService.createorder(this.orderData).subscribe((resp: any) => {
        this.alertService.presentAlert('success', resp.message);
        let data = {
          id: resp.order.id,
          status: this.orderStatus
        };
        this.orderService.updateOrderStatus(data).subscribe((resp: any) => {
        })
        this.clearAllData()
        this.btnLoading = false
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  getDriverArray() {
    this.driverService.getAlldrivers()
      .subscribe((resp: any) => {
        this.driverArray = resp.drivers;
        let index = this.driverArray.filter(x => x.name === 'Cedars Bakery')
        this.orderData.driverId = index[0].id;
      })

  }
  getVisibleStockArray() {
    this.stockService.getAllVisibleStocksByCompany()
      .subscribe((resp: any) => {
        this.stockArray = resp.stocks.slice(0);
      })
  }
  onBack() {
    this.location.back()
  }


  onAddStockBarcode() {
    setTimeout(() => {
      const barcode = this.stockBarcodeInput.nativeElement.value;
      const stock = this.stockArray[this.stockArray.findIndex(x => x.barcode == barcode)];
      if (stock) {
        this.onStockChange(stock);
        this.addItem();
      }
    }, 100);
  }

  onAddDriverBarcode() {
    setTimeout(() => {
      const barcode = this.driverBarcodeInput.nativeElement.value;
      const driver = this.driverArray[this.driverArray.findIndex(x => x.barcode == barcode)];
      if (driver) {
        this.orderData.driverId = driver.id;
      }
    }, 100);
  }
}
