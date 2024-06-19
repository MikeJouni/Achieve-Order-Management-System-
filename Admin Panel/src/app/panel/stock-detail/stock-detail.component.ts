import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { AdminService } from '../../services/admin.service';
import { StockService } from '../../services/stock.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  companyType:any = localStorage.getItem('companyType')
  stockId:any = this.active.snapshot.params.id;
  isProfitCostVisible: boolean = this.appService.isProfitCostVisible;
  isEmployee: boolean = false;
  stockDetail:any;
  orderItem:any;
  constructor(
    private stockService : StockService,
    private appService : AppService,
    private active : ActivatedRoute,
    private location : Location,
    private adminService : AdminService,
    public translationService: TranslationService,
  ) {
    this.getDetail()
  }

  ngOnInit() {
  }

  getDetail(){
    this.stockService.getOnestock(this.stockId)
    .subscribe((resp:any)=>{
      this.stockDetail = resp.stock;
      this.orderItem = resp.orderItems;
      if (localStorage.getItem('employeeData')) {
        this.isEmployee = true
      }
    })
  }

  onBack(){
    this.location.back()
  }

}
