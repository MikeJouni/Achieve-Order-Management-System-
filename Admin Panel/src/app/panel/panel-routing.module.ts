import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Layout2Component } from './layout/layout-2/layout-2.component';

import { ForwardGuard } from '../guards/forward.guard';
import { EmployeeGuard } from '../guards/employee.guard';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminGuard } from '../guards/admin.guard';
import { BakeryEmployeeGuard } from '../guards/bakery-employee.guard';


const routes: Routes = [
  {
    path: '', component: Layout2Component, canActivate: [ForwardGuard], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'activity', loadChildren: './activity/activity.module#ActivityModule', canActivate: [EmployeeGuard, SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'admin-detail', loadChildren: './admin-detail/admin-detail.module#AdminDetailModule', canActivate: [EmployeeGuard , BakeryEmployeeGuard] },
      { path: 'admin-detail/:id', loadChildren: './admin-detail/admin-detail.module#AdminDetailModule', canActivate: [AdminGuard, EmployeeGuard, BakeryEmployeeGuard] },
      { path: 'admin-settings', loadChildren: './admin-settings/admin-settings.module#AdminSettingsModule', canActivate: [EmployeeGuard, BakeryEmployeeGuard] },
      { path: 'admin', loadChildren: './admins/admins.module#AdminsModule', canActivate: [AdminGuard, EmployeeGuard, BakeryEmployeeGuard] },
      { path: 'collected-payment', loadChildren: './collected-payment/collected-payment.module#CollectedPaymentModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'company', loadChildren: './company/company.module#CompanyModule', canActivate: [AdminGuard, EmployeeGuard, BakeryEmployeeGuard] },
      { path: 'order-create', loadChildren: './create-order/create-order.module#CreateOrderModule', canActivate: [SuperAdminGuard] },
      { path: 'customer', loadChildren: './customers/customers.module#CustomersModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'customer-order/:id', loadChildren: './customers-order/customers-order.module#CustomersOrderModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [EmployeeGuard, SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'driver-order/:id', loadChildren: './driver-order/driver-order.module#DriverOrderModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'driver', loadChildren: './drivers/drivers.module#DriversModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'employee-settings', loadChildren: './employee-settings/employee-settings.module#EmployeeSettingsModule', canActivate: [SuperAdminGuard] },
      { path: 'employee', loadChildren: './employees/employees.module#EmployeesModule', canActivate: [EmployeeGuard, SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'order', loadChildren: './order/order.module#OrderModule', canActivate: [SuperAdminGuard] },
      { path: 'bakery-order', loadChildren: './bakery/bakery-orders/bakery-orders.module#BakeryOrdersModule', canActivate: [SuperAdminGuard] },
      { path: 'order-detail/:id', loadChildren: './order-detail/order-detail.module#OrderDetailModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'stock-detail/:id', loadChildren: './stock-detail/stock-detail.module#StockDetailModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'stock', loadChildren: './stocks/stocks.module#StocksModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'database-backup', loadChildren: './database-backup/database-backup.module#DatabaseBackupsModule', canActivate: [EmployeeGuard, BakeryEmployeeGuard] },
      { path: 'customer-debt', loadChildren: './debts/debts.module#DebtsModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'note-reminder', loadChildren: './note-reminder/note-reminder.module#NoteRemindersModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'store-payment', loadChildren: './store-payments/store-payments.module#StorePaymentsModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'create-bakery-order', loadChildren: './bakery/create-bakery-order/create-bakery-order.module#CreateBakeryOrderModule', canActivate: [SuperAdminGuard] },
      { path: 'bakery-order-detail/:id', loadChildren: './bakery/bakery-order-detail/bakery-order-detail.module#BakeryOrderDetailModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'bakery-stock', loadChildren: './bakery/bakery-stock/bakery-stock.module#BakeryStockModule', canActivate: [SuperAdminGuard, BakeryEmployeeGuard] },
      { path: 'category', loadChildren: './category/category.module#CategoryModule', canActivate: [SuperAdminGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
