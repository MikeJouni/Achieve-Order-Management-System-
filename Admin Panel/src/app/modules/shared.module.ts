import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../panel/layout/layout.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgxPrintModule } from 'ngx-print';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

const myModules = [

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutModule,
    FormsModule,
    NgSelectModule,
    NgxChartsModule,
    ChartistModule,
    ChartsModule,
    NgxPrintModule,
    // SweetAlert2Module.forRoot({
    //   buttonsStyling: false,
    //   confirmButtonClass: 'btn btn-lg btn-primary',
    //   cancelButtonClass: 'btn btn-lg btn-default'
    // }),
    // NgbModule.forRoot(),
  ],
  exports: [
    LayoutModule,
    FormsModule,
    NgSelectModule,
    NgxChartsModule,
    ChartistModule,
    ChartsModule,
    NgxPrintModule,
    NgbModule,
    SweetAlert2Module,
    TranslateModule,
  ]
})
export class SharedModule { }
