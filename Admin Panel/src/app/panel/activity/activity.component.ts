import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  constructor(
    private activityService: ActivityService,
    public translationService: TranslationService,
  ) {
    this.bindMonth = "?month=" + this.currentMonth;
    this.bindYear = "&year=" + this.currentYear;
    this.bindType = "&type=year";
    this.getActivity()
  }
  ngOnInit() {
  }
  currentMonth = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1);
  currentYear: number = new Date().getFullYear();
  lastYear: number = this.currentYear - 1;
  bindMonth: any;
  bindYear: any;
  bindType: any;
  activityArray: any;
  originalactivityArray: any;
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
    { value: "&type=month", label: "General.MONTH" },
    { value: "&type=year", label: "General.YEAR" },
  ]
  getActivity() {
    this.activityService.getActivities(this.bindMonth, this.bindYear, this.bindType)
      .subscribe((resp: any) => {
        this.activityArray = resp.activities;
        this.sortData
      })
  }
  get sortData() {
    return this.activityArray.sort((a, b) => {
      return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
    });
  }
}
