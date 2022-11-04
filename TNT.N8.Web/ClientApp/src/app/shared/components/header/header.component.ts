import { Component, OnInit, ViewChild, ElementRef, Renderer2, EventEmitter, Output, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ChangepasswordComponent } from '../../../shared/components/changepassword/changepassword.component';
import { UserprofileComponent } from "../../../userprofile/userprofile.component"
import { PopupComponent } from "../popup/popup.component";
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from "ngx-loading";
import { CompanyConfigModel } from '../../../shared/models/companyConfig.model';
import { BreadCrumMenuModel } from '../../../shared/models/breadCrumMenu.model';
import { interval } from 'rxjs';

import { EventEmitterService } from '../../../shared/services/event-emitter.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { NotificationService } from '../../services/notification.service';
import { GetPermission } from '../../permission/get-permission';
import { TranslateService } from '@ngx-translate/core';
import { MenuComponent } from '../menu/menu.component';
import { Location } from '@angular/common';
import { MenuModule } from '../../../admin/models/menu-module.model';
import { MenuSubModule } from '../../../admin/models/menu-sub-module.model';
import { MenuPage } from '../../../admin/models/menu-page.model';
import { ListOrderSearch } from '../../models/re-search/list-order-search.model';
import { ReSearchService } from '../../../services/re-search.service';

