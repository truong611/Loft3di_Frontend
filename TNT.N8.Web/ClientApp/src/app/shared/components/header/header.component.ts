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
  moduleCrm = 'crm'; //Module Qu???n tr??? quan h??? kh??ch h??ng
  moduleSal = 'sal'; //Module Qu???n l?? b??n h??ng
  moduleBuy = 'buy'; //Module Qu???n l?? mua h??ng
  moduleAcc = 'acc'; //Module Qu???n l?? t??i ch??nh
  moduleHrm = 'hrm'; //Module Qu???n tr??? nh??n s???
  moduleSys = 'sys'; //Module Qu???n tr??? h??? th???ng
  moduleWar = 'war'; //Module Qu???n l?? kho
  modulePro = 'pro'; //Module Qu???n l?? d??? ??n
  moduleAss = 'ass'; //Module Qu???n l?? T??i s???n
  moduleRec = 'rec'; //Module Qu???n l?? Tuy???n d???ng
  moduleSar = 'salary'; //Module Qu???n l?? L????ng
  /*End*/

  /*Resource name*/

  //Qu???n l?? h??? th???ng
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
    //   Name: "Qu???n tr??? kh??ch h??ng", Path: "", ObjectType: "crm", LevelMenu: 1, Active: false, nameIcon: "fa-street-view", IsDefault: false, CodeParent: "Lead_QLKHTN_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "C?? h???i", Path: "", ObjectType: "lead", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "crm_ch", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/lead/dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o m???i", Path: "/lead/create-lead", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m", Path: "/lead/list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: 'Lead_TK' },
    //         { Name: "B??o c??o", Path: "/lead/report-lead", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' }
    //       ], Code: ''
    //     },
    //     {
    //       Name: "H??? s?? th???u", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "crm_hst", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/sale-bidding/dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o m???i", Path: "#", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m", Path: "/sale-bidding/list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: 'CustomerHST_TK' },
    //         { Name: "Ph?? duy???t", Path: "/sale-bidding/approved", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: 'CustomerHST_PD' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "B??o gi??", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "crm_bg", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/customer/quote-dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o m???i", Path: "/customer/quote-create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m", Path: "/customer/quote-list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: 'Quote_TK' },
    //         { Name: "Ph?? duy???t", Path: "/customer/quote-approval", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Ti???m n??ng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-user", IsDefault: false, CodeParent: "crm_khtn", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/customer/potential-customer-dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o m???i", Path: "/customer/potential-customer-create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m", Path: "/customer/potential-customer-list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: 'Customer_TK' },
    //         { Name: "Ph?? duy???t", Path: "/customer/request-approval", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: 'Customer_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Kh??ch h??ng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-user", IsDefault: false, CodeParent: "crm_kh", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/customer/dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o m???i", Path: "/customer/create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m", Path: "/customer/list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: 'Customer_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Ch??m s??c kh??ch h??ng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-gift", IsDefault: false, CodeParent: "crm_cskh", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/customer/care-dashboard", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o ch????ng tr??nh ch??m s??c", Path: "/customer/care-create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Theo d??i ch??m s??c kh??ch h??ng", Path: "/customer/care-list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-headphones", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o CT khuy???n m???i", Path: "/promotion/create", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "customer_CSKH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh s??ch CT khuy???n m???i", Path: "/promotion/list", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "customer_CSKH", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "B??o c??o", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "customer_BaoCao", Display: "none",
    //       LstChildren: [
    //         { Name: "B??o c??o th???ng k?? ch????ng tr??nh CSKH", Path: "#", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "customer_BaoCao", LstChildren: [], Display: "none", Code: 'CustomerBC_TK' },
    //         { Name: "B??o c??o th???ng k?? ph???n h???i kh??ch h??ng", Path: "#", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "customer_BaoCao", LstChildren: [], Display: "none", Code: 'CustomerBC_TK' },
    //         { Name: "B??o c??o doanh s??? th???ng k?? kh??ch h??ng", Path: "#", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "customer_BaoCao", LstChildren: [], Display: "none", Code: 'CustomerBC_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Qu???n l?? li??n h???", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "crm_lh", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh s??ch li??n h???", Path: "/customer/list-contact-customer", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "crm_lh", LstChildren: [], Display: "none", Code: 'Customer_LH' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    //Module B??n h??ng
    // {
    //   Name: "Qu???n l?? b??n h??ng", Path: "", ObjectType: "sal", LevelMenu: 1, Active: false, nameIcon: "fa-university", IsDefault: false, CodeParent: "sal", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Danh m???c", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "sal_dm", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh m???c gi?? b??n", Path: "/product/price-list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-folder-open", IsDefault: false, CodeParent: "sal_dm", LstChildren: [], Display: "none", Code: 'customer_CSKH_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "S???n ph???m d???ch v???", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "sal_spdv", Display: "none",
    //       LstChildren: [
    //         { Name: "Qu???n l?? danh m???c", Path: "/admin/list-product-category", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-outdent", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: 'customer_CSKH_TK' },
    //         { Name: "T???o m???i", Path: "/product/create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m", Path: "/product/list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: 'Sale_Product_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "H???p ?????ng b??n", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-contract", IsDefault: false, CodeParent: "sal_hdb", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/sales/contract-dashboard", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o h???p ?????ng b??n", Path: "/sales/contract-create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m h???p ?????ng b??n", Path: "/sales/contract-list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: 'sal_hdB_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "????n h??ng", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "sal_dh", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/sales/dashboard", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o ????n h??ng", Path: "/order/create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m ????n h??ng", Path: "/order/list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: 'Sale_Order_TK' },
    //         { Name: "T???o ????n h??ng d???ch v???", Path: "/order/order-service-create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Thanh to??n ????n h??ng", Path: "/order/pay-order-service", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-credit-card", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "H??a ????n", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-o", IsDefault: false, CodeParent: "sal_hd", Display: "none",
    //       LstChildren: [
    //         { Name: "T???o h??a ????n", Path: "/bill-sale/create", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m h??a ????n", Path: "/bill-sale/list", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "B??o c??o", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "sal_bc", Display: "none",
    //       LstChildren: [
    //         { Name: "B??o c??o doanh s??? theo nh??n vi??n", Path: "/sales/top-revenue", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "B??o c??o l???i nhu???n theo s???n ph???m", Path: "/sales/product-revenue", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "B??o c??o l???i nhu???n theo kh??ch h??ng", Path: "/order/list-profit-according-customers", ObjectType: "sale", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    // Module Mua h??ng
    // {
    //   Name: "Qu???n l?? mua h??ng", Path: "", ObjectType: "buy", LevelMenu: 1, Active: false, nameIcon: "fa-shopping-cart", IsDefault: false, CodeParent: "Shopping_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "B???ng gi?? nh?? cung c????p", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "buy_bgncc", Display: "none",
    //       LstChildren: [
    //         { Name: "T??m ki???m", Path: "/vendor/list-vendor-price", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: true, CodeParent: "Shopping_DMBGNCC", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Nh?? cung c???p", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "buy_ncc", Display: "none",
    //       LstChildren: [
    //         { Name: "Ta??o m???i nh?? cung c????p", Path: "/vendor/create", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Shopping_QLNCC", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m nh?? cung c???p", Path: "/vendor/list", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "Shopping_QLNCC", LstChildren: [], Display: "none", Code: 'Shop_Vendor_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "????? xu???t mua h??ng", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "buy_dxmh", Display: "none",
    //       LstChildren: [
    //         { Name: "T???o ????? xu???t mua h??ng", Path: "/procurement-request/create", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Shopping_QLDXMH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m ????? xu???t mua h??ng", Path: "/procurement-request/list", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "Shopping_QLDXMH", LstChildren: [], Display: "none", Code: 'Shop_procurement-request_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Gi???y ????? ngh??? b??o gi?? NCC", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "buy_dnbg", Display: "none",
    //       LstChildren: [
    //         { Name: "T???o ????? ngh??? b??o gi?? NCC", Path: "/vendor/vendor-quote-create", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Shopping_BGNCC", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh s??ch gi???y ????? ngh??? b??o gi?? NCC", Path: "/vendor/list-vendor-quote", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "Shopping_BGNCC", LstChildren: [], Display: "none", Code: 'Shop_vendor_quote_request_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "????n h??ng mua", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "buy_dhm", Display: "none",
    //       LstChildren: [
    //         { Name: "Dashboard", Path: "/vendor/dashboard", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: false, CodeParent: "Shopping_QLMH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T???o ????n h??ng mua", Path: "/vendor/create-order", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Shopping_QLMH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m ????n h??ng mua", Path: "/vendor/list-order", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "Shopping_QLMH", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "B??o c??o", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "buy_bc", Display: "none",
    //       LstChildren: [
    //         { Name: "B??o c??o t??nh tr???ng ????? xu???t mua h??ng", Path: "/procurement-request/list-report", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "Shopping_BC", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "B??o c??o t??nh tr???ng ????n h??ng mua", Path: "/vendor/vendor-order-report", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "Shopping_BC", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    // Module Qu???n l?? kho
    // {
    //   Name: "Qu???n l?? kho", Path: "", ObjectType: "war", LevelMenu: 1, Active: false, nameIcon: "fa-cubes", IsDefault: false, CodeParent: "Warehouse_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Danh s??ch kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "war_kho", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh s??ch kho", Path: "/warehouse/list", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "WH_QLK", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Nh???p kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "war_nk", Display: "none",
    //       LstChildren: [
    //         { Name: "T???o m???i phi???u nh???p kho", Path: "/warehouse/inventory-receiving-voucher/create", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "WH_QLNK", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m phi???u nh???p kho", Path: "/warehouse/inventory-receiving-voucher/list", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "WH_QLNK", LstChildren: [], Display: "none", Code: 'WH_QLNTK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Xu???t kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "war_xk", Display: "none",
    //       LstChildren: [
    //         { Name: "T???o m???i phi???u xu???t kho", Path: "/warehouse/inventory-delivery-voucher/create-update", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "WH_QLXK", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m phi???u xu???t kho", Path: "/warehouse/inventory-delivery-voucher/list", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "WH_QLXK", LstChildren: [], Display: "none", Code: 'WH_QLNXK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "H??ng t???n kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "war_htk", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh s??ch h??ng t???n kho", Path: "/warehouse/in-stock-report/list", ObjectType: "WH", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "WH_QLHTK", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    // Module K??? to??n - t??i ch??nh
    // {
    //   Name: "K??? to??n - T??i ch??nh", Path: "", ObjectType: "acc", LevelMenu: 1, Active: false, nameIcon: "fa-money", IsDefault: false, CodeParent: "Accounting_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Danh m???c ph??", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "acc_dmp", Display: "none",
    //       LstChildren: [
    //         { Name: "Danh s??ch", Path: "/accounting/cost-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-folder-open", IsDefault: false, CodeParent: "Accounting_DM", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Ti???n m???t", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "acc_tm", Display: "none",
    //       LstChildren: [
    //         { Name: "T???o phi???u thu", Path: "/accounting/cash-receipts-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh s??ch phi???u thu", Path: "/accounting/cash-receipts-list", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: 'Accounting_cash-receipts_TK' },
    //         { Name: "T???o phi???u chi", Path: "/accounting/cash-payments-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh s??ch phi???u chi", Path: "/accounting/cash-payments-list", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: 'Accounting_cash-payment_TK' },
    //         { Name: "S???? quy?? ti???n m???t", Path: "/accounting/cash-book", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "Accounting_TM", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Ng??n h??ng", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "acc_nh", Display: "none",
    //       LstChildren: [
    //         { Name: "T???o b??o c??", Path: "/accounting/bank-receipts-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh s??ch b??o c??", Path: "/accounting/bank-receipts-list", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: 'accounting_bank-receipts_TK' },
    //         { Name: "T???o UNC", Path: "/accounting/bank-payments-create", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "Danh s??ch UNC", Path: "/accounting/bank-payments-list", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: 'Accounting_bank-payments-TK' },
    //         { Name: "S???? quy?? ng??n h??ng", Path: "/accounting/bank-book", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "Accounting_NH", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "C??ng n???", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "acc_cn", Display: "none",
    //       LstChildren: [
    //         { Name: "Nha?? cung c????p", Path: "/accounting/receivable-vendor-report", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: true, CodeParent: "Accounting_CN", LstChildren: [], Display: "none", Code: 'Accounting_Vendor_Report' },
    //         { Name: "Kha??ch ha??ng", Path: "/accounting/receivable-customer-report", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: false, CodeParent: "Accounting_CN", LstChildren: [], Display: "none", Code: 'Accounting_Customer_Report' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "B??o c??o k???t qu??? kinh doanh", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "acc_kqkd", Display: "none",
    //       LstChildren: [
    //         { Name: "B??o c??o k???t qu??? kinh doanh", Path: "/accounting/sales-report", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "Accounting_BCKQKD", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    //Module qu???n l?? s???n xu???t
    // {
    //   Name: "Qu???n l?? s???n xu???t", Path: "", ObjectType: "man", LevelMenu: 1, Active: false, nameIcon: "fa fa-cogs", IsDefault: false, CodeParent: "Manufacturing_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "Qu???n l?? quy tr??nh", Path: "", ObjectType: "man", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, Display: "none", CodeParent: "MAN_QLQT",
    //       LstChildren: [
    //         { Name: "T???o m???i quy tr??nh", Path: "/manufacture/product-order-workflow/create", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m quy tr??nh", Path: "/manufacture/product-order-workflow/list", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: 'MAN_QLQT_TK' },
    //         { Name: "T??m ki???m ti???n tr??nh", Path: "/manufacture/technique-request/list", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: 'MAN_QLTT_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Qu???n l?? l???nh t???ng", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, Display: "none", CodeParent: "MAN_QLLT",
    //       LstChildren: [
    //         { Name: "T???o m???i l???nh t???ng", Path: "/manufacture/total-production-order/create", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m l???nh t???ng", Path: "/manufacture/total-production-order/list", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: 'MAN_QLLT_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Qu???n l?? l???nh s???n xu???t", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-terminal", IsDefault: false, Display: "none", CodeParent: "MAN_QLLSX",
    //       LstChildren: [
    //         { Name: "Theo d??i s???n xu???t", Path: "/manufacture/track-production/track", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_TDSX", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "Theo d??i s???n xu???t", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, Display: "none", CodeParent: "MAN_TDSX",
    //       LstChildren: [
    //         { Name: "T??m ki???m l???nh s???n xu???t", Path: "/manufacture/production-order/list", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLLSX", LstChildren: [], Display: "none", Code: 'MAN_QLLSX_TK' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "B??o c??o QC", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, Display: "none", CodeParent: "MAN_RP_QC",
    //       LstChildren: [
    //         { Name: "B??o c??o theo QC", Path: "/manufacture/report/quanlity-control", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_RP_QC", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //     {
    //       Name: "B??o c??o s???n xu???t", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, Display: "none", CodeParent: "MAN_RP_SX",
    //       LstChildren: [
    //         { Name: "B??o c??o s???n xu???t", Path: "/manufacture/report/manufacture", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_RP_SX", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    // Module Qu???n l?? nh??n s???
    {
      Name: "Qu???n l?? nh??n s???", Path: "", ObjectType: "hrm", LevelMenu: 1, Active: false, nameIcon: "fa-users", IsDefault: false, CodeParent: "Employee_Module", Display: "none",
      LstChildren: [
        {
          Name: "Qu???n l?? nh??n vi??n", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-user-circle", IsDefault: false, Display: "none", CodeParent: "hrm_nv",
          LstChildren: [
            // { Name: "Dashboard", Path: "/employee/dashboard", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o nh??n vi??n", Path: "/employee/create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh s??ch nh??n vi??n", Path: "/employee/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: 'HRM_EmployeeTK' },
            // { Name: "????? xu???t xin ngh???", Path: "/employee/request/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
            { Name: "Danh s??ch nh??n vi??n ???? ngh??? vi???c", Path: "/employee/employee-quit-work", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: '' },
            { Name: "????? xu???t c??ng t??c", Path: "/employee/request/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
            { Name: "C???u h??nh checklist", Path: "/employee/cauhinh-checklist", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "HRM_QLNV", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
          ], Code: ''
        },
        {
          Name: "Qu???n l?? b???o hi???m", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-futbol-o", IsDefault: false, Display: "none", CodeParent: "hrm_qlbh",
          LstChildren: [
            { Name: "C???u h??nh", Path: "/employee/cauhinh-baohiem", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_qlbh", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        // {
        //   Name: "Ti???n l????ng", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "hrm_tl", Display: "none",
        //   LstChildren: [
        //     { Name: "B???ng l????ng nh??n vi??n", Path: "/employee/employee-salary/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "HRM_QLTL", LstChildren: [], Display: "none", Code: '' },
        //   ], Code: ''
        // },
        {
          Name: "????? xu???t t??ng l????ng", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-cube", IsDefault: false, CodeParent: "hrm_dxtl", Display: "none",
          LstChildren: [
            { Name: "Danh s??ch ????? xu???t t??ng l????ng", Path: "/employee/danh-sach-de-xuat-tang-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o m???i ????? xu???t t??ng l????ng", Path: "/employee/tao-de-xuat-tang-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "????? xu???t ch???c v???", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-briefcase", IsDefault: false, CodeParent: "hrm_dxvc", Display: "none",
          LstChildren: [
            { Name: "Danh s??ch ????? xu???t ch???c v???", Path: "/employee/danh-sach-de-xuat-chuc-vu", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxvc", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o m???i ????? xu???t ch???c v???", Path: "/employee/tao-de-xuat-chuc-vu", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxvc", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Qu???n l?? c??ng t??c", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-car", IsDefault: false, Display: "none", CodeParent: "hrm_qlct",
          LstChildren: [
            { Name: "????? xu???t c??ng t??c", Path: "/employee/danh-sach-de-xuat-cong-tac", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "HRM_QLCT", LstChildren: [], Display: "none", Code: 'HRM_HSCT' },
            { Name: "H??? s?? c??ng t??c", Path: "/employee/danh-sach-ho-so-cong-tac", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "HRM_QLCT", LstChildren: [], Display: "none", Code: 'HRM_HSCT' },
            { Name: "????? ngh??? t???m ???ng", Path: "/employee/danh-sach-de-nghi-tam-ung", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "HRM_QLCT", LstChildren: [], Display: "none", Code: 'HRM_DNTU' },
            { Name: "????? ngh??? ho??n ???ng", Path: "/employee/danh-sach-de-nghi-hoan-ung", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "HRM_QLCT", LstChildren: [], Display: "none", Code: 'HRM_DNHU' },
          ], Code: ''
        },
        {
          Name: "????? xu???t k??? ho???ch OT", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "hrm_dxkhot", Display: "none",
          LstChildren: [
            { Name: "Danh s??ch k??? ho???ch OT", Path: "/employee/danh-sach-de-xuat-ot", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o ????? xu???t k??? ho???ch OT", Path: "/employee/kehoach-ot-create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "????? xu???t xin ngh???", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-asterisk", IsDefault: false, Display: "none", CodeParent: "hrm_dxxn",
          LstChildren: [
            { Name: "Danh s??ch ????? xu???t xin ngh???", Path: "/employee/request/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o m???i ????? xu???t xin ngh???", Path: "/employee/request/create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "B??o c??o nh??n s???", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-area-chart", IsDefault: false, Display: "none", CodeParent: "hrm_bcns",
          LstChildren: [
            { Name: "B??o c??o nh??n s???", Path: "/employee/bao-cao-nhan-su", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa-area-chart", IsDefault: true, CodeParent: "hrm_bcns", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },

      ], Code: ''
    },
    //Module D??? ??n
    // {
    //   Name: "Qu???n l?? D??? ??n", Path: "", ObjectType: "pro", LevelMenu: 1, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "Project_Module", Display: "none",
    //   LstChildren: [
    //     {
    //       Name: "D??? ??n", Path: "", ObjectType: "pro_du_an", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "_pro", Display: "none", LstChildren: [
    //         { Name: "T???o m???i d??? ??n", Path: "/project/create", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "T??m ki???m d??? ??n", Path: "/project/list", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "B??o c??o s??? d???ng ngu???n l???c", Path: "/project/bc-su-dung-nguon-luc", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    //         { Name: "B??o c??o t???ng h???p c??c d??? ??n", Path: "/project/bc-tong-hop-cac-du-an", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    //       ], Code: ''
    //     },
    //   ], Code: ''
    // },
    //Module T??i s???n
    {
      Name: "Qu???n l?? T??i s???n", Path: "", ObjectType: "ass", LevelMenu: 1, Active: false, nameIcon: "fa-cubes", IsDefault: false, CodeParent: "Asset_Module", Display: "none",
      LstChildren: [
        {
          Name: "Qu???n l?? t??i s???n", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-cubes", IsDefault: false, CodeParent: "ass_ass", Display: "none",
          LstChildren: [
            { Name: "T???o m???i t??i s???n", Path: "/asset/create", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_qlass", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh s??ch t??i s???n", Path: "/asset/list", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa-database", IsDefault: true, CodeParent: "ass_qlass", LstChildren: [], Display: "none", Code: '' },
            { Name: "Ph??n b??? t??i s???n", Path: "/asset/phan-bo-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_qlass", LstChildren: [], Display: "none", Code: '' },
            { Name: "Thu h???i t??i s???n", Path: "/asset/thu-hoi-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_qlass", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Y??u c???u c???p ph??t", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-shopping-basket", IsDefault: false, CodeParent: "ass_request", Display: "none",
          LstChildren: [
            { Name: "Danh s??ch", Path: "/asset/danh-sach-yeu-cau-cap-phat", ObjectType: "ass", LevelMenu: 3, Active: true, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "ass_qlre", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o m???i", Path: "/asset/yeu-cau-cap-phat-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_qlre", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Ki???m k?? t??i s???n", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-check-square", IsDefault: false, CodeParent: "ass_KiemKe", Display: "none",
          LstChildren: [
            { Name: "Ki???m k?? t??i s???n", Path: "/asset/danh-sach-dot-kiem-ke", ObjectType: "ass", LevelMenu: 3, Active: true, nameIcon: "fa-check-square", IsDefault: true, CodeParent: "ass_KiemKe", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        // {
        //   Name: "B??o c??o t??i s???n", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "ass_report", Display: "none",
        //   LstChildren: [
        //     { Name: "B??o c??o ph??n b???", Path: "/asset/bao-cao-phan-bo", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_bcpb", LstChildren: [], Display: "none", Code: '' },
        //     { Name: "B??o c??o kh???u hao", Path: "/asset/bao-cao-khau-hao", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_bckh", LstChildren: [], Display: "none", Code: '' },
        //   ], Code: ''
        // },
      ], Code: ''
    },
    // Module Qu???n l?? Tuy???n d???ng
    {
      Name: "Qu???n l?? tuy???n d???ng", Path: "", ObjectType: "rec", LevelMenu: 1, Active: false, nameIcon: "fa-address-book", IsDefault: false, CodeParent: "Recruitment_Module", Display: "none",
      LstChildren: [
        {
          Name: "Chi???n d???ch tuy???n d???ng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-search", IsDefault: false, CodeParent: "rec_cdtd", Display: "none", LstChildren: [
            { Name: "Dashboard", Path: "/employee/dashboard-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o m???i", Path: "/employee/tao-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh s??ch", Path: "/employee/danh-sach-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "B??o c??o", Path: "/employee/bao-cao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },

          ], Code: ''
        },
        {
          Name: "V??? tr?? tuy???n d???ng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-file-text", IsDefault: false, CodeParent: "rec_cvtd", Display: "none", LstChildren: [
            { Name: "T???o m???i", Path: "/employee/tao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh s??ch", Path: "/employee/danh-sach-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "???ng vi??n", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "rec_uv", Display: "none", LstChildren: [
            { Name: "T???o m???i", Path: "/employee/tao-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh s??ch", Path: "/employee/danh-sach-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
    // Module Qu???n l?? l????ng
    {
      Name: "Qu???n l?? l????ng", Path: "", ObjectType: "salary", LevelMenu: 1, Active: false, nameIcon: "fa-money", IsDefault: false, CodeParent: "Salary_Module", Display: "none",
      LstChildren: [
        {
          Name: "C???u h??nh chung", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, Display: "none", CodeParent: "salary_chc",
          LstChildren: [
            { Name: "C???u h??nh", Path: "/salary/cau-hinh-chung", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "salary_chc", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Ch???m c??ng", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: false, Display: "none", CodeParent: "salary_dmvs",
          LstChildren: [
            { Name: "Ch???m c??ng", Path: "/salary/tk-cham-cong", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: true, CodeParent: "salary_dmvs", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "K??? l????ng", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-university", IsDefault: false, Display: "none", CodeParent: "salary_kl",
          LstChildren: [
            { Name: "Danh s??ch k??? l????ng", Path: "/salary/ky-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "salary_kl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Phi???u l????ng", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, Display: "none", CodeParent: "salary_pl",
          LstChildren: [
            { Name: "Danh s??ch phi???u l????ng", Path: "/salary/phieu-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "salary_pl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "B??o c??o chi ph??", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-pie-chart", IsDefault: false, Display: "none", CodeParent: "salary_bccp",
          LstChildren: [
            { Name: "B??o c??o chi ph??", Path: "/salary/bao-cao-chi-phi", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-pie-chart", IsDefault: true, CodeParent: "salary_bccp", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
  ];

  lstSubmenuLevel2: Array<BreadCrumMenuModel> = [
    //Qu???n tr??? quan h??? kh??ch h??ng
    // { Name: "Ti???m n??ng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-user", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    // { Name: "C?? h???i", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    // { Name: "H??? s?? th???u", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o gi??", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Kh??ch h??ng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-user", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Ch??m s??c kh??ch h??ng", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-gift", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Qu???n l?? li??n h???", Path: "", ObjectType: "customer", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "crm_lh", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Qu???n l?? b??n h??ng
    // { Name: "Qu???n l?? danh m???c", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "sal_dm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "S???n ph???m d???ch v???", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: '' },
    // { Name: "H???p ?????ng b??n", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-o", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    // { Name: "????n h??ng", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "H??a ????n", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-file-o", IsDefault: false, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o", Path: "", ObjectType: "sales", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Qu???n l?? h??? th???ng
    { Name: "C???u h??nh th??ng tin chung", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-cog", IsDefault: false, CodeParent: "Systems_CHTTC", LstChildren: [], Display: "none", Code: '' },
    { Name: "C???u h??nh th?? m???c", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, CodeParent: "Systems_CHFOLDER", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? th??ng b??o", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-bell", IsDefault: false, CodeParent: "Systems_QLTB", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tham s??? h??? th???ng", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-cogs", IsDefault: false, CodeParent: "Systems_TSHT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Qua??n ly?? m???u Email", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-envelope", IsDefault: false, CodeParent: "Systems_QLE", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qua??n ly?? s?? ????? t???? ch????c", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-sitemap", IsDefault: false, CodeParent: "Systems_QLSDTC", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qua??n ly?? d???? li????u danh m???c", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-newspaper-o", IsDefault: false, CodeParent: "Systems_QLDLDM", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? nh??m quy???n", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-users", IsDefault: false, CodeParent: "Systems_QLNQ", LstChildren: [], Display: "none", Code: '' },
    { Name: "Ph??n ha??ng kha??ch ha??ng", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-server", IsDefault: false, CodeParent: "Systems_QLPHKH", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qua??n ly?? quy tr??nh l??m vi???c", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, CodeParent: "Systems_QLQTLV", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nh???t k?? h??? th???ng", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "Systems_LOG", LstChildren: [], Display: "none", Code: '' },
    { Name: "K??? ho???ch", Path: "", ObjectType: "admin", LevelMenu: 2, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "Systems_KHKD", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Qu???n l?? mua h??ng
    // { Name: "B???ng gi?? nh?? cung c???p", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "buy_bgncc", Display: "none", LstChildren: [], Code: '' },
    // { Name: "Nh?? cung c???p", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "buy_ncc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "????? xu???t mua h??ng", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "buy_dxmh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "????n h??ng mua", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "buy_dhm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Gi???y ????? ngh??? b??o gi?? NCC", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: true, CodeParent: "buy_dnbg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o", Path: "", ObjectType: "shopping", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "buy_bc", Display: "none", LstChildren: [], Code: '' },

    //Menu level 2 Qu???n l?? t??i ch??nh
    // { Name: "Danh m???c ph??", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "acc_dmp", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Ti???n m???t", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Ng??n h??ng", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "C??ng n???", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "acc_cn", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o k???t qu??? kinh doanh", Path: "", ObjectType: "accounting", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "acc_kqkd", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Qu???n l?? Nhan su
    { Name: "Trang ch???", Path: "/", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-user-circle", IsDefault: false, CodeParent: "", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? nh??n vi??n", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-user-circle", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? b???o hi???m", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-futbol-o", IsDefault: false, CodeParent: "hrm_qlbh", LstChildren: [], Display: "none", Code: '' },
    { Name: "????? xu???t t??ng l????ng", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-cube", IsDefault: false, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
    { Name: "????? xu???t ch???c v???", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-briefcase", IsDefault: false, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? c??ng t??c", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-car", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "????? xu???t k??? ho???ch OT", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
    { Name: "????? xu???t xin ngh???", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-asterisk", IsDefault: false, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? ????nh gi??", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-check-circle", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
    { Name: "B??o c??o nh??n s???", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-area-chart", IsDefault: false, CodeParent: "hrm_bcns", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Qu???n l?? kho
    // { Name: "Danh s??ch kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-binoculars", IsDefault: false, CodeParent: "war_kho", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nh???p kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-file-archive-o", IsDefault: false, CodeParent: "war_nk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Xu???t kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-quote-right", IsDefault: false, CodeParent: "war_xk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "H??ng t???n kho", Path: "", ObjectType: "warehouse", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "war_htk", LstChildren: [], Display: "none", Code: '' },

    //Menu level 2 Qu???n s???n xu???t
    // { Name: "Qu???n l?? quy tr??nh", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Qu???n l?? l???nh t???ng", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa fa-exchange", IsDefault: false, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Qu???n l?? l???nh s???n xu???t", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-terminal", IsDefault: false, CodeParent: "MAN_QLLSX", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Theo d??i s???n xu???t", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, CodeParent: "MAN_TDSX", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o QC", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "MAN_RP_QC", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o s???n xu???t", Path: "", ObjectType: "manufacture", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "MAN_RP_SX", LstChildren: [], Display: "none", Code: '' },

    // Menu level 2 Qu???n l?? du an
    // { Name: "D??? ??n", Path: "", ObjectType: "pro_du_an", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '', },

    // Menu level 2 Qu???n l?? t??i s???n
    { Name: "Danh s??ch t??i s???n", Path: "", ObjectType: "asset", LevelMenu: 2, Active: true, nameIcon: "fa-database", IsDefault: true, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '', },
    { Name: "Y??u c???u c???p ph??t", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-shopping-basket", IsDefault: false, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '', },
    { Name: "B??o c??o t??i s???n", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-compass", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '', },
    { Name: "Ki???m k?? t??i s???n", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-check-square", IsDefault: false, CodeParent: "ass_KiemKe", LstChildren: [], Display: "none", Code: '', },

    //Menu level 2 Qu???n l?? Tuy???n d???ng
    { Name: "Chi???n d???ch tuy???n d???ng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-search", IsDefault: false, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "V??? tr?? tuy???n d???ng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-file-text", IsDefault: false, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "???ng vi??n", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? l????ng
    { Name: "C???u h??nh chung", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, CodeParent: "salary_chc", LstChildren: [], Display: "none", Code: '' },
    { Name: "Ch???m c??ng", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: false, CodeParent: "salary_dmvs", LstChildren: [], Display: "none", Code: '' },
    { Name: "K??? l????ng", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-university", IsDefault: false, CodeParent: "salary_kl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Phi???u l????ng", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "salary_pl", LstChildren: [], Display: "none", Code: '' },
    { Name: "B??o c??o chi ph??", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-pie-chart", IsDefault: false, CodeParent: "salary_bccp", LstChildren: [], Display: "none", Code: '' },
  ];

  lstSubmenuLevel3: Array<BreadCrumMenuModel> = [
    //Qu???n l?? kh??ch h??ng ti???m n??ng(Potential Customer)
    // { Name: "Dashboard", Path: "/customer/potential-customer-dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o m???i", Path: "/customer/potential-customer-create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m", Path: "/customer/potential-customer-list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: 'Customer_TK' },
    // { Name: "Ph?? duy???t", Path: "/customer/request-approval", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_khtn", LstChildren: [], Display: "none", Code: 'Customer_TK' },

    //Qu???n l?? c?? h???i
    // { Name: "Dashboard", Path: "/lead/dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o m???i", Path: "/lead/create-lead", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m", Path: "/lead/list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: 'Lead_TK' },
    // { Name: "B??o c??o", Path: "/lead/report-lead", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "crm_ch", LstChildren: [], Display: "none", Code: '' },

    // Qu???n l?? h??? s?? th???u
    // { Name: "Dashboard", Path: "/sale-bidding/dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m", Path: "/sale-bidding/list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: 'SaleBidding_TK' },
    // { Name: "Ph?? duy???t", Path: "/sale-bidding/approved", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_hst", LstChildren: [], Display: "none", Code: 'SaleBidding_PD' },

    //C?? h???i b??o gi??(Quote)
    // { Name: "Dashboard", Path: "/customer/quote-dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o m???i", Path: "/customer/quote-create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m", Path: "/customer/quote-list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: 'Quote_TK' },
    // { Name: "Ph?? duy???t", Path: "/customer/quote-approval", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-universal-access", IsDefault: false, CodeParent: "crm_bg", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? kh??ch h??ng(Customer)
    // { Name: "Dashboard", Path: "/customer/dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o m???i", Path: "/customer/create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m", Path: "/customer/list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "crm_kh", LstChildren: [], Display: "none", Code: 'Customer_TK' },

    //Ch??m s??c kh??ch h??ng(CustomerCare)
    // { Name: "Dashboard", Path: "/customer/care-dashboard", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o ch????ng tr??nh ch??m s??c", Path: "/customer/care-create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Theo d??i ch??m s??c kh??ch h??ng", Path: "/customer/care-list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-headphones", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o CT khuy???n m???i", Path: "/promotion/create", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh s??ch CT khuy???n m???i", Path: "/promotion/list", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "crm_cskh", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? li??n h???
    // { Name: "Danh s??ch li??n h???", Path: "/customer/list-contact-customer", ObjectType: "crm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "crm_lh", LstChildren: [], Display: "none", Code: 'Customer_LH' },

    //Qu???n l?? b??n h??ng(Sales)
    // { Name: "Danh m???c gi?? b??n", Path: "/product/price-list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-folder-open", IsDefault: true, CodeParent: "sal_dm", LstChildren: [], Display: "none", Code: 'customer_CTE_TK' },
    // { Name: "Qu???n l?? danh m???c", Path: "/admin/list-product-category", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-outdent", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: 'customer_CSKH_TK' },
    // { Name: "T???o m???i", Path: "/product/create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m", Path: "/product/list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "sal_spdv", LstChildren: [], Display: "none", Code: 'Sale_Product_TK' },
    // { Name: "Dashboard", Path: "/sales/contract-dashboard", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o h???p ?????ng b??n", Path: "/sales/contract-create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m h???p ?????ng b??n", Path: "/sales/contract-list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "sal_hdb", LstChildren: [], Display: "none", Code: 'sal_hdB_TK' },
    // { Name: "Dashboard", Path: "/sales/dashboard", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o ????n h??ng", Path: "/order/create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m ????n h??ng", Path: "/order/list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: 'Sale_Order_TK' },
    // { Name: "T???o ????n h??ng d???ch v???", Path: "/order/order-service-create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Thanh to??n ????n h??ng", Path: "/order/pay-order-service", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-credit-card", IsDefault: false, CodeParent: "sal_dh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o h??a ????n", Path: "/bill-sale/create", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m h??a ????n", Path: "/bill-sale/list", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "sal_hd", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o doanh s??? theo nh??n vi??n", Path: "/sales/top-revenue", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o l???i nhu???n theo s???n ph???m", Path: "/sales/product-revenue", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o l???i nhu???n theo kh??ch h??ng", Path: "/order/list-profit-according-customers", ObjectType: "sal", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "sal_bc", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? h??? th???ng
    { Name: "C???u h??nh th??ng tin chung", Path: "/admin/company-config", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-cog", IsDefault: true, CodeParent: "Systems_CHTTC", LstChildren: [], Display: "none", Code: '' },
    { Name: "C???u h??nh th?? m???c", Path: "/admin/folder-config", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-cog", IsDefault: true, CodeParent: "Systems_CHFOLDER", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? th??ng b??o", Path: "/admin/notifi-setting-list", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-bell", IsDefault: true, CodeParent: "Systems_QLTB", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tham s??? h??? th???ng", Path: "/admin/system-parameter", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-cogs", IsDefault: true, CodeParent: "Systems_TSHT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Qua??n ly?? m???u Email", Path: "/admin/email-configuration", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-envelope", IsDefault: true, CodeParent: "Systems_QLE", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qua??n ly?? s?? ????? t???? ch????c", Path: "/admin/organization", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-sitemap", IsDefault: true, CodeParent: "Systems_QLSDTC", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qua??n ly?? d???? li????u danh m???c", Path: "/admin/masterdata", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-newspaper-o", IsDefault: true, CodeParent: "Systems_QLDLDM", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? nh??m quy???n", Path: "/admin/permission", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-users", IsDefault: true, CodeParent: "Systems_QLNQ", LstChildren: [], Display: "none", Code: '' },
    { Name: "Ph??n ha??ng kha??ch ha??ng", Path: "/admin/config-level-customer", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-server", IsDefault: true, CodeParent: "Systems_QLPHKH", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qua??n ly?? quy tr??nh l??m vi???c", Path: "/admin/danh-sach-quy-trinh", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-exchange", IsDefault: true, CodeParent: "Systems_QLQTLV", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nh???t k?? h??? th???ng", Path: "/admin/audit-trace", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: true, CodeParent: "Systems_LOG", LstChildren: [], Display: "none", Code: '' },
    { Name: "K??? ho???ch kinh doanh", Path: "/admin/business-goals", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: true, CodeParent: "Systems_KHKD", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? mua h??ng(shopping)
    // { Name: "T??m ki???m", Path: "/vendor/list-vendor-price", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: true, CodeParent: "buy_bgncc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Ta??o m???i nh?? cung c????p", Path: "/vendor/create", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "buy_ncc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m nh?? cung c???p", Path: "/vendor/list", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "buy_ncc", LstChildren: [], Display: "none", Code: 'Shop_Vendor_TK' },
    // { Name: "T???o ????? xu???t mua h??ng", Path: "/procurement-request/create", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "buy_dxmh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m ????? xu???t mua h??ng", Path: "/procurement-request/list", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "buy_dxmh", LstChildren: [], Display: "none", Code: 'Shop_procurement-request_TK' },
    // { Name: "Dashboard", Path: "/vendor/dashboard", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: false, CodeParent: "buy_dhm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o ????n h??ng mua", Path: "/vendor/create-order", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "buy_dhm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m ????n h??ng mua", Path: "/vendor/list-order", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "buy_dhm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o ????? ngh??? b??o gi?? NCC", Path: "/vendor/vendor-quote-create", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "buy_dnbg", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh s??ch gi???y ????? ngh??? b??o gi?? NCC", Path: "/vendor/list-vendor-quote", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "buy_dnbg", LstChildren: [], Display: "none", Code: 'Shop_procurement-request_TK' },
    // { Name: "B??o c??o t??nh tr???ng ????? xu???t mua h??ng", Path: "/procurement-request/list-report", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: false, CodeParent: "buy_bc", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o t??nh tr???ng ????n h??ng mua", Path: "/vendor/vendor-order-report", ObjectType: "buy", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "buy_bc", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? t??i ch??nh(Accounting)
    // { Name: "Danh s??ch", Path: "/accounting/cost-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-folder-open", IsDefault: true, CodeParent: "acc_dmp", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o phi???u thu", Path: "/accounting/cash-receipts-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh s??ch phi???u thu", Path: "/accounting/cash-receipts-list", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: 'Accounting_cash-receipts_TK' },
    // { Name: "T???o phi???u chi", Path: "/accounting/cash-payments-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh s??ch phi???u chi", Path: "/accounting/cash-payments-list", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: 'Accounting_cash-payment_TK' },
    // { Name: "S???? quy?? ti???n m???t", Path: "/accounting/cash-book", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "acc_tm", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T???o b??o c??", Path: "/accounting/bank-receipts-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh s??ch b??o c??", Path: "/accounting/bank-receipts-list", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: 'accounting_bank-receipts_TK' },
    // { Name: "T???o UNC", Path: "/accounting/bank-payments-create", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh s??ch UNC", Path: "/accounting/bank-payments-list", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: 'Accounting_bank-payments-TK' },
    // { Name: "S???? quy?? ng??n h??ng", Path: "/accounting/bank-book", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-book", IsDefault: false, CodeParent: "acc_nh", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nha?? cung c????p", Path: "/accounting/receivable-vendor-report", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: true, CodeParent: "acc_cn", LstChildren: [], Display: "none", Code: 'Accounting_Vendor_Report' },
    // { Name: "Kha??ch ha??ng", Path: "/accounting/receivable-customer-report", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-money", IsDefault: false, CodeParent: "acc_cn", LstChildren: [], Display: "none", Code: 'Accounting_Customer_Report' },
    // { Name: "B??o c??o k???t qu??? kinh doanh", Path: "/accounting/sales-report", ObjectType: "acc", LevelMenu: 3, Active: false, nameIcon: "fa fa-flag", IsDefault: true, CodeParent: "acc_kqkd", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? nh??n s???
    // { Name: "Dashboard", Path: "/employee/dashboard", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "T???o nh??n vi??n", Path: "/employee/create", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch nh??n vi??n", Path: "/employee/list", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: 'HRM_EmployeeTK' },
    // { Name: "????? xu???t xin ngh???", Path: "/employee/request/list", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
    { Name: "C???u h??nh", Path: "/employee/cauhinh-baohiem", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_qlbh", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch nh??n vi??n ???? ngh??? vi???c", Path: "/employee/employee-quit-work", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch ????? xu???t t??ng l????ng", Path: "/employee/danh-sach-de-xuat-tang-luong", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
    { Name: "T???o m???i ????? xu???t t??ng l????ng", Path: "/employee/tao-de-xuat-tang-luong", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch ????? xu???t ch???c v???", Path: "/employee/danh-sach-de-xuat-chuc-vu", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
    { Name: "T???o m???i ????? xu???t ch???c v???", Path: "/employee/tao-de-xuat-chuc-vu", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: true, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch ????? xu???t xin ngh???", Path: "/employee/request/list", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
    { Name: "T???o m???i ????? xu???t xin ngh???", Path: "/employee/request/create", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_dxxn", LstChildren: [], Display: "none", Code: '' },
    { Name: "C???u h??nh checklist", Path: "/employee/cauhinh-checklist", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
    { Name: "????? xu???t c??ng t??c", Path: "/employee/danh-sach-de-xuat-cong-tac", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "H??? s?? c??ng t??c", Path: "/employee/danh-sach-ho-so-cong-tac", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "????? ngh??? t???m ???ng", Path: "/employee/danh-sach-de-nghi-tam-ung", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "????? ngh??? ho??n ???ng", Path: "/employee/danh-sach-de-nghi-hoan-ung", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch k??? ho???ch OT", Path: "/employee/danh-sach-de-xuat-ot", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
    { Name: "T???o ????? xu???t k??? ho???ch OT", Path: "/employee/kehoach-ot-create", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
    { Name: "C???u h??nh m???c ????nh gi??", Path: "/employee/quy-luong", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
    { Name: "C???u h??nh phi???u ????nh gi??", Path: "/employee/danh-sach-phieu-danh-gia", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
    { Name: "K??? ????nh gi??", Path: "/employee/danh-sach-ky-danh-gia", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
    { Name: "B??o c??o nh??n s???", Path: "/employee/bao-cao-nhan-su", ObjectType: "hrm", LevelMenu: 3, Active: false, nameIcon: "fa-area-chart", IsDefault: false, CodeParent: "hrm_bcns", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? t??i s???n
    { Name: "T???o m???i", Path: "/asset/create", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch", Path: "/asset/list", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '' },
    { Name: "T???o m???i", Path: "/asset/yeu-cau-cap-phat-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch", Path: "/asset/danh-sach-yeu-cau-cap-phat", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '' },
    { Name: "Ki???m k?? t??i s???n", Path: "/asset/danh-sach-dot-kiem-ke", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa-check-square", IsDefault: false, CodeParent: "ass_KiemKe", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o ph??n b???", Path: "/asset/bao-cao-phan-bo", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o kh???u hao", Path: "/asset/bao-cao-khau-hao", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "fa fa-table", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '' },

    // Qu???n l?? tuy???n d???ng
    { Name: "Dashboard", Path: "/employee/dashboard-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "T???o m???i", Path: "/employee/tao-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch", Path: "/employee/danh-sach-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "B??o c??o", Path: "/employee/bao-cao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: false, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "T???o m???i", Path: "/employee/tao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch", Path: "/employee/danh-sach-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
    { Name: "T???o m???i", Path: "/employee/tao-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
    { Name: "Danh s??ch", Path: "/employee/danh-sach-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? kho
    // { Name: "T???o m???i phi???u nh???p kho", Path: "/warehouse/inventory-receiving-voucher/create", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "war_nk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m phi???u nh???p kho", Path: "/warehouse/inventory-receiving-voucher/list", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "war_nk", LstChildren: [], Display: "none", Code: 'WH_QLNTK' },
    // { Name: "T???o m???i phi???u xu???t kho", Path: "/warehouse/inventory-delivery-voucher/create-update", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "war_xk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m phi???u xu???t kho", Path: "/warehouse/inventory-delivery-voucher/list", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-search", IsDefault: true, CodeParent: "war_xk", LstChildren: [], Display: "none", Code: 'WH_QLNXK' },
    // { Name: "Danh s??ch h??ng t???n kho", Path: "/warehouse/in-stock-report/list", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "war_htk", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Danh s??ch kho", Path: "/warehouse/list", ObjectType: "war", LevelMenu: 3, Active: false, nameIcon: "fa fa-list-ul", IsDefault: true, CodeParent: "war_kho", LstChildren: [], Display: "none", Code: '' },

    //D??? ??n
    // { Name: "T???o m???i d??? ??n", Path: "/project/create", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m d??? ??n", Path: "/project/list", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o s??? d???ng ngu???n l???c", Path: "/project/bc-su-dung-nguon-luc", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o t???ng h???p c??c d??? ??n", Path: "/project/bc-tong-hop-cac-du-an", ObjectType: "pro", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "_pro", LstChildren: [], Display: "none", Code: '' },

    //Manufacture
    // { Name: "T???o m???i quy tr??nh", Path: "/manufacture/product-order-workflow/create", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m quy tr??nh", Path: "/manufacture/product-order-workflow/list", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: 'MAN_QLQT_TK' },
    // { Name: "T??m ki???m ti???n tr??nh", Path: "/manufacture/technique-request/list", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_QLQT", LstChildren: [], Display: "none", Code: 'MAN_QLTT_TK' },
    // { Name: "T???o m???i l???nh t???ng", Path: "/manufacture/total-production-order/create", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m l???nh t???ng", Path: "/manufacture/total-production-order/list", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_QLLT", LstChildren: [], Display: "none", Code: 'MAN_QLLT_TK' },
    // { Name: "Theo d??i s???n xu???t", Path: "/manufacture/track-production/track", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_TDSX", LstChildren: [], Display: "none", Code: '' },
    // { Name: "T??m ki???m l???nh s???n xu???t", Path: "/manufacture/production-order/list", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_QLLSX", LstChildren: [], Display: "none", Code: 'MAN_QLLSX_TK' },
    // { Name: "B??o c??o theo QC", Path: "/manufacture/report/quanlity-control", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_RP_QC", LstChildren: [], Display: "none", Code: '' },
    // { Name: "B??o c??o s???n xu???t", Path: "/manufacture/report/manufacture", ObjectType: "man", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: true, CodeParent: "MAN_RP_SX", LstChildren: [], Display: "none", Code: '' },

    //Qu???n l?? L????ng
    { Name: "C???u h??nh", Path: "/salary/cau-hinh-chung", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa fa-plus-square-o", IsDefault: false, CodeParent: "salary_chc", LstChildren: [], Display: "none", Code: '' },
    { Name: "Ch???m c??ng", Path: "/salary/tk-cham-cong", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: false, CodeParent: "salary_dmvs", LstChildren: [], Display: "none", Code: '' },
    { Name: "K??? l????ng", Path: "/salary/ky-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-university", IsDefault: false, CodeParent: "salary_kl", LstChildren: [], Display: "none", Code: '' },
    { Name: "Phi???u l????ng", Path: "/salary/phieu-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "salary_pl", LstChildren: [], Display: "none", Code: '' },
    { Name: "B??o c??o chi ph??", Path: "/salary/bao-cao-chi-phi", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "fa-pie-chart", IsDefault: false, CodeParent: "salary_bccp", LstChildren: [], Display: "none", Code: '' },
  ];

  lstSubmenuDetailURL: Array<BreadCrumMenuModel> = [
    { Name: "Chi ti???t h???? s?? th????u", Path: "/sale-bidding/detail", ObjectType: "cus", LevelMenu: 4, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "SaleBidding_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t c?? h???i", Path: "/lead/detail", ObjectType: "cus", LevelMenu: 4, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "Lead_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t b??o gi??", Path: "/customer/quote-detail", ObjectType: "cus", LevelMenu: 4, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "Quote_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t kh??ch h??ng", Path: "/customer/detail", ObjectType: "cus", LevelMenu: 4, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "Customer_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t ch??m s??c kh??ch h??ng", Path: "/customer/care-detail", ObjectType: "cus", LevelMenu: 3, Active: false, nameIcon: "u41.png", IsDefault: false, CodeParent: "customer_CSKH_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t s???n ph???m d???ch v???", Path: "/product/detail", ObjectType: "sale", LevelMenu: 4, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "Sale_Product_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t h???p ?????ng", Path: "/sales/contract-detail", ObjectType: "sale", LevelMenu: 4, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "sal_hdB_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t ????n h??ng", Path: "/order/order-detail", ObjectType: "sale", LevelMenu: 4, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "Sale_Order_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t ?????t h??ng", Path: "/vendor/detail-order", ObjectType: "shop", LevelMenu: 4, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "Shop_VendorOrder_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t nh??n vi??n", Path: "/employee/detail", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "HRM_EmployeeTK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t xin ngh???", Path: "/employee/request/detail", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "HRM_Request_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t phi???u thu", Path: "/accounting/cash-receipts-view", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "Accounting_cash-receipts_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t phi???u chi", Path: "/accounting/cash-payments-view", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "Accounting_cash-payment_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t b??o c??", Path: "/accounting/bank-receipts-detail", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "list", IsDefault: true, CodeParent: "accounting_bank-receipts_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t UNC", Path: "/accounting/bank-payments-detail", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "list", IsDefault: false, CodeParent: "Accounting_bank-payments-TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t ph???i tr??? nh?? cung c???p", Path: "/accounting/receivable-vendor-detail", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "monetization_on", IsDefault: true, CodeParent: "Accounting_Vendor_Report", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t ph???i thu kh??ch h??ng", Path: "/accounting/receivable-customer-detail", ObjectType: "accouting", LevelMenu: 3, Active: false, nameIcon: "monetization_on", IsDefault: false, CodeParent: "Accounting_Customer_Report", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t nh?? cung c???p", Path: "/vendor/detail", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "Shop_Vendor_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t ????? xu???t mua h??ng", Path: "/procurement-request/view", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "Shop_procurement-request_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t ????? ngh??? b??o gi?? NCC", Path: "/vendor/vendor-quote-detail", ObjectType: "shop", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "Shop_vendor_quote_request_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t phi???u nh???p kho", Path: "/warehouse/inventory-receiving-voucher/details", ObjectType: "warehouse", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "WH_QLNTK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t phi???u xu???t kho", Path: "/warehouse/inventory-delivery-voucher/details", ObjectType: "warehouse", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "WH_QLNXK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t quy tr??nh", Path: "/manufacture/product-order-workflow/detail", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLQT_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t ti???n tr??nh", Path: "/manufacture/technique-request/detail", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLTT_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t l???nh t???ng", Path: "/manufacture/total-production-order/detail", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLLT_TK", LstChildren: [], Display: "none", Code: '' },
    { Name: "Chi ti???t l???nh s???n xu???t", Path: "/manufacture/production-order/detail", ObjectType: "manufacture", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "MAN_QLLSX_TK", LstChildren: [], Display: "none", Code: '' },
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
      //????ng menu Level 1 khi di ra ngo??i
      var logo = $("#logo");
      var module_content = $("#module-content");
      if (!logo.is(e.target) && !module_content.is(e.target)) {
        this.module_display_value = 'none';
        this.updateLeftMenu.emit(false);
      }

      //????ng menu Level 2 khi di ra ngo??i c??ng
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

  // M??? giao di???n ?????i Password
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
        let month = this.NotificationContent.split(" ")[this.NotificationContent.split(" ").indexOf("th??ng") + 1];
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

  //L???y ra list module v?? list resource c???a user
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

  //Ki???m tra user ???????c quy???n th???y c??c module n??o tr??n trang home:
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
      //   Title = "Qu???n l?? h??? th???ng";
      //   break;
      case 'crm':
        this.isCustomer = true;
        this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n tr??? kh??ch h??ng";
        oldParam = 'customer';
        break;
      case 'sal':
        this.isSales = true;
        this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n l?? b??n h??ng";
        oldParam = 'sales';
        break;
      case 'buy':
        this.isShopping = true;
        this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n l?? mua h??ng";
        oldParam = 'shopping';
        break;
      case 'acc':
        this.isAccounting = true;
        this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n l?? t??i ch??nh";
        oldParam = 'accounting';
        break;
      case 'hrm':
        this.isHrm = true;
        this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n l?? nh??n s???";
        oldParam = 'employee';
        break;
      case 'war':
        this.isWarehouse = true;
        this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n l?? kho";
        oldParam = 'warehouse';
        break;
      case 'man':
        this.isManufacture = true;
        this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n l?? s???n xu???t";
        oldParam = 'manufacture';
        break;
      case 'pro':
        this.isProject = true;
        this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n tr??? d??? ??n";
        oldParam = 'pro_du_an';
        break;
      case 'rec':
        this.isRecruitment = true;
        this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n tr??? tuy???n d???ng";
        oldParam = 'recruitment';
        break;
      case 'ass':
        this.isAsset = true;
        this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n l?? t??i s???n";
        oldParam = 'asset';
        break;
      case 'salary':
        this.isSalary = true;
        this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
        Title = "Qu???n l?? l????ng";
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

    //---------------????ng Menu Level 1-----------
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
    //---------------????ng Menu Level 1-----------
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

    //Ki???m tra reset b??? l???c
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
              Title = "Qu???n l?? h??? th???ng";
              break;
            case 'customer':
              this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n tr??? kh??ch h??ng";
              break;
            case 'sales':
              this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n l?? b??n h??ng";
              break;
            case 'shopping':
              this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n l?? mua h??ng";
              break;
            case 'accounting':
              this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n l?? t??i ch??nh";
              break;
            case 'employee':
              this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n l?? nh??n s???";
              break;
            case 'warehouse':
              this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n l?? kho";
              break;
            case 'man':
              this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n l?? s???n xu???t";
              break;
            case 'project':
              this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n tr??? d??? ??n";
              break;
            case 'recruitment':
              this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n l?? tuy???n d???ng";
              break;
            case 'asset':
              this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n l?? t??i s???n";
              break;
            case 'salary':
              this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
              Title = "Qu???n l?? l????ng";
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
                  Title = "Qu???n l?? h??? th???ng";
                  break;
                case 'customer':
                  this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n tr??? kh??ch h??ng";

                  break;
                case 'sales':
                  this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n l?? b??n h??ng";
                  break;
                case 'shopping':
                  this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n l?? mua h??ng";
                  break;
                case 'accounting':
                  this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n l?? t??i ch??nh";
                  break;
                case 'employee':
                  this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n l?? nh??n s???";
                  break;
                case 'warehouse':
                  this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n l?? kho";
                  break;
                case 'man':
                  this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n l?? s???n xu???t";
                  break;
                case 'project':
                  this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n tr??? d??? ??n";
                  break;
                case 'recruitment':
                  this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n l?? tuy???n d???ng";
                  break;
                case 'asset':
                  this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n l?? t??i s???n";
                  break;
                case 'salary':
                  this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
                  Title = "Qu???n l?? l????ng";
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
                Title = "Qu???n l?? h??? th???ng";
                break;
              case 'customer':
                this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n tr??? kh??ch h??ng";

                break;
              case 'sales':
                this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n l?? b??n h??ng";
                break;
              case 'shopping':
                this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n l?? mua h??ng";
                break;
              case 'accounting':
                this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n l?? t??i ch??nh";
                break;
              case 'employee':
                this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n l?? nh??n s???";
                break;
              case 'warehouse':
                this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n l?? kho";
                break;
              case 'man':
                this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n l?? s???n xu???t";
                break;
              case 'project':
                this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n tr??? d??? ??n";
                break;
              case 'recruitment':
                this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n l?? tuy???n d???ng";
                break;
              case 'asset':
                this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n l?? t??i s???n";
                break;
              case 'salary':
                this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
                Title = "Qu???n l?? l????ng";
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
                    Title = "Qu???n l?? h??? th???ng";
                    break;
                  case 'customer':
                    this.translate.get('module_system.title.crm').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n tr??? kh??ch h??ng";

                    break;
                  case 'sales':
                    this.translate.get('module_system.title.sal').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n l?? b??n h??ng";
                    break;
                  case 'shopping':
                    this.translate.get('module_system.title.pay').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n l?? mua h??ng";
                    break;
                  case 'accounting':
                    this.translate.get('module_system.title.acc').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n l?? t??i ch??nh";
                    break;
                  case 'employee':
                    this.translate.get('module_system.title.emp').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n l?? nh??n s???";
                    break;
                  case 'warehouse':
                    this.translate.get('module_system.title.war').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n l?? kho";
                    break;
                  case 'man':
                    this.translate.get('module_system.title.man').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n l?? s???n xu???t";
                    break;
                  case 'project':
                    this.translate.get('module_system.title.pro').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n tr??? d??? ??n";
                    break;
                  case 'recruitment':
                    this.translate.get('module_system.title.rec').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n l?? tuy???n d???ng";
                    break;
                  case 'asset':
                    this.translate.get('module_system.title.ass').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n l?? t??i s???n";
                    break;
                  case 'salary':
                    this.translate.get('module_system.title.salary').subscribe(value => { this.titleModuled = value; });
                    Title = "Qu???n l?? l????ng";
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
    //N???u kh??ng ph???i item mask
    if (item.indexOrder != 1) {
      this.listMenuBar.forEach(x => x.isShowChildren = false);
      if (item.path != null && item.path?.trim() != '') {

        //Ki???m tra reset b??? l???c
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

    //Ki???m tra reset b??? l???c
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

  //Ki???m tra reset b??? l???c
  resetSearchModel(path) {
    this.reSearchService.resetSearchModel(path);
  }
}
