import { Component, ElementRef, Injectable, VERSION, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Location } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { FileService } from '../../../services/file.service';
import { StyleSheet, css } from "aphrodite";
import { OrderReceiptComponent } from "../../components/order-receipt/order-receipt.component";
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-bakery-order-detail',
  templateUrl: './bakery-order-detail.component.html',
  styleUrls: ['./bakery-order-detail.component.scss']
})
export class BakeryOrderDetailComponent implements OnInit {

  constructor(
    public orderService: OrderService,
    private active: ActivatedRoute,
    private location: Location,
    private adminService: AdminService,
    public translationService: TranslationService,
    private fileService: FileService
  ) {
    this.loadData()
  }

  printType = 'Invoice';

  ngOnInit() {
  }
  orderDetail: any

  orderId = this.active.snapshot.params.id;
  // orderId =  84
  loadData() {
    this.orderService.getOrderDetail(this.orderId)
      .subscribe((resp: any) => {
        this.orderDetail = resp.order;
      })
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

