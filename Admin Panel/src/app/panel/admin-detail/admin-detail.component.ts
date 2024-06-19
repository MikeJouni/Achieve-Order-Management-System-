import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.scss',
    '../../../vendor/styles/pages/users.scss',
  ]
})
export class AdminDetailComponent implements OnInit {
  adminArray: any;
  adminId: any;
  constructor(
    private adminService: AdminService,
    private active: ActivatedRoute,
    private location: Location,
    public translationService: TranslationService,
  ) {
    this.getAdminId()
    this.getAdminDetail()
  }
  ngOnInit() {
  }
  getAdminId() {
    if (this.active.snapshot.params.id) {
      this.adminId = this.active.snapshot.params.id
    } else {
      this.adminId = this.adminService.localAdminData().id
    }
  }
  getAdminDetail() {
    this.adminService.getOneDetail(this.adminId)
      .subscribe((resp: any) => {
        this.adminArray = resp.admin;
      })
  }
  calculateDiff(dateSent) {
    var result = {
      type: null,
      days: null,
    }
    if (dateSent) {
      let currentDate = new Date();
      dateSent = new Date(dateSent);
      const difference = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24))
      if (!Number.isNaN(difference)) {
        if (difference >= 0) {
          result = {
            type: true,
            days: difference,
          };
        } else {
          result = {
            type: false,
            days: -(difference),
          };
        }
      }
    }
    return result;
  }
  onBack() {
    this.location.back()
  }
}