@Component({
  selector: 'main-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})

export class HeaderComponent implements OnInit {
  @Output() updateLeftMenu = new EventEmitter<boolean>();
  @Output() updateLeftMenuHome = new EventEmitter<boolean>();

  username: string;
  userAvatar: string;
  userFullName: string;
  userEmail: string;
  dialogRef: MatDialogRef<ChangepasswordComponent>;
  dialogPopup: MatDialogRef<UserprofileComponent>;
  mouse_is_inside: boolean = false;
  notificationNumber: number = 0;
  NotificationContent: string;
  auth: any = JSON.parse(localStorage.getItem("auth"));
  notificationList: Array<any> = [];
  @ViewChild(MenuComponent) child;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loadingConfig: any = {
    'animationType': ngxLoadingAnimationTypes.circle,
    'backdropBackgroundColour': 'rgba(0,0,0,0.1)',
    'backdropBorderRadius': '4px',
    'primaryColour': '#ffffff',
    'secondaryColour': '#999999',
    'tertiaryColour': '#ffffff'
  }
  loading: boolean = false;

  /**/
  listPermissionResource: Array<string> = localStorage.getItem('ListPermissionResource').split(',');
  listPermissionResourceActive: string = localStorage.getItem("ListPermissionResource");
  listModule: Array<string> = [];
  listResource: Array<string> = [];

  /*Module name*/
  moduleCrm = 'crm'; //Module Quản trị quan hệ khách hàng
  moduleSal = 'sal'; //Module Quản lý bán hàng
  moduleBuy = 'buy'; //Module Quản lý mua hàng
  moduleAcc = 'acc'; //Module Quản lý tài chính
  moduleHrm = 'hrm'; //Module Quản trị nhân sự
  moduleSys = 'sys'; //Module Quản trị hệ thống
  moduleWar = 'war'; //Module Quản lý kho
  modulePro = 'pro'; //Module Quản lý dự án
  moduleAss = 'ass'; //Module Quản lý Tài sản
  moduleRec = 'rec'; //Module Quản lý Tuyển dụng
  moduleSar = 'salary'; //Module Quản lý Lương
  /*End*/

  /*Resource name*/

  //Quản lý hệ thống
  systemConfig = 'admin/company-config';
  systemParameter = 'admin/system-parameter';
  organization = 'admin/organization';
  masterdata = 'admin/masterdata';
  permission = 'admin/permission';
  configLeveCustomer = 'admin/config-level-customer';
  workflow = 'admin/workflow/workflow-list';

  /*End*/

  isCustomer = false;
  isSales = false;
  isShopping = false;
  isAccounting = false;
  isHrm = false;
  isAdmin2 = false;
  isWarehouse = false;
  isProject = false;
  isAsset = false;
  isRecruitment = false;
  isManufacture = false;
  isSalary = false;
  companyConfigModel = new CompanyConfigModel();
  userAdmin = false;
  permissionAdmin = false;

  moduled: string;
  titleModuled: string = 'MENU';
  lstBreadCrum: Array<BreadCrumMenuModel> = [];
  lstBreadCrumLeftMenu: Array<BreadCrumMenuModel> = [];

  lstSubmenuLevel1: Array<BreadCrumMenuModel> = [
    //Module CRM
    // {
    //   Name: "Quản trị khách hàng", Path: "", ObjectType: "crm", LevelMenu: 1, Active: false, nameIcon: "fa-street-view", IsDefault: false, CodeParent: "Lead_QLKHTN_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Cơ hội", Path: "", ObjectType: "lead", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "crm_ch", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/lead/dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo mới", Path: "/lead/create-lead", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm", Path: "/lead/list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: 'Lead_TK' },
    //         { Name: "Báo cáo", Path: "/lead/report-lead", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' }
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Hồ sơ thầu", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "crm_hst", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/sale-bidding/dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo mới", Path: "#", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm", Path: "/sale-bidding/list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: 'CustomerHST_TK' },
    //         { Name: "Phê duyệt", Path: "/sale-bidding/approved", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: 'CustomerHST_PD' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Báo giá", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "crm_bg", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/customer/quote-dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo mới", Path: "/customer/quote-create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm", Path: "/customer/quote-list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: 'Quote_TK' },
    //         { Name: "Phê duyệt", Path: "/customer/quote-approval", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Tiềm năng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-user", IsDefault: false, CodeParent: "crm_khtn", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/customer/potential-customer-dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo mới", Path: "/customer/potential-customer-create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm", Path: "/customer/potential-customer-list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: 'Customer_TK' },
    //         { Name: "Phê duyệt", Path: "/customer/request-approval", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: 'Customer_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Khách hàng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-user", IsDefault: false, CodeParent: "crm_kh", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/customer/dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo mới", Path: "/customer/create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm", Path: "/customer/list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: 'Customer_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Chăm sóc khách hàng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-gift", IsDefault: false, CodeParent: "crm_cskh", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/customer/care-dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo chương trình chăm sóc", Path: "/customer/care-create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Theo dõi chăm sóc khách hàng", Path: "/customer/care-list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-headphones", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo CT khuyến mại", Path: "/promotion/create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "customer_CSKH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh sách CT khuyến mại", Path: "/promotion/list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "customer_CSKH", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Báo cáo", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "customer_BaoCao", Display: "none",
    //       LstChildren: [
    //         { Name: "Báo cáo thống kê chương trình CSKH", Path: "#", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "customer_BaoCao", LstChildren: [], Display: "none", Code: 'CustomerBC_TK' },
    //         { Name: "Báo cáo thống kê phản hồi khách hàng", Path: "#", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "customer_BaoCao", LstChildren: [], Display: "none", Code: 'CustomerBC_TK' },
    //         { Name: "Báo cáo doanh số thống kê khách hàng", Path: "#", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "customer_BaoCao", LstChildren: [], Display: "none", Code: 'CustomerBC_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Quản lý liên hệ", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "crm_lh", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh sách liên hệ", Path: "/customer/list-contact-customer", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "crm_lh", LstChildren: [], Display: "none", Code: 'Customer_LH' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    //Module Bán hàng
    // {
    //   Name: "Quản lý bán hàng", Path: "", ObjectType: "sal", LevelMenu: 1, Active: false, nameIcon: "fa-university", IsDefault: false, CodeParent: "sal", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Danh mục", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "sal_dm", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh mục giá bán", Path: "/product/price-list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-folder-open", IsDefault: false, CodeParent: "sal_dm", LstChildren: [], Display: "none", Code: 'customer_CSKH_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Sản phẩm dịch vụ", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "sal_spdv", Display: "none",
    //       LstChildren: [
    //         { Name: "Quản lý danh mục", Path: "/admin/list-product-category", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-outdent", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: 'customer_CSKH_TK' },
    //         { Name: "Tạo mới", Path: "/product/create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm", Path: "/product/list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: 'Sale_Product_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Hợp đồng bán", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-contract", IsDefault: false, CodeParent: "sal_hdb", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/sales/contract-dashboard", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo hợp đồng bán", Path: "/sales/contract-create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm hợp đồng bán", Path: "/sales/contract-list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: 'sal_hdB_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Đơn hàng", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "sal_dh", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/sales/dashboard", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo đơn hàng", Path: "/order/create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm đơn hàng", Path: "/order/list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: 'Sale_Order_TK' },
    //         { Name: "Tạo đơn hàng dịch vụ", Path: "/order/order-service-create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Thanh toán đơn hàng", Path: "/order/pay-order-service", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-credit-card", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Hóa đơn", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-o", IsDefault: false, CodeParent: "sal_hd", Display: "none",
    //       LstChildren: [
    //         { Name: "Tạo hóa đơn", Path: "/bill-sale/create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm hóa đơn", Path: "/bill-sale/list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Báo cáo", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "sal_bc", Display: "none",
    //       LstChildren: [
    //         { Name: "Báo cáo doanh số theo nhân viên", Path: "/sales/top-revenue", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Báo cáo lợi nhuận theo sản phẩm", Path: "/sales/product-revenue", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Báo cáo lợi nhuận theo khách hàng", Path: "/order/list-profit-according-customers", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    // Module Mua hàng
    // {
    //   Name: "Quản lý mua hàng", Path: "", ObjectType: "buy", LevelMenu: 1, Active: false, nameIcon: "fa-shopping-cart", IsDefault: false, CodeParent: "Shopping_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Bảng giá nhà cung cấp", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "buy_bgncc", Display: "none",
    //       LstChildren: [
    //         { Name: "Tìm kiếm", Path: "/vendor/list-vendor-price", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: true, CodeParent: "Shopping_DMBGNCC", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Nhà cung cấp", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "buy_ncc", Display: "none",
    //       LstChildren: [
    //         { Name: "Tạo mới nhà cung cấp", Path: "/vendor/create", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Shopping_QLNCC", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm nhà cung cấp", Path: "/vendor/list", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "Shopping_QLNCC", LstChildren: [], Display: "none", Code: 'Shop_Vendor_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Đề xuất mua hàng", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "buy_dxmh", Display: "none",
    //       LstChildren: [
    //         { Name: "Tạo đề xuất mua hàng", Path: "/procurement-request/create", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Shopping_QLDXMH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm đề xuất mua hàng", Path: "/procurement-request/list", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "Shopping_QLDXMH", LstChildren: [], Display: "none", Code: 'Shop_procurement-request_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Giấy đề nghị báo giá NCC", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "buy_dnbg", Display: "none",
    //       LstChildren: [
    //         { Name: "Tạo đề nghị báo giá NCC", Path: "/vendor/vendor-quote-create", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Shopping_BGNCC", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh sách giấy đề nghị báo giá NCC", Path: "/vendor/list-vendor-quote", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "Shopping_BGNCC", LstChildren: [], Display: "none", Code: 'Shop_vendor_quote_request_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Đơn hàng mua", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "buy_dhm", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/vendor/dashboard", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: false, CodeParent: "Shopping_QLMH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tạo đơn hàng mua", Path: "/vendor/create-order", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Shopping_QLMH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm đơn hàng mua", Path: "/vendor/list-order", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "Shopping_QLMH", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Báo cáo", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "buy_bc", Display: "none",
    //       LstChildren: [
    //         { Name: "Báo cáo tình trạng đề xuất mua hàng", Path: "/procurement-request/list-report", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "Shopping_BC", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Báo cáo tình trạng đơn hàng mua", Path: "/vendor/vendor-order-report", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "Shopping_BC", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    // Module Quản lý kho
    // {
    //   Name: "Quản lý kho", Path: "", ObjectType: "war", LevelMenu: 1, Active: false, nameIcon: "fa-cubes", IsDefault: false, CodeParent: "Warehouse_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Danh sách kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "war_kho", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh sách kho", Path: "/warehouse/list", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "WH_QLK", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Nhập kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "war_nk", Display: "none",
    //       LstChildren: [
    //         { Name: "Tạo mới phiếu nhập kho", Path: "/warehouse/inventory-receiving-voucher/create", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "WH_QLNK", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm phiếu nhập kho", Path: "/warehouse/inventory-receiving-voucher/list", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "WH_QLNK", LstChildren: [], Display: "none", Code: 'WH_QLNTK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Xuất kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "war_xk", Display: "none",
    //       LstChildren: [
    //         { Name: "Tạo mới phiếu xuất kho", Path: "/warehouse/inventory-delivery-voucher/create-update", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "WH_QLXK", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm phiếu xuất kho", Path: "/warehouse/inventory-delivery-voucher/list", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "WH_QLXK", LstChildren: [], Display: "none", Code: 'WH_QLNXK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Hàng tồn kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "war_htk", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh sách hàng tồn kho", Path: "/warehouse/in-stock-report/list", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "WH_QLHTK", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    // Module Kế toán - tài chính
    // {
    //   Name: "Kế toán - Tài chính", Path: "", ObjectType: "acc", LevelMenu: 1, Active: false, nameIcon: "fa-money", IsDefault: false, CodeParent: "Accounting_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Danh mục phí", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "acc_dmp", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh sách", Path: "/accounting/cost-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-folder-open", IsDefault: false, CodeParent: "Accounting_DM", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Tiền mặt", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "acc_tm", Display: "none",
    //       LstChildren: [
    //         { Name: "Tạo phiếu thu", Path: "/accounting/cash-receipts-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh sách phiếu thu", Path: "/accounting/cash-receipts-list", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: 'Accounting_cash-receipts_TK' },
    //         { Name: "Tạo phiếu chi", Path: "/accounting/cash-payments-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh sách phiếu chi", Path: "/accounting/cash-payments-list", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: 'Accounting_cash-payment_TK' },
    //         { Name: "Sổ quỹ tiền mặt", Path: "/accounting/cash-book", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Ngân hàng", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "acc_nh", Display: "none",
    //       LstChildren: [
    //         { Name: "Tạo báo có", Path: "/accounting/bank-receipts-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh sách báo có", Path: "/accounting/bank-receipts-list", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: 'accounting_bank-receipts_TK' },
    //         { Name: "Tạo UNC", Path: "/accounting/bank-payments-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh sách UNC", Path: "/accounting/bank-payments-list", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: 'Accounting_bank-payments-TK' },
    //         { Name: "Sổ quỹ ngân hàng", Path: "/accounting/bank-book", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Công nợ", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "acc_cn", Display: "none",
    //       LstChildren: [
    //         { Name: "Nhà cung cấp", Path: "/accounting/receivable-vendor-report", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: true, CodeParent: "Accounting_CN", LstChildren: [], Display: "none", Code: 'Accounting_Vendor_Report' },
    //         { Name: "Khách hàng", Path: "/accounting/receivable-customer-report", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: false, CodeParent: "Accounting_CN", LstChildren: [], Display: "none", Code: 'Accounting_Customer_Report' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Báo cáo kết quả kinh doanh", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "acc_kqkd", Display: "none",
    //       LstChildren: [
    //         { Name: "Báo cáo kết quả kinh doanh", Path: "/accounting/sales-report", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "Accounting_BCKQKD", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    //Module quản lý sản xuất
    // {
    //   Name: "Quản lý sản xuất", Path: "", ObjectType: "man", LevelMenu: 1, Active: false, nameIcon: "fa fa-cogs", IsDefault: false, CodeParent: "Manufacturing_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Quản lý quy trình", Path: "", ObjectType: "man", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, Display: "none", CodeParent: "MAN_QLQT",
    //       LstChildren: [
    //         { Name: "Tạo mới quy trình", Path: "/manufacture/product-order-workflow/create", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm quy trình", Path: "/manufacture/product-order-workflow/list", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: 'MAN_QLQT_TK' },
    //         { Name: "Tìm kiếm tiến trình", Path: "/manufacture/technique-request/list", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: 'MAN_QLTT_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Quản lý lệnh tổng", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, Display: "none", CodeParent: "MAN_QLLT",
    //       LstChildren: [
    //         { Name: "Tạo mới lệnh tổng", Path: "/manufacture/total-production-order/create", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm lệnh tổng", Path: "/manufacture/total-production-order/list", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: 'MAN_QLLT_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Quản lý lệnh sản xuất", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-terminal", IsDefault: false, Display: "none", CodeParent: "MAN_QLLSX",
    //       LstChildren: [
    //         { Name: "Theo dõi sản xuất", Path: "/manufacture/track-production/track", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_TDSX", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Theo dõi sản xuất", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, Display: "none", CodeParent: "MAN_TDSX",
    //       LstChildren: [
    //         { Name: "Tìm kiếm lệnh sản xuất", Path: "/manufacture/production-order/list", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLLSX", LstChildren: [], Display: "none", Code: 'MAN_QLLSX_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Báo cáo QC", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, Display: "none", CodeParent: "MAN_RP_QC",
    //       LstChildren: [
    //         { Name: "Báo cáo theo QC", Path: "/manufacture/report/quanlity-control", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_RP_QC", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Báo cáo sản xuất", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, Display: "none", CodeParent: "MAN_RP_SX",
    //       LstChildren: [
    //         { Name: "Báo cáo sản xuất", Path: "/manufacture/report/manufacture", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_RP_SX", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    // Module Quản lý nhân sự
    {
      Name: "Quản lý nhân sự", Path: "", ObjectType: "hrm", LevelMenu: 1, Active: false, nameIcon: "fa-users", IsDefault: false, CodeParent: "Employee_Module", Display: "none",
      LstChildren: [
        {
          Name: "Quản lý nhân viên", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-user-circle", IsDefault: false, Display: "none", CodeParent: "hrm_nv",
          LstChildren: [
            // { Name: "Dashboard", Path: "/employee/dashboard", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo nhân viên", Path: "/employee/create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh sách nhân viên", Path: "/employee/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: 'HRM_EmployeeTK' },
            // { Name: "Đề xuất xin nghỉ", Path: "/employee/request/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
            { Name: "Danh sách nhân viên đã nghỉ việc", Path: "/employee/employee-quit-work", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: '' },
            { Name: "Đề xuất công tác", Path: "/employee/request/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
            { Name: "Cấu hình checklist", Path: "/employee/cauhinh-checklist", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
          ], Code: ''
        },
        {
          Name: "Quản lý bảo hiểm", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-futbol-o", IsDefault: false, Display: "none", CodeParent: "hrm_qlbh",
          LstChildren: [
            { Name: "Cấu hình", Path: "/employee/cauhinh-baohiem", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_qlbh", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        // {
        //   Name: "Tiền lương", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "hrm_tl", Display: "none",
        //   LstChildren: [
        //     { Name: "Bảng lương nhân viên", Path: "/employee/employee-salary/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "HRM_QLTL", LstChildren: [], Display: "none", Code: '' },
        //   ], Code: ''
        // },
        {
          Name: "Đề xuất tăng lương", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-cube", IsDefault: false, CodeParent: "hrm_dxtl", Display: "none",
          LstChildren: [
            { Name: "Danh sách đề xuất tăng lương", Path: "/employee/danh-sach-de-xuat-tang-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo mới đề xuất tăng lương", Path: "/employee/tao-de-xuat-tang-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Đề xuất chức vụ", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-briefcase", IsDefault: false, CodeParent: "hrm_dxvc", Display: "none",
          LstChildren: [
            { Name: "Danh sách đề xuất chức vụ", Path: "/employee/danh-sach-de-xuat-chuc-vu", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxvc", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo mới đề xuất chức vụ", Path: "/employee/tao-de-xuat-chuc-vu", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxvc", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Quản lý công tác", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-car", IsDefault: false, Display: "none", CodeParent: "hrm_qlct",
          LstChildren: [
            { Name: "Đề xuất công tác", Path: "/employee/danh-sach-de-xuat-cong-tac", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "HRM_QLCT", LstChildren: [], Display: "none", Code: 'HRM_HSCT' },
            { Name: "Hồ sơ công tác", Path: "/employee/danh-sach-ho-so-cong-tac", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "HRM_QLCT", LstChildren: [], Display: "none", Code: 'HRM_HSCT' },
            { Name: "Đề nghị tạm ứng", Path: "/employee/danh-sach-de-nghi-tam-ung", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "HRM_QLCT", LstChildren: [], Display: "none", Code: 'HRM_DNTU' },
            { Name: "Đề nghị hoàn ứng", Path: "/employee/danh-sach-de-nghi-hoan-ung", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "HRM_QLCT", LstChildren: [], Display: "none", Code: 'HRM_DNHU' },
          ], Code: ''
        },
        {
          Name: "Đề xuất kế hoạch OT", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "hrm_dxkhot", Display: "none",
          LstChildren: [
            { Name: "Danh sách kế hoạch OT", Path: "/employee/danh-sach-de-xuat-ot", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo đề xuất kế hoạch OT", Path: "/employee/kehoach-ot-create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Đề xuất xin nghỉ", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-asterisk", IsDefault: false, Display: "none", CodeParent: "hrm_dxxn",
          LstChildren: [
            { Name: "Danh sách đề xuất xin nghỉ", Path: "/employee/request/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo mới đề xuất xin nghỉ", Path: "/employee/request/create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Báo cáo nhân sự", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-area-chart", IsDefault: false, Display: "none", CodeParent: "hrm_bcns",
          LstChildren: [
            { Name: "Báo cáo nhân sự", Path: "/employee/bao-cao-nhan-su", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa-area-chart", IsDefault: true, CodeParent: "hrm_bcns", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },

      ], Code: ''
    },
    //Module Dự án
    // {
    //   Name: "Quản lý Dự án", Path: "", ObjectType: "pro", LevelMenu: 1, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "Project_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Dự án", Path: "", ObjectType: "pro_du_an", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "_pro", Display: "none", LstChildren: [
    //         { Name: "Tạo mới dự án", Path: "/project/create", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Tìm kiếm dự án", Path: "/project/list", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Báo cáo sử dụng nguồn lực", Path: "/project/bc-su-dung-nguon-luc", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Báo cáo tổng hợp các dự án", Path: "/project/bc-tong-hop-cac-du-an", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    //Module Tài sản
    {
      Name: "Quản lý Tài sản", Path: "", ObjectType: "ass", LevelMenu: 1, Active: false, nameIcon: "fa-cubes", IsDefault: false, CodeParent: "Asset_Module", Display: "none",
      LstChildren: [
        {
          Name: "Quản lý tài sản", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-cubes", IsDefault: false, CodeParent: "ass_ass", Display: "none",
          LstChildren: [
            { Name: "Tạo mới tài sản", Path: "/asset/create", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_qlass", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh sách tài sản", Path: "/asset/list", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa-database", IsDefault: true, CodeParent: "ass_qlass", LstChildren: [], Display: "none", Code: '' },
            { Name: "Phân bổ tài sản", Path: "/asset/phan-bo-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_qlass", LstChildren: [], Display: "none", Code: '' },
            { Name: "Thu hồi tài sản", Path: "/asset/thu-hoi-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_qlass", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Yêu cầu cấp phát", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-shopping-basket", IsDefault: false, CodeParent: "ass_request", Display: "none",
          LstChildren: [
            { Name: "Danh sách", Path: "/asset/danh-sach-yeu-cau-cap-phat", ObjectType: "ass", LevelMenu: 3, Active: true, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "ass_qlre", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo mới", Path: "/asset/yeu-cau-cap-phat-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_qlre", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Kiểm kê tài sản", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-check-square", IsDefault: false, CodeParent: "ass_KiemKe", Display: "none",
          LstChildren: [
            { Name: "Kiểm kê tài sản", Path: "/asset/danh-sach-dot-kiem-ke", ObjectType: "ass", LevelMenu: 3, Active: true, nameIcon: "fa-check-square", IsDefault: true, CodeParent: "ass_KiemKe", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        // {
        //   Name: "Báo cáo tài sản", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "ass_report", Display: "none",
        //   LstChildren: [
        //     { Name: "Báo cáo phân bổ", Path: "/asset/bao-cao-phan-bo", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_bcpb", LstChildren: [], Display: "none", Code: '' },
        //     { Name: "Báo cáo khấu hao", Path: "/asset/bao-cao-khau-hao", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_bckh", LstChildren: [], Display: "none", Code: '' },
        //   ], Code: ''
        // },
      ], Code: ''
    },
    // Module Quản lý Tuyển dụng
    {
      Name: "Quản lý tuyển dụng", Path: "", ObjectType: "rec", LevelMenu: 1, Active: false, nameIcon: "fa-address-book", IsDefault: false, CodeParent: "Recruitment_Module", Display: "none",
      LstChildren: [
        {
          Name: "Chiến dịch tuyển dụng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-search", IsDefault: false, CodeParent: "rec_cdtd", Display: "none", LstChildren: [
            { Name: "Dashboard", Path: "/employee/dashboard-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo mới", Path: "/employee/tao-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh sách", Path: "/employee/danh-sach-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Báo cáo", Path: "/employee/bao-cao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },

          ], Code: ''
        },
        {
          Name: "Vị trí tuyển dụng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-file-text", IsDefault: false, CodeParent: "rec_cvtd", Display: "none", LstChildren: [
            { Name: "Tạo mới", Path: "/employee/tao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh sách", Path: "/employee/danh-sach-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Ứng viên", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "rec_uv", Display: "none", LstChildren: [
            { Name: "Tạo mới", Path: "/employee/tao-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh sách", Path: "/employee/danh-sach-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
    // Module Quản lý lương
    {
      Name: "Quản lý lương", Path: "", ObjectType: "salary", LevelMenu: 1, Active: false, nameIcon: "fa-money", IsDefault: false, CodeParent: "Salary_Module", Display: "none",
      LstChildren: [
        {
          Name: "Cấu hình chung", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, Display: "none", CodeParent: "salary_chc",
          LstChildren: [
            { Name: "Cấu hình", Path: "/salary/cau-hinh-chung", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "salary_chc", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Chấm công", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: false, Display: "none", CodeParent: "salary_dmvs",
          LstChildren: [
            { Name: "Chấm công", Path: "/salary/tk-cham-cong", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: true, CodeParent: "salary_dmvs", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Kỳ lương", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-university", IsDefault: false, Display: "none", CodeParent: "salary_kl",
          LstChildren: [
            { Name: "Danh sách kỳ lương", Path: "/salary/ky-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "salary_kl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Phiếu lương", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, Display: "none", CodeParent: "salary_pl",
          LstChildren: [
            { Name: "Danh sách phiếu lương", Path: "/salary/phieu-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "salary_pl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Báo cáo chi phí", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-pie-chart", IsDefault: false, Display: "none", CodeParent: "salary_bccp",
          LstChildren: [
            { Name: "Báo cáo chi phí", Path: "/salary/bao-cao-chi-phi", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-pie-chart", IsDefault: true, CodeParent: "salary_bccp", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
  ];

  lstSubmenuLevel2: Array<BreadCrumMenuModel> = [
    //Quản trị quan hệ khách hàng
    // { Name: "Tiềm năng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-user", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Cơ hội", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Hồ sơ thầu", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo giá", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Khách hàng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-user", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Chăm sóc khách hàng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-gift", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Quản lý liên hệ", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "crm_lh", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Quản lý bán hàng
    // { Name: "Quản lý danh mục", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "sal_dm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Sản phẩm dịch vụ", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Hợp đồng bán", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-o", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Đơn hàng", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Hóa đơn", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-o", IsDefault: false, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Quản lý hệ thống
    { Name: "Cấu hình thông tin chung", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-cog", IsDefault: false, CodeParent: "Systems_CHTTC", LstChildren: [], Display: "none", Code: '' },
    { Name: "Cấu hình thư mục", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, CodeParent: "Systems_CHFOLDER", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý thông báo", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-bell", IsDefault: false, CodeParent: "Systems_QLTB", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tham số hệ thống", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-cogs", IsDefault: false, CodeParent: "Systems_TSHT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Quản lý mẫu Email", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-envelope", IsDefault: false, CodeParent: "Systems_QLE", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý sơ đồ tổ chức", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-sitemap", IsDefault: false, CodeParent: "Systems_QLSDTC", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý dữ liệu danh mục", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-newspaper-o", IsDefault: false, CodeParent: "Systems_QLDLDM", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý nhóm quyền", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-users", IsDefault: false, CodeParent: "Systems_QLNQ", LstChildren: [], Display: "none", Code: '' },
    { Name: "Phân hạng khách hàng", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-server", IsDefault: false, CodeParent: "Systems_QLPHKH", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý quy trình làm việc", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, CodeParent: "Systems_QLQTLV", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nhật ký hệ thống", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "Systems_LOG", LstChildren: [], Display: "none", Code: '' },
    { Name: "Kế hoạch", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "Systems_KHKD", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Quản lý mua hàng
    // { Name: "Bảng giá nhà cung cấp", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "buy_bgncc", Display: "none", LstChildren: [], Code: '' },
    // { Name: "Nhà cung cấp", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "buy_ncc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Đề xuất mua hàng", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "buy_dxmh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Đơn hàng mua", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "buy_dhm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Giấy đề nghị báo giá NCC", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: true, CodeParent: "buy_dnbg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "buy_bc", Display: "none", LstChildren: [], Code: '' },

    //Menu level 2 Quản lý tài chính
    // { Name: "Danh mục phí", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "acc_dmp", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tiền mặt", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Ngân hàng", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Công nợ", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "acc_cn", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo kết quả kinh doanh", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "acc_kqkd", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Quản lý Nhan su
    { Name: "Trang chủ", Path: "/", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-user-circle", IsDefault: false, CodeParent: "", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý nhân viên", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-user-circle", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý bảo hiểm", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-futbol-o", IsDefault: false, CodeParent: "hrm_qlbh", LstChildren: [], Display: "none", Code: '' },
    { Name: "Đề xuất tăng lương", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-cube", IsDefault: false, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Đề xuất chức vụ", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-briefcase", IsDefault: false, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý công tác", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-car", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "Đề xuất kế hoạch OT", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
    { Name: "Đề xuất xin nghỉ", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-asterisk", IsDefault: false, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý đánh giá", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-check-circle", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
    { Name: "Báo cáo nhân sự", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-area-chart", IsDefault: false, CodeParent: "hrm_bcns", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Quản lý kho
    // { Name: "Danh sách kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "war_kho", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nhập kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "war_nk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Xuất kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "war_xk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Hàng tồn kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "war_htk", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Quản sản xuất
    // { Name: "Quản lý quy trình", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Quản lý lệnh tổng", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Quản lý lệnh sản xuất", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-terminal", IsDefault: false, CodeParent: "MAN_QLLSX", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Theo dõi sản xuất", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, CodeParent: "MAN_TDSX", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo QC", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "MAN_RP_QC", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo sản xuất", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "MAN_RP_SX", LstChildren: [], Display: "none", Code: '' },

    // Menu level 2 Quản lý du an
    // { Name: "Dự án", Path: "", ObjectType: "pro_du_an", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '', },

    // Menu level 2 Quản lý tài sản
    { Name: "Danh sách tài sản", Path: "", ObjectType: "asset", LevelMenu: 2, Active: true, nameIcon: "fa-database", IsDefault: true, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '', },
    { Name: "Yêu cầu cấp phát", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-shopping-basket", IsDefault: false, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '', },
    { Name: "Báo cáo tài sản", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-compass", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '', },
    { Name: "Kiểm kê tài sản", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-check-square", IsDefault: false, CodeParent: "ass_KiemKe", LstChildren: [], Display: "none", Code: '', },

    //Menu level 2 Quản lý Tuyển dụng
    { Name: "Chiến dịch tuyển dụng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-search", IsDefault: false, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Vị trí tuyển dụng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-file-text", IsDefault: false, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Ứng viên", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },

    //Quản lý lương
    { Name: "Cấu hình chung", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, CodeParent: "salary_chc", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chấm công", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: false, CodeParent: "salary_dmvs", LstChildren: [], Display: "none", Code: '' },
    { Name: "Kỳ lương", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-university", IsDefault: false, CodeParent: "salary_kl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Phiếu lương", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "salary_pl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Báo cáo chi phí", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-pie-chart", IsDefault: false, CodeParent: "salary_bccp", LstChildren: [], Display: "none", Code: '' },
  ];

  lstSubmenuLevel3: Array<BreadCrumMenuModel> = [
    //Quản lý khách hàng tiềm năng(Potential Customer)
    // { Name: "Dashboard", Path: "/customer/potential-customer-dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo mới", Path: "/customer/potential-customer-create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm", Path: "/customer/potential-customer-list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: 'Customer_TK' },
    // { Name: "Phê duyệt", Path: "/customer/request-approval", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: 'Customer_TK' },

    //Quản lý cơ hội
    // { Name: "Dashboard", Path: "/lead/dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo mới", Path: "/lead/create-lead", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm", Path: "/lead/list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: 'Lead_TK' },
    // { Name: "Báo cáo", Path: "/lead/report-lead", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },

    // Quản lí hồ sơ thầu
    // { Name: "Dashboard", Path: "/sale-bidding/dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm", Path: "/sale-bidding/list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: 'SaleBidding_TK' },
    // { Name: "Phê duyệt", Path: "/sale-bidding/approved", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: 'SaleBidding_PD' },

    //Cơ hội báo giá(Quote)
    // { Name: "Dashboard", Path: "/customer/quote-dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo mới", Path: "/customer/quote-create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm", Path: "/customer/quote-list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: 'Quote_TK' },
    // { Name: "Phê duyệt", Path: "/customer/quote-approval", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },

    //Quản lý khách hàng(Customer)
    // { Name: "Dashboard", Path: "/customer/dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo mới", Path: "/customer/create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm", Path: "/customer/list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: 'Customer_TK' },

    //Chăm sóc khách hàng(CustomerCare)
    // { Name: "Dashboard", Path: "/customer/care-dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo chương trình chăm sóc", Path: "/customer/care-create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Theo dõi chăm sóc khách hàng", Path: "/customer/care-list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-headphones", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo CT khuyến mại", Path: "/promotion/create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh sách CT khuyến mại", Path: "/promotion/list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },

    //Quản lý liên hệ
    // { Name: "Danh sách liên hệ", Path: "/customer/list-contact-customer", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "crm_lh", LstChildren: [], Display: "none", Code: 'Customer_LH' },

    //Quản lý bán hàng(Sales)
    // { Name: "Danh mục giá bán", Path: "/product/price-list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-folder-open", IsDefault: true, CodeParent: "sal_dm", LstChildren: [], Display: "none", Code: 'customer_CTE_TK' },
    // { Name: "Quản lý danh mục", Path: "/admin/list-product-category", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-outdent", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: 'customer_CSKH_TK' },
    // { Name: "Tạo mới", Path: "/product/create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm", Path: "/product/list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: 'Sale_Product_TK' },
    // { Name: "Dashboard", Path: "/sales/contract-dashboard", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo hợp đồng bán", Path: "/sales/contract-create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm hợp đồng bán", Path: "/sales/contract-list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: 'sal_hdB_TK' },
    // { Name: "Dashboard", Path: "/sales/dashboard", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo đơn hàng", Path: "/order/create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm đơn hàng", Path: "/order/list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: 'Sale_Order_TK' },
    // { Name: "Tạo đơn hàng dịch vụ", Path: "/order/order-service-create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Thanh toán đơn hàng", Path: "/order/pay-order-service", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-credit-card", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo hóa đơn", Path: "/bill-sale/create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm hóa đơn", Path: "/bill-sale/list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo doanh số theo nhân viên", Path: "/sales/top-revenue", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo lợi nhuận theo sản phẩm", Path: "/sales/product-revenue", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo lợi nhuận theo khách hàng", Path: "/order/list-profit-according-customers", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },

    //Quản lý hệ thống
    { Name: "Cấu hình thông tin chung", Path: "/admin/company-config", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-cog", IsDefault: true, CodeParent: "Systems_CHTTC", LstChildren: [], Display: "none", Code: '' },
    { Name: "Cấu hình thư mục", Path: "/admin/folder-config", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-cog", IsDefault: true, CodeParent: "Systems_CHFOLDER", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý thông báo", Path: "/admin/notifi-setting-list", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-bell", IsDefault: true, CodeParent: "Systems_QLTB", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tham số hệ thống", Path: "/admin/system-parameter", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-cogs", IsDefault: true, CodeParent: "Systems_TSHT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Quản lý mẫu Email", Path: "/admin/email-configuration", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-envelope", IsDefault: true, CodeParent: "Systems_QLE", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý sơ đồ tổ chức", Path: "/admin/organization", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-sitemap", IsDefault: true, CodeParent: "Systems_QLSDTC", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý dữ liệu danh mục", Path: "/admin/masterdata", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-newspaper-o", IsDefault: true, CodeParent: "Systems_QLDLDM", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý nhóm quyền", Path: "/admin/permission", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-users", IsDefault: true, CodeParent: "Systems_QLNQ", LstChildren: [], Display: "none", Code: '' },
    { Name: "Phân hạng khách hàng", Path: "/admin/config-level-customer", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-server", IsDefault: true, CodeParent: "Systems_QLPHKH", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý quy trình làm việc", Path: "/admin/danh-sach-quy-trinh", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-exchange", IsDefault: true, CodeParent: "Systems_QLQTLV", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nhật ký hệ thống", Path: "/admin/audit-trace", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: true, CodeParent: "Systems_LOG", LstChildren: [], Display: "none", Code: '' },
    { Name: "Kế hoạch kinh doanh", Path: "/admin/business-goals", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: true, CodeParent: "Systems_KHKD", LstChildren: [], Display: "none", Code: '' },

    //Quản lý mua hàng(shopping)
    // { Name: "Tìm kiếm", Path: "/vendor/list-vendor-price", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: true, CodeParent: "buy_bgncc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo mới nhà cung cấp", Path: "/vendor/create", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "buy_ncc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm nhà cung cấp", Path: "/vendor/list", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "buy_ncc", LstChildren: [], Display: "none", Code: 'Shop_Vendor_TK' },
    // { Name: "Tạo đề xuất mua hàng", Path: "/procurement-request/create", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "buy_dxmh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm đề xuất mua hàng", Path: "/procurement-request/list", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "buy_dxmh", LstChildren: [], Display: "none", Code: 'Shop_procurement-request_TK' },
    // { Name: "Dashboard", Path: "/vendor/dashboard", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: false, CodeParent: "buy_dhm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo đơn hàng mua", Path: "/vendor/create-order", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "buy_dhm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm đơn hàng mua", Path: "/vendor/list-order", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "buy_dhm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo đề nghị báo giá NCC", Path: "/vendor/vendor-quote-create", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "buy_dnbg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh sách giấy đề nghị báo giá NCC", Path: "/vendor/list-vendor-quote", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "buy_dnbg", LstChildren: [], Display: "none", Code: 'Shop_procurement-request_TK' },
    // { Name: "Báo cáo tình trạng đề xuất mua hàng", Path: "/procurement-request/list-report", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "buy_bc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo tình trạng đơn hàng mua", Path: "/vendor/vendor-order-report", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "buy_bc", LstChildren: [], Display: "none", Code: '' },

    //Quản lý tài chính(Accounting)
    // { Name: "Danh sách", Path: "/accounting/cost-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-folder-open", IsDefault: true, CodeParent: "acc_dmp", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo phiếu thu", Path: "/accounting/cash-receipts-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh sách phiếu thu", Path: "/accounting/cash-receipts-list", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: 'Accounting_cash-receipts_TK' },
    // { Name: "Tạo phiếu chi", Path: "/accounting/cash-payments-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh sách phiếu chi", Path: "/accounting/cash-payments-list", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: 'Accounting_cash-payment_TK' },
    // { Name: "Sổ quỹ tiền mặt", Path: "/accounting/cash-book", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tạo báo có", Path: "/accounting/bank-receipts-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh sách báo có", Path: "/accounting/bank-receipts-list", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: 'accounting_bank-receipts_TK' },
    // { Name: "Tạo UNC", Path: "/accounting/bank-payments-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh sách UNC", Path: "/accounting/bank-payments-list", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: 'Accounting_bank-payments-TK' },
    // { Name: "Sổ quỹ ngân hàng", Path: "/accounting/bank-book", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nhà cung cấp", Path: "/accounting/receivable-vendor-report", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: true, CodeParent: "acc_cn", LstChildren: [], Display: "none", Code: 'Accounting_Vendor_Report' },
    // { Name: "Khách hàng", Path: "/accounting/receivable-customer-report", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: false, CodeParent: "acc_cn", LstChildren: [], Display: "none", Code: 'Accounting_Customer_Report' },
    // { Name: "Báo cáo kết quả kinh doanh", Path: "/accounting/sales-report", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "acc_kqkd", LstChildren: [], Display: "none", Code: '' },

    //Quản lý nhân sự
    // { Name: "Dashboard", Path: "/employee/dashboard", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tạo nhân viên", Path: "/employee/create", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách nhân viên", Path: "/employee/list", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: 'HRM_EmployeeTK' },
    // { Name: "Đề xuất xin nghỉ", Path: "/employee/request/list", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
    { Name: "Cấu hình", Path: "/employee/cauhinh-baohiem", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_qlbh", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách nhân viên đã nghỉ việc", Path: "/employee/employee-quit-work", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách đề xuất tăng lương", Path: "/employee/danh-sach-de-xuat-tang-luong", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tạo mới đề xuất tăng lương", Path: "/employee/tao-de-xuat-tang-luong", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách đề xuất chức vụ", Path: "/employee/danh-sach-de-xuat-chuc-vu", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tạo mới đề xuất chức vụ", Path: "/employee/tao-de-xuat-chuc-vu", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách đề xuất xin nghỉ", Path: "/employee/request/list", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tạo mới đề xuất xin nghỉ", Path: "/employee/request/create", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
    { Name: "Cấu hình checklist", Path: "/employee/cauhinh-checklist", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Đề xuất công tác", Path: "/employee/danh-sach-de-xuat-cong-tac", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "Hồ sơ công tác", Path: "/employee/danh-sach-ho-so-cong-tac", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "Đề nghị tạm ứng", Path: "/employee/danh-sach-de-nghi-tam-ung", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "Đề nghị hoàn ứng", Path: "/employee/danh-sach-de-nghi-hoan-ung", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách kế hoạch OT", Path: "/employee/danh-sach-de-xuat-ot", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tạo đề xuất kế hoạch OT", Path: "/employee/kehoach-ot-create", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
    { Name: "Cấu hình mức đánh giá", Path: "/employee/quy-luong", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
    { Name: "Cấu hình phiếu đánh giá", Path: "/employee/danh-sach-phieu-danh-gia", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
    { Name: "Kỳ đánh giá", Path: "/employee/danh-sach-ky-danh-gia", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
    { Name: "Báo cáo nhân sự", Path: "/employee/bao-cao-nhan-su", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa-area-chart", IsDefault: false, CodeParent: "hrm_bcns", LstChildren: [], Display: "none", Code: '' },

    //Quản lý tài sản
    { Name: "Tạo mới", Path: "/asset/create", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách", Path: "/asset/list", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tạo mới", Path: "/asset/yeu-cau-cap-phat-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách", Path: "/asset/danh-sach-yeu-cau-cap-phat", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '' },
    { Name: "Kiểm kê tài sản", Path: "/asset/danh-sach-dot-kiem-ke", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa-check-square", IsDefault: false, CodeParent: "ass_KiemKe", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo phân bổ", Path: "/asset/bao-cao-phan-bo", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo khấu hao", Path: "/asset/bao-cao-khau-hao", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '' },

    // Quản lý tuyển dụng
    { Name: "Dashboard", Path: "/employee/dashboard-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tạo mới", Path: "/employee/tao-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách", Path: "/employee/danh-sach-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Báo cáo", Path: "/employee/bao-cao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tạo mới", Path: "/employee/tao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách", Path: "/employee/danh-sach-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tạo mới", Path: "/employee/tao-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh sách", Path: "/employee/danh-sach-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },

    //Quản lý kho
    // { Name: "Tạo mới phiếu nhập kho", Path: "/warehouse/inventory-receiving-voucher/create", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "war_nk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm phiếu nhập kho", Path: "/warehouse/inventory-receiving-voucher/list", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "war_nk", LstChildren: [], Display: "none", Code: 'WH_QLNTK' },
    // { Name: "Tạo mới phiếu xuất kho", Path: "/warehouse/inventory-delivery-voucher/create-update", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "war_xk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm phiếu xuất kho", Path: "/warehouse/inventory-delivery-voucher/list", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "war_xk", LstChildren: [], Display: "none", Code: 'WH_QLNXK' },
    // { Name: "Danh sách hàng tồn kho", Path: "/warehouse/in-stock-report/list", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "war_htk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh sách kho", Path: "/warehouse/list", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "war_kho", LstChildren: [], Display: "none", Code: '' },

    //Dự án
    // { Name: "Tạo mới dự án", Path: "/project/create", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm dự án", Path: "/project/list", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo sử dụng nguồn lực", Path: "/project/bc-su-dung-nguon-luc", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo tổng hợp các dự án", Path: "/project/bc-tong-hop-cac-du-an", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },

    //Manufacture
    // { Name: "Tạo mới quy trình", Path: "/manufacture/product-order-workflow/create", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm quy trình", Path: "/manufacture/product-order-workflow/list", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: 'MAN_QLQT_TK' },
    // { Name: "Tìm kiếm tiến trình", Path: "/manufacture/technique-request/list", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: 'MAN_QLTT_TK' },
    // { Name: "Tạo mới lệnh tổng", Path: "/manufacture/total-production-order/create", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm lệnh tổng", Path: "/manufacture/total-production-order/list", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: 'MAN_QLLT_TK' },
    // { Name: "Theo dõi sản xuất", Path: "/manufacture/track-production/track", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_TDSX", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Tìm kiếm lệnh sản xuất", Path: "/manufacture/production-order/list", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_QLLSX", LstChildren: [], Display: "none", Code: 'MAN_QLLSX_TK' },
    // { Name: "Báo cáo theo QC", Path: "/manufacture/report/quanlity-control", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_RP_QC", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Báo cáo sản xuất", Path: "/manufacture/report/manufacture", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_RP_SX", LstChildren: [], Display: "none", Code: '' },

    //Quản lý Lương
    { Name: "Cấu hình", Path: "/salary/cau-hinh-chung", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "salary_chc", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chấm công", Path: "/salary/tk-cham-cong", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: false, CodeParent: "salary_dmvs", LstChildren: [], Display: "none", Code: '' },
    { Name: "Kỳ lương", Path: "/salary/ky-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-university", IsDefault: false, CodeParent: "salary_kl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Phiếu lương", Path: "/salary/phieu-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "salary_pl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Báo cáo chi phí", Path: "/salary/bao-cao-chi-phi", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-pie-chart", IsDefault: false, CodeParent: "salary_bccp", LstChildren: [], Display: "none", Code: '' },
  ];

  lstSubmenuDetailURL: Array<BreadCrumMenuModel> = [
    { Name: "Chi tiết hồ sơ thầu", Path: "/sale-bidding/detail", ObjectType: "cus", LevelMenu: 4, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "SaleBidding_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết cơ hội", Path: "/lead/detail", ObjectType: "cus", LevelMenu: 4, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "Lead_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết báo giá", Path: "/customer/quote-detail", ObjectType: "cus", LevelMenu: 4, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "Quote_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết khách hàng", Path: "/customer/detail", ObjectType: "cus", LevelMenu: 4, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "Customer_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết chăm sóc khách hàng", Path: "/customer/care-detail", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "customer_CSKH_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết sản phẩm dịch vụ", Path: "/product/detail", ObjectType: "sale", LevelMenu: 4, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "Sale_Product_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết hợp đồng", Path: "/sales/contract-detail", ObjectType: "sale", LevelMenu: 4, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "sal_hdB_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết đơn hàng", Path: "/order/order-detail", ObjectType: "sale", LevelMenu: 4, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "Sale_Order_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết đặt hàng", Path: "/vendor/detail-order", ObjectType: "shop", LevelMenu: 4, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "Shop_VendorOrder_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết nhân viên", Path: "/employee/detail", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "HRM_EmployeeTK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết xin nghỉ", Path: "/employee/request/detail", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "HRM_Request_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết phiếu thu", Path: "/accounting/cash-receipts-view", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "Accounting_cash-receipts_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết phiếu chi", Path: "/accounting/cash-payments-view", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "Accounting_cash-payment_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết báo có", Path: "/accounting/bank-receipts-detail", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "list", IsDefault: true, CodeParent: "accounting_bank-receipts_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết UNC", Path: "/accounting/bank-payments-detail", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "list", IsDefault: false, CodeParent: "Accounting_bank-payments-TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết phải trả nhà cung cấp", Path: "/accounting/receivable-vendor-detail", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "monetization_on", IsDefault: true, CodeParent: "Accounting_Vendor_Report", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết phải thu khách hàng", Path: "/accounting/receivable-customer-detail", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "monetization_on", IsDefault: false, CodeParent: "Accounting_Customer_Report", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết nhà cung cấp", Path: "/vendor/detail", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "Shop_Vendor_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết đề xuất mua hàng", Path: "/procurement-request/view", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "Shop_procurement-request_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết đề nghị báo giá NCC", Path: "/vendor/vendor-quote-detail", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "Shop_vendor_quote_request_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết phiếu nhập kho", Path: "/warehouse/inventory-receiving-voucher/details", ObjectType: "warehouse", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "WH_QLNTK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết phiếu xuất kho", Path: "/warehouse/inventory-delivery-voucher/details", ObjectType: "warehouse", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "WH_QLNXK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết quy trình", Path: "/manufacture/product-order-workflow/detail", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLQT_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết tiến trình", Path: "/manufacture/technique-request/detail", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLTT_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết lệnh tổng", Path: "/manufacture/total-production-order/detail", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLLT_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi tiết lệnh sản xuất", Path: "/manufacture/production-order/detail", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLLSX_TK", LstChildren: [], Display: "none", Code: '' },
  ];

  currentURl: string = '';
  isClickMiniLogo: false;
  isToggle: Boolean = false;
  @ViewChild('menuLevel2') menuLevel2: ElementRef;
  @ViewChild('contentBreadCrub', { static: true }) contentBreadCrub: ElementRef;

  listMenuModule: Array<MenuModule> = [];

  listMenuSubModule: Array<MenuSubModule> = [];

  listMenuPage: Array<MenuPage> = [];

  /*Menu Bar*/
  listMenuBar: Array<MenuSubModule> = [];
  /*End*/

  constructor(private translate: TranslateService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private getPermission: GetPermission,
    private authenticationService: AuthenticationService,
    private notiService: NotificationService,
    private eventEmitterService: EventEmitterService,
    private renderer: Renderer2,
    private _eref: ElementRef,
    public location: Location,
    public reSearchService: ReSearchService
  ) {
    translate.setDefaultLang('vi');
    this.listMenuModule = JSON.parse(localStorage.getItem('ListMenuModule'));
    this.listMenuSubModule = JSON.parse(localStorage.getItem('ListMenuSubModule'));
    this.listMenuPage = JSON.parse(localStorage.getItem('ListMenuPage'));

    this.router.events.subscribe(event => {
      let url = this.location.path();

      this.buildMenuBar(url);
    });
  }

  ngOnInit() {
    this.username = localStorage.getItem("Username");
    // this.userAvatar = localStorage.getItem("UserAvatar");
    this.userAvatar = '';
    this.userFullName = localStorage.getItem("UserFullName");
    this.userEmail = localStorage.getItem("UserEmail");
    this.getNotification();
    this.getListModuleAndResource();

    localStorage.setItem('menuIndexTree', this.router.url);

    if (localStorage.getItem('IsAdmin') == 'true') {
      this.moduled = 'admin';
      localStorage.setItem('menuIndex', 'admin');
    }

    var listdata = [this.systemConfig, this.systemParameter, this.organization, this.masterdata, this.permission, this.configLeveCustomer, this.workflow];
    if (this.checkUserResourceModule(listdata)) {
      this.moduled = 'admin-con';
      localStorage.setItem('menuIndex', 'admin-con');
    }

    $("body").mouseup((e) => {
      //Đóng menu Level 1 khi di ra ngoài
      var logo = $("#logo");
      var module_content = $("#module-content");
      if (!logo.is(e.target) && !module_content.is(e.target)) {
        this.module_display_value = 'none';
        this.updateLeftMenu.emit(false);
      }

      //Đóng menu Level 2 khi di ra ngoài cùng
      var containerMenuLevel2 = $("#menu-level2");
      var breadcrumbX = $("#breadcrumbX");
      if (!containerMenuLevel2.is(e.target) && !breadcrumbX.is(e.target)) {
        this.setDefaultViewMenu();
      }
    });

    //this.createBreadCrum();

    //kiem tra xem co toggle ko
    if ($("body").hasClass("sidebar-collapse")) {
      this.isToggle = true;
    }
    else {
      this.isToggle = false;
    }

    // if (this.eventEmitterService.subsVar == undefined) {
    //   this.eventEmitterService.subsVar = this.eventEmitterService.
    //     invokeUpdateMathPathFunction.subscribe((name: string) => {
    //       var X = localStorage.getItem('menuMapPath');
    //       this.lstBreadCrum = JSON.parse(X);
    //     });
    // }

    //const secondsCounter = interval(1000);
    //secondsCounter.subscribe(n => this.createBreadCrum());

    this.createBreadCrum()
    this.translate.get('module_system.title.salary').subscribe(value => { /*console.log(value)*/ });
  }

  isHomepage() {
    if (this.router.url === '/home') {
      return true;
    } else {
      return false;
    }
  }

  goToEmployee() {
    this.router.navigate(['/employee/list']);
  }

  goToLead() {
    this.router.navigate(['/lead/list']);
  }

  goToSaleBidding() {
    this.router.navigate(['/sale-bidding/list']);
  }

  module_display: boolean = false;
  module_display_value: string = 'none';
  module_display_menu_level2_value: string = 'none';

  openModule() {
    this.setDefaultViewMenu();
    this.module_display = !this.module_display;
    if (this.module_display) {
      this.module_display_value = 'block';
    } else {
      this.module_display_value = 'none';
      this.updateLeftMenu.emit(false);
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  // Mở giao diện đổi Password
  openChangePassword() {
    let account = this.username;
    let _name = this.userFullName;
    let _email = this.userEmail;
    let _avatar = this.userAvatar;
    this.dialogRef = this.dialog.open(ChangepasswordComponent,
      {
        data: { accountName: account, name: _name, email: _email, avatar: _avatar }
      });
    this.dialogRef.afterClosed().subscribe(result => {
    });
    $("#user-content").toggle();

  }
  //Ket thuc

  // Mo giao dien UserProfile
  goToViewProfile() {
    this.router.navigate(['/userprofile']);
  }

  getNotification() {
    this.notiService.getNotification(this.auth.EmployeeId, this.auth.UserId).subscribe(response => {
      var result = <any>response;
      this.notificationNumber = result.numberOfUncheckedNoti;
      this.notificationList = result.shortNotificationList;
    }, error => { })
  }

  goToNotification() {
    this.router.navigate(['/notification']);
  }

  goToNotiUrl(item: any, notificationId: string, id: string, code: string) {
    this.notiService.removeNotification(notificationId, this.auth.UserId).subscribe(response => {
      this.loading = true;
      if (code == "PRO_REQ") {
        this.router.navigate(['/procurement-request/view', { id: id }]);
      }
      if (code == "PAY_REQ") {
        this.router.navigate(['/accounting/payment-request-detail', { requestId: id }]);
      }
      if (code == "EMP_REQ") {
        this.router.navigate(['/employee/request/detail', { requestId: id }]);
      }
      if (code == "EMP_SLR") {
        this.NotificationContent = item.content;
        let month = this.NotificationContent.split(" ")[this.NotificationContent.split(" ").indexOf("tháng") + 1];
        this.router.navigate(['employee/employee-salary/list', { MonthSalaryRequestParam: month }]);
      }
      if (code == "TEA_SLR") {
        this.router.navigate(['/employee/teacher-salary/list']);
      }
      if (code == "AST_SLR") {
        this.router.navigate(['/employee/assistant-salary/list']);
      }
      this.loading = false;
    }, error => {
    });
  }

  //Lấy ra list module và list resource của user
  getListModuleAndResource() {
    if (this.listPermissionResource.length > 0) {
      this.listPermissionResource.forEach(item => {
        let moduleName = item.slice(0, item.indexOf('/'));
        if (this.listModule.indexOf(moduleName) == -1) {
          this.listModule.push(moduleName);
        }

        let resourceName = item.slice(item.indexOf('/') + 1, item.lastIndexOf('/'));
        if (this.listResource.indexOf(resourceName) == -1) {
          this.listResource.push(resourceName);
        }
      });
    }
  }

  //Kiểm tra user được quyền thấy các module nào trên trang home:
  checkModule(moduleName) {
    let result = false;
    if (this.listModule.indexOf(moduleName) !== -1) {
      result = true;
    }
    return result;
  }

  showSubMenu(module) {
    this.updateLeftMenu.emit(true);

    var Title = "";
    this.setDefaultViewMenu();
    this.lstBreadCrum = [];
    this.setModuleToFalse();

    let oldParam: string = '';

    switch (module) {
      // case 'admin':
      //   this.isAdmin2 = true;
      //   this.translate.get('module_system.title.sys').subscribe(value => { this.titleModuled = value; });
      //   Title = "Quản lý hệ thống";
      //   break;
      case 'crm':
        this.isCustomer = true;
        this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
        Title = "Quản trị khách hàng";
        oldParam = 'customer';
        break;
      case 'sal':
        this.isSales = true;
        this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
        Title = "Quản lý bán hàng";
        oldParam = 'sales';
        break;
      case 'buy':
        this.isShopping = true;
        this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
        Title = "Quản lý mua hàng";
        oldParam = 'shopping';
        break;
      case 'acc':
        this.isAccounting = true;
        this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
        Title = "Quản lý tài chính";
        oldParam = 'accounting';
        break;
      case 'hrm':
        this.isHrm = true;
        this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
        Title = "Quản lý nhân sự";
        oldParam = 'employee';
        break;
      case 'war':
        this.isWarehouse = true;
        this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
        Title = "Quản lý kho";
        oldParam = 'warehouse';
        break;
      case 'man':
        this.isManufacture = true;
        this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
        Title = "Quản lý sản xuất";
        oldParam = 'manufacture';
        break;
      case 'pro':
        this.isProject = true;
        this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
        Title = "Quản trị dự án";
        oldParam = 'pro_du_an';
        break;
      case 'rec':
        this.isRecruitment = true;
        this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
        Title = "Quản trị tuyển dụng";
        oldParam = 'recruitment';
        break;
      case 'ass':
        this.isAsset = true;
        this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
        Title = "Quản lý tài sản";
        oldParam = 'asset';
        break;
      case 'salary':
        this.isSalary = true;
        this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
        Title = "Quản lý lương";
        oldParam = 'salary';
        break;
      default:
        break;
    }
    module = oldParam;
    var breadCrumMenuitem = new BreadCrumMenuModel();
    breadCrumMenuitem.Name = Title;
    breadCrumMenuitem.LevelMenu = 1;
    breadCrumMenuitem.ObjectType = module;
    breadCrumMenuitem.Path = "";
    breadCrumMenuitem.Active = true;
    breadCrumMenuitem.LstChildren = [];
    this.lstBreadCrum.push(breadCrumMenuitem);

    //---------------Đóng Menu Level 1-----------
    this.module_display = !this.module_display;
    if (this.module_display) {
      this.module_display_value = 'block';
    } else {
      this.module_display_value = 'none';
    }
    localStorage.setItem('menuMapPath', JSON.stringify(this.lstBreadCrum));

    this.updateLeftMenuFromHead(module, this.lstSubmenuLevel3);

    this.updateLeftMenuHome.emit(true);
  }

  getMenuAllowAccess(lstBreadCrumX: Array<BreadCrumMenuModel>, listResource: Array<string>) {
    var ResultFilter = lstBreadCrumX.filter(function (item) {
      return listResource.indexOf(item.Path.substring(1)) !== -1;
    });
    return ResultFilter;
  }

  checkUserResource(resourceName) {
    let result = false;
    if (this.listResource.indexOf(resourceName) !== -1) {
      result = true;
    }
    return result;
  }

  checkUserResourceModule(resourceName: string[]) {
    let result = false;
    for (var i = 0; i < resourceName.length; i++) {
      if (this.listResource.indexOf(resourceName[i]) !== -1) {
        result = true;
        return result;
      }
    }
    return result;
  }

  setModuleToFalse() {
    this.isCustomer = false;
    this.isSales = false;
    this.isShopping = false;
    this.isAccounting = false;
    this.isHrm = false;
    this.isWarehouse = false;
    this.isManufacture = false;
    this.isProject = false;
    this.isRecruitment = false;
    this.isAsset = false;
    this.isSalary = false;
  }

  setDefaultViewMenu() {
    this.isCustomer = false;
    this.isSales = false;
    this.isShopping = false;
    this.isAccounting = false;
    this.isHrm = false;
    this.isAdmin2 = false;
    this.isWarehouse = false;
    this.isManufacture = false;
    this.isProject = false;
    this.isAsset = false;
    this.isRecruitment = false;
    this.isSalary = false;
  }

  openMenuLevel2(item) {
    //---------------Đóng Menu Level 1-----------
    this.module_display_value = 'none';

    switch (item.ObjectType) {
      case 'admin':
        if (this.isAdmin2 == true) {
          this.isAdmin2 = false;
        } else {
          this.isAdmin2 = true;
        }
        break;
      case 'customer':
        if (this.isCustomer == true) {
          this.isCustomer = false;
          item.Active = false;
        } else {
          this.isCustomer = true;
          item.Active = true;
        }

        break;
      case 'sales':
        if (this.isSales == true) {
          this.isSales = false;
        } else {
          this.isSales = true;
        }

        break;
      case 'shopping':
        if (this.isShopping == true) {
          this.isShopping = false;
        } else {
          this.isShopping = true;
        }

        break;
      case 'accounting':
        if (this.isAccounting == true) {
          this.isAccounting = false;
        } else {
          this.isAccounting = true;
        }

        break;
      case 'employee':
        if (this.isHrm == true) {
          this.isHrm = false;
        } else {
          this.isHrm = true;
        }
        break;
      case 'warehouse':
        if (this.isWarehouse == true) {
          this.isWarehouse = false;
        } else {
          this.isWarehouse = true;
        }
        break;
      case 'manufacture':
        if (this.isManufacture == true) {
          this.isManufacture = false;
        } else {
          this.isManufacture = true;
        }
        break;
      case 'pro_du_an':
        if (this.isProject == true) {
          this.isProject = false;
        } else {
          this.isProject = true;
        }

        break;
      case 'recruitment':
        if (this.isRecruitment == true) {
          this.isRecruitment = false;
        } else {
          this.isRecruitment = true;
        }

        break;
      case 'asset':
        if (this.isAsset == true) {
          this.isAsset = false;
        } else {
          this.isAsset = true;
        }
        break;
      case 'salary':
        if (this.isSalary == true) {
          this.isSalary = false;
        } else {
          this.isSalary = true;
        }
        break;
      default:
        break;
    }
  }

  openMenuLevel3(MenuCode, Title, module, IsOpenAlways) {
    if (!IsOpenAlways) {
      //kiem tra co menu level 2 chua
      let checkexistMenulevel2 = this.lstBreadCrum.findIndex(e => e.LevelMenu == 2);
      if (checkexistMenulevel2 < 0) {
        let FindtMenulevel1 = this.lstBreadCrum.find(e => e.LevelMenu == 1);
        FindtMenulevel1.Active = false;
        this.lstBreadCrum = [];
        this.lstBreadCrum.push(FindtMenulevel1);
        let submenulevel3 = this.lstSubmenuLevel3.filter(e => e.CodeParent == MenuCode);
        var breadCrumMenuitem = new BreadCrumMenuModel();
        breadCrumMenuitem.Name = Title;
        breadCrumMenuitem.LevelMenu = 2;
        breadCrumMenuitem.ObjectType = module;
        breadCrumMenuitem.Path = "";
        breadCrumMenuitem.Active = true;
        breadCrumMenuitem.LstChildren = [];
        var fillterResourceAllow = this.getMenuAllowAccess(submenulevel3, this.listResource);
        breadCrumMenuitem.LstChildren.push.apply(breadCrumMenuitem.LstChildren, fillterResourceAllow);
        this.lstBreadCrum.push(breadCrumMenuitem);
        ///Check Have Link Default ko
        let menuDefaultIndex = submenulevel3.findIndex(e => e.IsDefault == true)
        if (menuDefaultIndex >= 0) {
          this.openMenuLevel4(submenulevel3[menuDefaultIndex]);
        }
      }
      else {
        let FindtMenulevel1 = this.lstBreadCrum.find(e => e.LevelMenu == 1);
        FindtMenulevel1.Active = false;
        this.lstBreadCrum = [];
        this.lstBreadCrum.push(FindtMenulevel1);
        let submenulevel3 = this.lstSubmenuLevel3.filter(e => e.CodeParent == MenuCode);
        var breadCrumMenuitem = new BreadCrumMenuModel();
        breadCrumMenuitem.Name = Title;
        breadCrumMenuitem.LevelMenu = 2;
        breadCrumMenuitem.ObjectType = module;
        breadCrumMenuitem.Path = "";
        breadCrumMenuitem.Active = true;
        breadCrumMenuitem.LstChildren = [];
        var fillterResourceAllow = this.getMenuAllowAccess(submenulevel3, this.listResource);
        breadCrumMenuitem.LstChildren.push.apply(breadCrumMenuitem.LstChildren, fillterResourceAllow);
        this.lstBreadCrum.push(breadCrumMenuitem);
        ///Check Have Link Default ko
        let menuDefaultIndex = submenulevel3.findIndex(e => e.IsDefault == true)
        if (menuDefaultIndex >= 0) {
          this.openMenuLevel4(submenulevel3[menuDefaultIndex]);
        }
      }
    }
    else {
      let FindtMenulevel1 = this.lstBreadCrum.find(e => e.LevelMenu == 1);
      FindtMenulevel1.Active = false;
      this.lstBreadCrum = [];
      this.lstBreadCrum.push(FindtMenulevel1);
      let submenulevel3 = this.lstSubmenuLevel3.filter(e => e.CodeParent == MenuCode);
      ///Check Have Link Default ko
      let menuDefaultIndex = submenulevel3.findIndex(e => e.IsDefault == true)
      if (menuDefaultIndex >= 0) {
        this.openMenuLevel4(submenulevel3[menuDefaultIndex]);
      }
    }

    localStorage.setItem('menuMapPath', JSON.stringify(this.lstBreadCrum));
    this.setDefaultViewMenu();
  }

  openMenuLevel4(resource) {
    //kiem tra co menu level 3 chua
    let checkexistMenulevel3 = this.lstBreadCrum.findIndex(e => e.LevelMenu == 3);
    if (checkexistMenulevel3 < 0) {

      var breadCrumMenuitem = new BreadCrumMenuModel();
      breadCrumMenuitem.Name = resource.Name;
      breadCrumMenuitem.LevelMenu = 3;
      breadCrumMenuitem.ObjectType = resource.ObjectType;
      breadCrumMenuitem.Path = resource.Path;
      breadCrumMenuitem.CodeParent = resource.CodeParent;
      breadCrumMenuitem.Active = true;
      breadCrumMenuitem.LstChildren = [];
      this.lstBreadCrum.push(breadCrumMenuitem);
    }
    else {
      this.lstBreadCrum.splice(checkexistMenulevel3, 1);
      var breadCrumMenuitem = new BreadCrumMenuModel();
      breadCrumMenuitem.Name = resource.Name;
      breadCrumMenuitem.LevelMenu = 3;
      breadCrumMenuitem.ObjectType = resource.ObjectType;
      breadCrumMenuitem.Path = resource.Path;
      breadCrumMenuitem.CodeParent = resource.CodeParent;
      breadCrumMenuitem.Active = true;
      breadCrumMenuitem.LstChildren = [];
      this.lstBreadCrum.push(breadCrumMenuitem);
    }
    localStorage.setItem('menuMapPath', JSON.stringify(this.lstBreadCrum));
    //Update Active cho LeftMenu
    this.lstBreadCrumLeftMenu.forEach(function (itemX) {
      let FindMenuActive = itemX.LstChildren.filter(e => e.Path == resource.Path && e.CodeParent == resource.CodeParent);
      if (FindMenuActive.length > 0) {
        FindMenuActive.forEach(function (item) {
          item.Active = false;
        });
      }
    });
    localStorage.setItem('lstBreadCrumLeftMenu', JSON.stringify(this.lstBreadCrumLeftMenu));
    this.eventEmitterService.updateLeftMenuClick();
    // this.router.navigate([resource.Path]);
    let path = this.listMenuSubModule.find(x => x.code == resource.CodeParent).path;

    //Kiểm tra reset bộ lọc
    this.resetSearchModel(path);

    this.router.navigate([path]);
  }

  updateLeftMenuFromHead(module: string, lstSubmenuLevel3: Array<BreadCrumMenuModel>) {
    let MenuLevel2 = this.lstSubmenuLevel2.filter(e => e.ObjectType == module);
    if (MenuLevel2.length > 0) {
      MenuLevel2.forEach(function (item) {
        item.LstChildren = [];
        let MenuLevel3 = lstSubmenuLevel3.filter(e => e.CodeParent == item.CodeParent);
        item.LstChildren.push.apply(item.LstChildren, MenuLevel3);
      })
    }
    this.getPemistion();
    this.getPemistionMenu2(MenuLevel2);
    this.lstBreadCrumLeftMenu = [];
    this.lstBreadCrumLeftMenu.push.apply(this.lstBreadCrumLeftMenu, MenuLevel2);
    localStorage.setItem('lstBreadCrumLeftMenu', JSON.stringify(this.lstBreadCrumLeftMenu));
    this.eventEmitterService.updateLeftMenuClick();
  }

  getPemistion() {
    this.lstSubmenuLevel1.forEach(item => {
      item.LstChildren.forEach(element => {
        element.LstChildren.forEach(role => {
          let resource = item.ObjectType + role.Path;
          let permission: any = this.getPermission.getPermissionLocal(this.listPermissionResourceActive, resource);
          if (permission.status == false) {
            role.Active = true;
          }
          else {
            role.Active = false;
          }
        });
        let countElement = element.LstChildren.filter(f => f.Active == true);
        if (countElement.length == element.LstChildren.length) {
          element.Active = true;
        }
        else element.Active = false;
      });
      let countItem = item.LstChildren.filter(f => f.Active == true);
      if (countItem.length == item.LstChildren.length) {
        item.Active = true;
      }
      else item.Active = false;
    });
  }

  getPemistionMenu2(obj) {
    obj.forEach(item => {
      item.LstChildren.forEach(element => {
        let resource = element.ObjectType + element.Path;
        let permission: any = this.getPermission.getPermissionLocal(this.listPermissionResourceActive, resource);
        if (permission.status == false) {
          element.Active = true;
        }
        else {
          element.Active = false;
        }
      });
      let countElement = item.LstChildren.filter(f => f.Active == true);
      if (countElement.length == item.LstChildren.length) {
        item.Active = true;
      }
      else item.Active = false;
    });
  }

  IsToggleCick() {
    if (this.isToggle == true) {
      this.isToggle = false;
    }
    else {
      this.isToggle = true;
    }
    localStorage.setItem('isToggleCick', this.isToggle.toString());
    this.eventEmitterService.updateIsToggleClick2();
  }

  comeBackMenuLevel1() {
    this.setDefaultViewMenu();
    this.module_display = true;
    this.module_display_value = 'block';
  }

  createBreadCrum() {
    var urlTree = this.router.parseUrl(this.router.url);
    const urlWithoutParams = urlTree.root.children['primary']?.segments.map(it => it.path).join('/').split('/');
    var path = '';

    if (urlWithoutParams) {
      if (urlWithoutParams?.length == 3) {
        if (this.isGuid(urlWithoutParams[2])) {
          path = '/' + urlWithoutParams[0] + '/' + urlWithoutParams[1];
        }
        else {
          path = '/' + urlWithoutParams[0] + '/' + urlWithoutParams[1] + '/' + urlWithoutParams[2];
        }
      }
      else {
        path = '/' + urlWithoutParams[0] + '/' + urlWithoutParams[1];
      }
    }

    if (this.currentURl == '' || this.currentURl == null) {
      this.currentURl = path;
      this.lstBreadCrum = [];
      var findLevel3 = this.lstSubmenuLevel3.find(e => e.Path == path);
      var findDetailURl = this.lstSubmenuDetailURL.find(e => e.Path == path);
      if (findLevel3 != null) {
        var findLevel2 = this.lstSubmenuLevel2.find(e => e.CodeParent == findLevel3.CodeParent);
        //find Menu Level 1
        if (findLevel2 != null) {
          var Title = '';
          switch (findLevel2.ObjectType) {
            case 'admin':
              this.translate.get('module_system.title.sys').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý hệ thống";
              break;
            case 'customer':
              this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
              Title = "Quản trị khách hàng";
              break;
            case 'sales':
              this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý bán hàng";
              break;
            case 'shopping':
              this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý mua hàng";
              break;
            case 'accounting':
              this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý tài chính";
              break;
            case 'employee':
              this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý nhân sự";
              break;
            case 'warehouse':
              this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý kho";
              break;
            case 'man':
              this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý sản xuất";
              break;
            case 'project':
              this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
              Title = "Quản trị dự án";
              break;
            case 'recruitment':
              this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý tuyển dụng";
              break;
            case 'asset':
              this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý tài sản";
              break;
            case 'salary':
              this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
              Title = "Quản lý lương";
              break;
            default:
              break;
          }

          //day vao Menu Level 1
          var breadCrumMenuitem = new BreadCrumMenuModel();
          breadCrumMenuitem.Name = Title;
          breadCrumMenuitem.LevelMenu = 1;
          breadCrumMenuitem.ObjectType = findLevel2.ObjectType;
          breadCrumMenuitem.Path = "";
          breadCrumMenuitem.Active = false;
          breadCrumMenuitem.LstChildren = [];
          this.lstBreadCrum.push(breadCrumMenuitem);

          //Day vao menu Level 2
          let submenulevel3 = this.lstSubmenuLevel3.filter(e => e.CodeParent == findLevel2.CodeParent);
          var fillterResourceAllow = this.getMenuAllowAccess(submenulevel3, this.listResource);
          findLevel2.LstChildren.push.apply(findLevel2.LstChildren, fillterResourceAllow);
          this.lstBreadCrum.push(findLevel2);
          findLevel3.Active = true;
          this.lstBreadCrum.push(findLevel3);

          this.updateLeftMenuFromHead(findLevel2.ObjectType, this.lstSubmenuLevel3);
        }
      }
      else if (findDetailURl != null) {
        var findMenuDeail = this.lstSubmenuDetailURL.find(e => e.Path == path);
        if (findMenuDeail != null) {
          var findLevel3 = this.lstSubmenuLevel3.find(e => e.Code == findMenuDeail.CodeParent);
          if (findLevel3 != null) {

            var findLevel2 = this.lstSubmenuLevel2.find(e => e.CodeParent == findLevel3.CodeParent);
            //find Menu Level 1
            if (findLevel2 != null) {
              var Title = '';
              switch (findLevel2.ObjectType) {
                case 'admin':
                  this.translate.get('module_system.title.sys').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý hệ thống";
                  break;
                case 'customer':
                  this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản trị khách hàng";

                  break;
                case 'sales':
                  this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý bán hàng";
                  break;
                case 'shopping':
                  this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý mua hàng";
                  break;
                case 'accounting':
                  this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý tài chính";
                  break;
                case 'employee':
                  this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý nhân sự";
                  break;
                case 'warehouse':
                  this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý kho";
                  break;
                case 'man':
                  this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý sản xuất";
                  break;
                case 'project':
                  this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản trị dự án";
                  break;
                case 'recruitment':
                  this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý tuyển dụng";
                  break;
                case 'asset':
                  this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý tài sản";
                  break;
                case 'salary':
                  this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
                  Title = "Quản lý lương";
                  break;
                default:
                  break;
              }

              //day vao Menu Level 1
              var breadCrumMenuitem = new BreadCrumMenuModel();
              breadCrumMenuitem.Name = Title;
              breadCrumMenuitem.LevelMenu = 1;
              breadCrumMenuitem.ObjectType = findLevel2.ObjectType;
              breadCrumMenuitem.Path = "";
              breadCrumMenuitem.Active = false;
              breadCrumMenuitem.LstChildren = [];
              this.lstBreadCrum.push(breadCrumMenuitem);

              //Day vao menu Level 2
              let submenulevel3 = this.lstSubmenuLevel3.filter(e => e.CodeParent == findLevel2.CodeParent);
              var fillterResourceAllow = this.getMenuAllowAccess(submenulevel3, this.listResource);
              findLevel2.LstChildren.push.apply(findLevel2.LstChildren, fillterResourceAllow);
              this.lstBreadCrum.push(findLevel2);
              this.lstBreadCrum.push(findLevel3);
              findMenuDeail.Active = true;
              this.lstBreadCrum.push(findMenuDeail);
              this.updateLeftMenuFromHead(findLevel2.ObjectType, this.lstSubmenuLevel3);
            }
          }
        }
      }
    } else {
      if (this.currentURl != path) {
        this.currentURl = path;
        this.lstBreadCrum = [];
        var findLevel3 = this.lstSubmenuLevel3.find(e => e.Path == path);
        var findDetailURl = this.lstSubmenuDetailURL.find(e => e.Path == path);
        if (findLevel3 != null) {
          var findLevel2 = this.lstSubmenuLevel2.find(e => e.CodeParent == findLevel3.CodeParent);
          //find Menu Level 1
          if (findLevel2 != null) {
            var Title = '';
            switch (findLevel2.ObjectType) {
              case 'admin':
                this.translate.get('module_system.title.sys').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý hệ thống";
                break;
              case 'customer':
                this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
                Title = "Quản trị khách hàng";

                break;
              case 'sales':
                this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý bán hàng";
                break;
              case 'shopping':
                this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý mua hàng";
                break;
              case 'accounting':
                this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý tài chính";
                break;
              case 'employee':
                this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý nhân sự";
                break;
              case 'warehouse':
                this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý kho";
                break;
              case 'man':
                this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý sản xuất";
                break;
              case 'project':
                this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
                Title = "Quản trị dự án";
                break;
              case 'recruitment':
                this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý tuyển dụng";
                break;
              case 'asset':
                this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý tài sản";
                break;
              case 'salary':
                this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
                Title = "Quản lý lương";
                break;
              default:
                break;
            }

            //day vao Menu Level 1
            var breadCrumMenuitem = new BreadCrumMenuModel();
            breadCrumMenuitem.Name = Title;
            breadCrumMenuitem.LevelMenu = 1;
            breadCrumMenuitem.ObjectType = findLevel2.ObjectType;
            breadCrumMenuitem.Path = "";
            breadCrumMenuitem.Active = false;
            breadCrumMenuitem.LstChildren = [];
            this.lstBreadCrum.push(breadCrumMenuitem);

            //Day vao menu Level2
            let submenulevel3 = this.lstSubmenuLevel3.filter(e => e.CodeParent == findLevel2.CodeParent);
            var fillterResourceAllow = this.getMenuAllowAccess(submenulevel3, this.listResource);
            findLevel2.LstChildren.push.apply(findLevel2.LstChildren, fillterResourceAllow);
            this.lstBreadCrum.push(findLevel2);
            findLevel3.Active = true;
            this.lstBreadCrum.push(findLevel3);

            this.updateLeftMenuFromHead(findLevel2.ObjectType, this.lstSubmenuLevel3);
          }
        }
        else if (findDetailURl != null) {
          var findMenuDeail = this.lstSubmenuDetailURL.find(e => e.Path == path);
          if (findMenuDeail != null) {
            var findLevel3 = this.lstSubmenuLevel3.find(e => e.Code == findMenuDeail.CodeParent);
            if (findLevel3 != null) {

              var findLevel2 = this.lstSubmenuLevel2.find(e => e.CodeParent == findLevel3.CodeParent);
              //find Menu Level 1
              if (findLevel2 != null) {
                var Title = '';
                switch (findLevel2.ObjectType) {
                  case 'admin':
                    this.translate.get('module_system.title.sys').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý hệ thống";
                    break;
                  case 'customer':
                    this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản trị khách hàng";

                    break;
                  case 'sales':
                    this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý bán hàng";
                    break;
                  case 'shopping':
                    this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý mua hàng";
                    break;
                  case 'accounting':
                    this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý tài chính";
                    break;
                  case 'employee':
                    this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý nhân sự";
                    break;
                  case 'warehouse':
                    this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý kho";
                    break;
                  case 'man':
                    this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý sản xuất";
                    break;
                  case 'project':
                    this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản trị dự án";
                    break;
                  case 'recruitment':
                    this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý tuyển dụng";
                    break;
                  case 'asset':
                    this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý tài sản";
                    break;
                  case 'salary':
                    this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
                    Title = "Quản lý lương";
                    break;
                  default:
                    break;
                }

                //day vao Menu Level 1
                var breadCrumMenuitem = new BreadCrumMenuModel();
                breadCrumMenuitem.Name = Title;
                breadCrumMenuitem.LevelMenu = 1;
                breadCrumMenuitem.ObjectType = findLevel2.ObjectType;
                breadCrumMenuitem.Path = "";
                breadCrumMenuitem.Active = false;
                breadCrumMenuitem.LstChildren = [];
                this.lstBreadCrum.push(breadCrumMenuitem);

                //Day vao menu Level2
                let submenulevel3 = this.lstSubmenuLevel3.filter(e => e.CodeParent == findLevel2.CodeParent);
                var fillterResourceAllow = this.getMenuAllowAccess(submenulevel3, this.listResource);
                findLevel2.LstChildren.push.apply(findLevel2.LstChildren, fillterResourceAllow);
                this.lstBreadCrum.push(findLevel2);
                this.lstBreadCrum.push(findLevel3);
                findMenuDeail.Active = true;
                this.lstBreadCrum.push(findMenuDeail);
                this.updateLeftMenuFromHead(findLevel2.ObjectType, this.lstSubmenuLevel3);
              }
            }
          }
        }
      }
    }
  }

  isGuid(stringToTest) {
    if (stringToTest[0] === "{") {
      stringToTest = stringToTest.substring(1, stringToTest.length - 1);
    }
    var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
    return regexGuid.test(stringToTest);
  }

  buildMenuBar(currentUrl: string) {

    let isMenuProject = false;
    if (currentUrl.includes('projectId')) {
      isMenuProject = true;
    }
    //format currentUrl
    if (currentUrl.indexOf(';') != -1) {
      currentUrl = currentUrl.substring(0, currentUrl.indexOf(';'));
    }
    //Reset active list menu bar
    this.listMenuBar = [];

    var page = this.listMenuPage.find(x => x.path == currentUrl);

    if (page) {
      let subMenu = this.listMenuSubModule.find(x => x.code == page.codeParent);
      this.listMenuBar = this.listMenuSubModule.filter(x => x.codeParent == subMenu.codeParent);

      this.listMenuBar.forEach(item => {
        item.active = false;
        item.children.forEach(_item => {
          _item.active = false;
        });
        if ((item.code.includes('pro_sub') && !isMenuProject) || (item.code.includes('_pro') && isMenuProject)) {
          item.isShow = false;
        }
      });

      this.listMenuBar.forEach(item => {
        item.children = this.listMenuPage.filter(x => x.codeParent == item.code);

        if (item.children.includes(page)) {
          item.active = true;

          let _page = item.children.find(x => x == page);
          if (_page) {
            _page.active = true;
          }
        }
      });
    }
  }

  toggleMenuBarContent(item) {
    this.listMenuBar.forEach(_item => {
      if (_item != item) {
        _item.isShowChildren = false;
      }
    });
    item.isShowChildren = !item.isShowChildren;
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      let menuContent = this.listMenuBar.find(x => x.isShowChildren == true);

      if (menuContent) menuContent.isShowChildren = false;
    }
  }

  goToPath(item: MenuSubModule) {
    //Nếu không phải item mask
    if (item.indexOrder != 1) {
      this.listMenuBar.forEach(x => x.isShowChildren = false);
      if (item.path != null && item.path?.trim() != '') {

        //Kiểm tra reset bộ lọc
        this.resetSearchModel(item.path);

        this.route.params.subscribe(params => {
          let projectId = params['projectId'];

          if (projectId) {
            this.router.navigate([item.path, { projectId: projectId }]);
          }
          else {
            this.router.navigate([item.path]);
          }
        });
      }
    }
  }

  goToMenuPage(menuPage: MenuPage) {
    this.listMenuBar.forEach(x => x.isShowChildren = false);

    //Kiểm tra reset bộ lọc
    this.resetSearchModel(menuPage.path);

    this.route.params.subscribe(params => {
      let projectId = params['projectId'];

      if (projectId) {
        this.router.navigate([menuPage.path, { projectId: projectId }]);
      }
      else {
        this.router.navigate([menuPage.path]);
      }
    });
  }

  //Kiểm tra reset bộ lọc
  resetSearchModel(path) {
    this.reSearchService.resetSearchModel(path);
  }
}
