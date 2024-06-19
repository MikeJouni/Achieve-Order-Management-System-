import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { isNumber } from 'util';
import { AdminService } from '../../services/admin.service';
import { CategoryService } from '../../services/category.service';
import { TranslationService } from '../../services/translation.service';
// range pickker
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss',
    '../../../vendor/libs/ng-chartist/ng-chartist.scss',]
})
export class DashboardComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    public translationService: TranslationService,
    public categoryService : CategoryService,
  ) {
    this.bindMonth = "?month=" + this.currentMonth;
    this.bindYear = "&year=" + this.currentYear;
    this.bindType = "&type=year-months";
    this.bindOrderType = 'this-month'
    this.getSalesAnalyticsWithFilter()
    this.getStock()
    this.getStorePaymentAnalyticsWithFilter()
    this.getOrderAmountsByCompany()
    this.getStorePaymentAmountsByCompany()
    this.getCategories()
  }
  ngOnInit() {
  }
  //for ng select used in order stats
  categoryId:any = 0;
  showCategorySelector:boolean = false;
  categoryArray = [
    { id : 0 , title : 'All'},
    { id : null , title : 'None'},
  ]
  showRangePickerOrderStats: boolean = false
  showRangePickerStoreStats: boolean = false
  companyType: any;
  orderStats: {
    amount: '',
    cost: '',
    profit: '',
  };
  storePaymentsStats: any;
  currentMonth = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1);
  currentYear: number = new Date().getFullYear();
  lastYear: number = this.currentYear - 1;
  bindMonth: any;
  bindYear: any;
  bindType: any;
  topSoldStock: any;
  leastSoldStock: any;
  togetherSoldStock: any;
  //for order stats and store payment stats
  selectOrderType = [
    { value: "today", label: "General.TODAY" },
    { value: "yesterday", label: "General.YESTERDAY" },
    { value: "7-days", label: "General.7_DAYS" },
    { value: "30-days", label: "General.30_DAYS" },
    { value: "this-month", label: "General.THIS_MONTH" },
    { value: "last-month", label: "General.LAST_MONTH" },
    { value: "custom-date", label: "General.CUSTOM_DATE" },
    { value: "custom-date-range", label: "General.CUSTOM_DATE_RANGE" },
  ]
  stockStats: any;
  bindOrderType: any;
  bindOrderDate: any;
  //for the charts
  selectMonth = [
    { value: "?month=01", label: "General.JANUARY" },
    { value: "?month=02", label: "General.FEBRUARY" },
    { value: "?month=03", label: "General.MARCH" },
    { value: "?month=04", label: "General.APRIL" },
    { value: "?month=05", label: "General.MAY" },
    { value: "?month=06", label: "General.JUNE" },
    { value: "?month=07", label: "General.JULY" },
    { value: "?month=08", label: "General.AUGUST" },
    { value: "?month=09", label: "General.SEPTEMBER" },
    { value: "?month=10", label: "General.OCTOBER" },
    { value: "?month=11", label: "General.NOVEMBER" },
    { value: "?month=12", label: "General.DECEMBER" },
  ]
  selectYear = [
    { value: "&year=" + this.currentYear, label: this.currentYear },
    { value: "&year=" + this.lastYear, label: this.lastYear },
  ]
  selectType = [
    { value: "&type=month-days", label: "General.MONTHS_DAYS" },
    { value: "&type=year-months", label: "General.YEARS_MONTHS" },
  ]
  show1Chart = false;
  show2Chart = false;
  chart1Data = [
    {
      label: 'Amount',
      data: [],
      borderWidth: 1
    },
    {
      label: 'Cost',
      data: [],
      borderWidth: 1
    },
    {
      label: 'Profit',
      data: [],
      borderWidth: 1
    },
  ];
  chart1DataBakery = [
    {
      label: 'Amount',
      data: [],
      borderWidth: 1
    }
  ];
  chart2Data = [
    {
      label: 'Sales',
      data: [],
      borderWidth: 1
    },
  ];
  chart1Lables = [];
  chart2Lables = [];
  options1 = {
    fullWidth: true,
    chartPadding: {
      right: 40
    }
  };
  //for formating price
  numberWithCommas(x) {
    if (x)
      if (isNumber(x)) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
  }
  // for getting stock categories to get arder stats by filter
  getCategories(){
    this.categoryService.getAllCategorys().subscribe((resp:any)=>{
      this.categoryArray.push(...resp.categories)
      this.showCategorySelector = true
    })
  }
  getSalesAnalyticsWithFilter() {
    this.clearData1();
    this.clearData1Bakery();
    this.adminService.getSalesAnalyticsWithFilter(this.bindMonth, this.bindYear, this.bindType)
      .subscribe(async (resp: any) => {

        await resp.salesList.forEach(element => {
          this.chart1Lables.push(element.formattedDate);

          this.chart1Data[0].data.push(element.amount);
          this.chart1Data[1].data.push(element.cost);
          this.chart1Data[2].data.push(element.profit);
          this.chart1DataBakery[0].data.push(element.amount)
        });
        this.show1Chart = true;
      })
  }
  // order stats
  getOrderAmountsByCompany() {
    this.adminService.getOrderAmountsByCompany(this.bindOrderType, this.bindOrderDate, this.fromDate, this.toDate, this.categoryId).subscribe((resp: any) => {
      this.orderStats = resp.orderAmounts;
      // for diff. b/w bakery and normal company
      if (localStorage.getItem('companyType')) {
        this.companyType = localStorage.getItem('companyType')
      }
    })
    this.showRangePickerOrderStats = false
  }
  // store expenses stats
  getStorePaymentAmountsByCompany() {
    this.adminService.getPaymentAmountsByCompany(this.bindOrderType, this.bindOrderDate, this.fromDate, this.toDate).subscribe((resp: any) => {
      this.storePaymentsStats = resp.storePaymentAmounts;
    })
    this.showRangePickerStoreStats = false
  }
  getStorePaymentAnalyticsWithFilter() {
    this.clearData2();
    this.adminService.getStorePaymentAnalyticsWithFilter(this.bindMonth, this.bindYear, this.bindType)
      .subscribe(async (resp: any) => {
        await resp.storePaymentList.forEach(element => {
          this.chart2Lables.push(element.formattedDate);
          this.chart2Data[0].data.push(element.amount);
        });
        this.show2Chart = true;
      })
  }
  // most sold least sold together sold stocks api
  getStock() {
    this.adminService.getDashboardStatsByCompany()
      .subscribe((resp: any) => {
        this.topSoldStock = resp.topSoldStocks
        this.leastSoldStock = resp.leastSoldStocks
        // this.togetherSoldStock = resp.togetherBoughtItems
        this.stockStats = resp.totalAmountsList
      })
  }
  chart2Colors = [{
    backgroundColor: 'rgba(26, 9, 87, 0.329)',
    borderColor: '#24282C'
  }, {
    backgroundColor: 'rgba(26, 9, 87, 0.329)',
    borderColor: '#24282C'
  }];
  clearData1() {
    this.chart1Data = [
      {
        label: 'Amount',
        data: [],
        borderWidth: 1
      },
      {
        label: 'Cost',
        data: [],
        borderWidth: 1
      },
      {
        label: 'Profit',
        data: [],
        borderWidth: 1
      },
    ];
    this.chart1Lables = [];
    this.show1Chart = false
  }
  clearData1Bakery() {
    this.chart1DataBakery = [
      {
        label: 'Amount',
        data: [],
        borderWidth: 1
      }
    ];
    this.chart1Lables = [];
    this.show1Chart = false
  }
  clearData2() {
    this.chart2Data = [{
      label: 'Store Payment Amount',
      data: [],
      borderWidth: 1
    }];
    this.chart2Lables = [];
    this.show2Chart = false
  }


  options = {
    responsive: false,
    maintainAspectRatio: false
  };

  testColors = [{
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    borderColor: '#FFC107',
  }, {
    backgroundColor: 'rgba(233, 30, 99, 0.3)',
    borderColor: '#E91E63',
  }];

  testData = [{
    label: 'My First dataset',
    data: [43, 91, 89, 16, 21, 79, 28],
    borderWidth: 1,
    borderDash: [5, 5],
    fill: false
  }, {
    label: 'My Second dataset',
    data: [24, 63, 29, 75, 28, 54, 38],
    borderWidth: 1,
  }];
  colors1 = [{
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    borderColor: '#FFC107',
  }, {
    backgroundColor: 'rgba(233, 30, 99, 0.3)',
    borderColor: '#E91E63',
  }];

  //for totalAmountsList
  statNameReturn(title) {
    let result = {
      title: null,
    }

    if (title == 'stockPrice') {
      result = {
        title: 'Total Stock Price',

      }
    } else if (title == 'stockCost') {
      result = {
        title: 'Total Stock Cost',
      }
    } else if (title == 'stockProfit') {
      result = {
        title: 'Total Stock Profit',
      }
      // } else if (title == 'customerDebts') {
      //   result = {
      //     title: 'Total Customer Debts',
      //   }
      // } else if (title == 'paidStorePayments') {
      //   result = {
      //     title: 'Overall Paid Store Payments',
      //   }
      // } else if (title == 'unpaidStorePayments') {
      //   result = {
      //     title: 'Overall Un-Paid Store Payments',
      //   }
    }
    return result;
  }
  //range picker

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
