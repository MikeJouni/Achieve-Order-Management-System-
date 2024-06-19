import { Component, ElementRef, Injectable, VERSION, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Location } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { FileService } from '../../services/file.service';

import { StyleSheet, css } from "aphrodite";
import { OrderReceiptComponent } from "../components/order-receipt/order-receipt.component";
import { TranslationService } from '../../services/translation.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  constructor(
    public orderService: OrderService,
    private active: ActivatedRoute,
    private location: Location,
    private adminService: AdminService,
    private appService : AppService,
    public translationService: TranslationService,
    private fileService: FileService
  ) {
    this.loadData()
  }

  printType = 'Invoice';

  ngOnInit() {
  }
  isEmployee: boolean = false
  orderDetail: any
  isProfitCostVisible:boolean = this.appService.isProfitCostVisible;
  orderId = this.active.snapshot.params.id;
  loadData() {
    this.orderService.getOrderDetail(this.orderId)
      .subscribe((resp: any) => {
        this.orderDetail = resp.order;
      })
      if (localStorage.getItem('employeeData')) {
        this.isEmployee = true
      }
  }
  onBack() {
    this.location.back()
  }










  @ViewChild(OrderReceiptComponent)
  dirToPrint: OrderReceiptComponent;

  public printReceipt(): void {
    this.dirToPrint.print();
  }
}
