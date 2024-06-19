import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { AlertService } from '../../services/alert.service';
import { CategoryService } from '../../services/category.service';
import { LocalService } from '../../services/local.service';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss',
    '../../../vendor/styles/pages/products.scss',
    '../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss',
  ]
})
export class CategoryComponent {
  companyType:any = localStorage.getItem('companyType')
  categoryData = {
    id: null,
    title: null,
    companyId: this.localService.localCompany,
    employeeId: this.localService.localEmployee,
  }
  btnLoading: boolean = false;
  categoryArray: any = [];
  originalcategoryArray: any = [];
  categoryId: any;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private localService: LocalService,
    public translationService: TranslationService,
  ) {
    this.appService.pageTitle = 'Category list';
    this.loadData();
  }
  loadData() {
    this.categoryService.getAllCategorys()
      .subscribe((data: any) => {
        this.originalcategoryArray = data.categories;
        this.update();
      })
  }
  open(content, item) {
    this.categoryDataClear()
    if (item) {
      this.categoryData.id = item.id;
      this.categoryData.title = item.title;
      this.categoryId = item.id
    }
    this.modalService.open(content, { windowClass: this.translationService.modalClass, centered: true });
  }
  createCategory() {
    if (this.categoryData.title) {
      this.btnLoading = true
      this.categoryService.createCategory(this.categoryData).subscribe((resp: any) => {
        this.originalcategoryArray.push(resp.category)
        this.update()
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.categoryDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', 'Please enter all details')
    }
  }
  updateCategory() {
    if (this.categoryData.title) {
      this.btnLoading = true;
      this.categoryService.updateCategory(this.categoryData).subscribe((resp: any) => {
        this.originalcategoryArray[this.originalcategoryArray.findIndex(x => x.id === this.categoryData.id)] = resp.category;
        this.update();
        this.modalService.dismissAll();
        this.alertService.presentAlert('success', resp.message);
        this.categoryDataClear()
        this.btnLoading = false;
      }, (err) => {
        this.alertService.presentAlert('danger', err.error.message);
        this.btnLoading = false;
      })
    } else {
      this.alertService.presentAlert('warning', "Please enter all details");
    }
  }
  deleteCategory() {
    this.categoryService.deleteCategory(this.categoryId).subscribe((resp: any) => {
      this.originalcategoryArray.splice([this.originalcategoryArray.findIndex((x: any) => x.id === this.categoryId)], 1)
      this.update()
      this.modalService.dismissAll();
      this.alertService.presentAlert('success', resp.message);
    }, (err) => {
      this.alertService.presentAlert('danger', err.error.message);
    })
  }
  categoryDataClear() {
    this.categoryData = {
      id: null,
      title: null,
      companyId: this.localService.localCompany,
      employeeId: this.localService.localEmployee,
    };
  }
  //! by devault properties
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  searchKeys = ['title'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;


  update() {
    const data = this.filter(this.originalcategoryArray);

    this.totalItems = data.length;

    this.sort(data);
    this.categoryArray = this.paginate(data);
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


