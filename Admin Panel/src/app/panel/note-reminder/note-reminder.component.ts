import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AlertService } from '../../services/alert.service';
import { formatDate } from '@angular/common';
import { NoteReminderService } from '../../services/note-reminder.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-note-reminder',
  templateUrl: './note-reminder.component.html',
  styleUrls: ['./note-reminder.component.scss',
    '../../../vendor/styles/pages/products.scss',
    '../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class NoteReminderComponent {
  btnLoading: boolean = false;
  noteReminderData = {
    id: null,
    note: null,
    to: null,
    dueDate: null,
  }
  unformattedDate: any;
  currentDate: any = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  noteReminderArray: any = [];
  originalnoteReminderArray: any = [];
  noteReminderId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private noteReminderService: NoteReminderService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Note Reminder list';
    this.loadData();
  }
  loadData() {
    this.noteReminderService.getAllnoteReminders()
      .subscribe((data: any) => {
        this.originalnoteReminderArray = data.noteReminders;
        this.update();
      })
  }
  open(content, item) {
    this.noteReminderDataClear()
    if (item) {
      this.noteReminderData.id = item.id;
      this.noteReminderData.note = item.note;
      this.noteReminderData.to = item.to;
      this.noteReminderId = item.id
      if (item.dueDate) {
        this.unformattedDate = {
          year: parseInt(item.dueDate.substr(0, 4)),
          month: parseInt(item.dueDate.substr(5, 6)),
          day: parseInt(item.dueDate.substr(8, 9)),
        };
      }
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  createNoteReminder() {
    if (this.noteReminderData.note && this.noteReminderData.to && this.unformattedDate) {
      this.noteReminderData.dueDate = this.unformattedDate.year + '-' + this.unformattedDate.month + '-' + this.unformattedDate.day
      this.btnLoading = true;
      this.noteReminderService.createnoteReminder(this.noteReminderData).subscribe((resp: any) => {
        this.originalnoteReminderArray.push(resp.noteReminder)
        this.update()
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.noteReminderDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateNoteReminder() {
    if (this.noteReminderData.note && this.noteReminderData.to && this.unformattedDate) {
      this.noteReminderData.dueDate = this.unformattedDate.year + '-' + this.unformattedDate.month + '-' + this.unformattedDate.day
      this.btnLoading = true;
      this.noteReminderService.updatenoteReminder(this.noteReminderData).subscribe((resp: any) => {
        this.originalnoteReminderArray[this.originalnoteReminderArray.findIndex(x => x.id === this.noteReminderData.id)] = resp.noteReminder;
        this.update();
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.noteReminderDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  deleteNoteReminder() {
    this.noteReminderService.deletenoteReminder(this.noteReminderId).subscribe((resp: any) => {
      this.originalnoteReminderArray.splice([this.originalnoteReminderArray.findIndex((x: any) => x.id === this.noteReminderId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
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
        if (difference >= 1) {
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
  noteReminderDataClear() {
    this.noteReminderData = {
      id: null,
      note: null,
      to: null,
      dueDate: null,
    };
    this.unformattedDate = null
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['note', 'to', 'dueDate'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originalnoteReminderArray);

    this.totalItems = data.length;

    this.sort(data);
    this.noteReminderArray = this.paginate(data);
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


