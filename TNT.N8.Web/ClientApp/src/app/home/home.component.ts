import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';
import { CompanyConfigModel } from '../shared/models/companyConfig.model';
import { BreadCrumMenuModel } from '../shared/models/breadCrumMenu.model';
import { ChangepasswordComponent } from '../shared/components/changepassword/changepassword.component';
import { UserprofileComponent } from "../userprofile/userprofile.component"
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { EventEmitterService } from '../shared/services/event-emitter.service';
import { NotificationService } from '../shared/services/notification.service';
import { DashboardHomeService } from '../shared/services/dashboard-home.service';
import { AuthenticationService } from '../shared/services/authentication.service';
// Full canlendar
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import * as $ from 'jquery';
import { GetPermission } from '../shared/permission/get-permission';
import { FullCalendar } from 'primeng/fullcalendar';
import { title } from 'process';
import { utc } from 'moment';
import { DialogService } from 'primeng';
import { ListOrderSearch } from '../shared/models/re-search/list-order-search.model';
import { ReSearchService } from '../services/re-search.service';
import Highcharts from 'highcharts';
import { EventInput } from '@fullcalendar/core';

class delayProductionOrder {
  productionOrderId: string;
  productionOrderCode: string;
  customerName: string;
  areaRemain: number;
  endDate: Date;
}

class totalProductionOrderInDashBoard {
  customerName: string;
  endDate: Date;
  statusCode: string;
  listTotalQuantityByTechniqueRequest: Array<totalQuantityByTechniqueRequestModel>;
  productionOrderCode: string;
  productionOrderId: string;
  statusName: string;
  isDeplay: boolean;
  constructor() {
    this.listTotalQuantityByTechniqueRequest = [];
    this.isDeplay = true;
  }
}

class totalQuantityByTechniqueRequestModel {
  techniqueRequestId: string;
  totalQuantityCompleted: number;
  totalQuantityHaveToComplete: number;
  statusName: string;//tr???ng th??i hi???n th??? tr??n table
}

class techniqueRequest {
  techniqueRequestId: string;
  techniqueName: string;
  techniqueRequestCode: string;
  completeAreaInDay: number;
}

interface Quote {
  quoteId: string;
  quoteCode: string;
  amount: number;
  objectTypeId: string;
  objectType: string;
  customerName: string;
  customerContactId: string;
  seller: string;
  sellerName: string;
  quoteDate: Date;
}

interface Customer {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  picName: string;
  picContactId: string;
  dateOfBirth: Date;
}

interface Order {
  orderId: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  amount: number;
  seller: string;
  sellerName: string;
  sellerContactId: string;
}

interface CustomerMeeting {
  customerMeetingId: string;
  customerId: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  content: string;
  locationMeeting: string;
  customerName: string;
  employeeName: string;
  createByName: string;
  participants: string;
  isCreateByUser: boolean;
}

interface LeadMeeting {
  leadMeetingId: string;
  leadId: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  content: string;
  locationMeeting: string;
  leadName: string;
  employeeName: string;
  createByName: string;
  isShowLink: boolean;
}

interface Employee {
  employeeId: string;
  employeeName: string;
  organizationId: string;
  organizationName: string;
  positionId: string;
  positionName: string;
  dateOfBirth: Date;
  contactId: string;
}

class Calendar {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  participants: string;
  isCreateByUser: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    DatePipe
  ]
})
export class HomeComponent implements OnInit {
  @ViewChild('toggleNotifi') toggleNotifi: ElementRef;
  isOpenNotifi: boolean = false;

  @ViewChild('toggleConfig') toggleConfig: ElementRef;
  isOpenConfig: boolean = false;

  @ViewChild('toggleCreateElement') toggleCreateElement: ElementRef;
  isOpenCreateElement: boolean = false;

  @ViewChild('toggleUser') toggleUser: ElementRef;
  isOpenUser: boolean = false;

  @ViewChild('dropdownMenus') dropdownMenus: ElementRef;

  @ViewChild('calendar') calendar: FullCalendar;

  /**/
  listPermissionResource: Array<string> = localStorage.getItem('ListPermissionResource').split(',');
  listPermissionResourceActive: string = localStorage.getItem("ListPermissionResource");
  systemParameterList = JSON.parse(localStorage.getItem('systemParameterList'));
  applicationName = this.getDefaultApplicationName();
  listModule: Array<string> = [];
  listResource: Array<string> = [];
  lstBreadCrumLeftMenu: Array<BreadCrumMenuModel> = [];
  lstBreadCrum: Array<BreadCrumMenuModel> = [];
  listParticipants: Array<Employee> = [];
  /*Module name*/
  moduleCrm = 'crm'; //Module Qu???n tr??? quan h??? kh??ch h??ng
  moduleSal = 'sal'; //Module Qu???n l?? b??n h??ng
  moduleBuy = 'buy'; //Module Qu???n l?? mua h??ng
  moduleAcc = 'acc'; //Module Qu???n l?? t??i ch??nh
  moduleHrm = 'hrm'; //Module Qu???n tr??? nh??n s???
  moduleSys = 'sys'; //Module Qu???n tr??? h??? th???ng
  moduleAss = 'ass'; //Module Qu???n l?? t??i s???n
  moduleRec = 'rec'; //Module Qu???n l?? tuy???n d???ng
  /*End*/

  //data chart
  chartThongKeSinhNhat: any
  chartPie: any
  chart1: any
  chart2: any
  chart3: any
  isShowMenu: boolean = false
  displayModal: boolean = false
  invalidDates: Array<Date>;
  pieCharDate: Date = new Date();

  selectedColumns: Array<any> = [];
  listDataDetail: Array<any> = [];
  filterGlobal: string;

  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() }
  ];

  dataThongKeNhanSuSinhNhat: Array<Date>;


  dataPieChart = [
    { name: 'Ops-HN', y: 8 },
    { name: 'Ops-DN', y: 6 },
    { name: 'G&A-HN', y: 5 },
    { name: 'G&A-DN', y: 20 },
    { name: 'COS-HN', y: 160 },
    { name: 'COS-DN', y: 25 },
  ]


  dataThongKeHetHanHopDong = [
    {
      name: "Ops-HN",
      y: 6,
      drilldown: "Ops-HN"
    },
    {
      name: "Ops-DN",
      y: 9,
      drilldown: "Ops-DN"
    },
    {
      name: "G&A-HN",
      y: 4,
      drilldown: "G&A-HN"
    },
    {
      name: "G&A-DN",
      y: 4,
      drilldown: "G&A-DN"
    },
    {
      name: "COS-HN",
      y: 2,
      drilldown: "COS-HN"
    },
    {
      name: "COS-DN",
      y: 4,
      drilldown: "COS-DN"
    }
  ]


  dataThongKeHetHanThuViec = [
    {
      name: "Ops-HN",
      y: 6,
      drilldown: "Ops-HN"
    },
    {
      name: "Ops-DN",
      y: 9,
      drilldown: "Ops-DN"
    },
    {
      name: "G&A-HN",
      y: 4,
      drilldown: "G&A-HN"
    },
    {
      name: "G&A-DN",
      y: 4,
      drilldown: "G&A-DN"
    },
    {
      name: "COS-HN",
      y: 2,
      drilldown: "COS-HN"
    },
    {
      name: "COS-DN",
      y: 4,
      drilldown: "COS-DN"
    }
  ]
  dataThongKeTaiSan = [{
    name: '??ang s??? d???ng - HN',
    data: [14, 13, 12, 11, 24, 4],
    stack: 'male'
  }, {
    name: 'Kh??ng s??? d???ng - HN',
    data: [3, 4, 4, 2, 5, 5],
    stack: 'male'
  }, {
    name: '??ang s??? d???ng - DN',
    data: [2, 5, 6, 2, 1, 1],
    stack: 'female'
  }, {
    name: 'Kh??ng s??? d???ng - DN',
    data: [3, 0, 4, 4, 3, 2],
    stack: 'female'
  }]

  loaiTaiSan = ['B??n l??m vi???c', 'Gh??? l??m vi???c', 'M??n hinh', 'Case', 'B??n ph??m', 'Chu???t']

  Title = ''

  dataCalen = {
    "data": [
      {
        "id": 1,
        "title": "All Day Event",
        "start": "2017-02-01"
      },
      {
        "id": 2,
        "title": "Long Event",
        "start": "2017-02-07",
        "end": "2017-02-10"
      },
      {
        "id": 3,
        "title": "Repeating Event",
        "start": "2017-02-09T16:00:00"
      }]
  }


  isCustomer = false;
  isSales = false;
  isShopping = false;
  isAccounting = false;
  isHrm = false;
  isWarehouse = false;
  isProject = false;
  companyConfigModel = new CompanyConfigModel();
  isToggleCick: Boolean = false;

  notificationNumber: number = 0;
  NotificationContent: string;
  notificationList: Array<any> = [];
  auth: any = JSON.parse(localStorage.getItem("auth"));
  loading: boolean = false;

  username: string;
  userAvatar: string;
  userFullName: string;
  userEmail: string;
  dialogRef: MatDialogRef<ChangepasswordComponent>;
  dialogPopup: MatDialogRef<UserprofileComponent>;

  // full calendar
  events: Array<Calendar> = [];
  options: any;

  lstSubmenuLevel3: Array<BreadCrumMenuModel> = [
    //Quan ly he thong
    { Name: "C???u h??nh th??ng tin chung", Path: "/admin/company-config", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "settings", IsDefault: true, CodeParent: "sys_chttc", LstChildren: [], Display: "none", Code: '' },
    { Name: "C???u h??nh th?? m???c", Path: "/admin/folder-config", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "settings", IsDefault: true, CodeParent: "sys_chtm", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? th??ng b??o", Path: "/admin/notifi-setting-list", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "settings", IsDefault: true, CodeParent: "sys_tb", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tham s??? h??? th???ng", Path: "/admin/system-parameter", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "settings_applications", IsDefault: true, CodeParent: "sys_tsht", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Qua??n ly?? m???u Email", Path: "/admin/email-configuration", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "device_hub", IsDefault: true, CodeParent: "Systems_QLE", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qua??n ly?? s?? ????? t???? ch????c", Path: "/admin/organization", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "device_hub", IsDefault: true, CodeParent: "sys_sdtc", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qua??n ly?? d???? li????u danh m???c", Path: "/admin/masterdata", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "category", IsDefault: true, CodeParent: "sys_dldm", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qu???n l?? nh??m quy???n", Path: "/admin/permission", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "sys_nq", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Ph??n ha??ng kha??ch ha??ng", Path: "/admin/config-level-customer", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "filter_list", IsDefault: true, CodeParent: "sys_phkh", LstChildren: [], Display: "none", Code: '' },
    { Name: "Qua??n ly?? quy tr??nh l??m vi???c", Path: "/admin/danh-sach-quy-trinh", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "swap_horiz", IsDefault: true, CodeParent: "sys_qtlv", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nh???t k?? h??? th???ng", Path: "/admin/audit-trace", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "menu_book", IsDefault: true, CodeParent: "sys_log", LstChildren: [], Display: "none", Code: '' },
    // { Name: "K??? ho???ch kinh doanh", Path: "/admin/business-goals", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "menu_book", IsDefault: true, CodeParent: "sys_khkd", LstChildren: [], Display: "none", Code: '' },
  ];

  /*Data chart revenue employee*/
  dataRevenueEmployee: any;
  optionsRevenueEmployee: any;
  /*End*/

  /*Data chart Chance*/
  dataChance: any;
  optionsDataChance: any;
  /*End*/

  isManager: boolean = false;

  colsQuote: Array<any> = [];
  colsCustomer: Array<any> = [];
  colsOrder: Array<any> = [];
  colsCustomerMeeting: Array<any> = [];
  colsCusBirthdayOfWeek: Array<any> = [];
  colsEmployeeBirthDayOfWeek: Array<any> = [];
  selectedColsCustomerMeeting: Array<any> = [];
  colsLeadMeeting: Array<any> = [];
  selectedColsLeadMeeting: Array<any> = [];

  totalSalesOfWeek: number = 0;
  totalSalesOfMonth: number = 0;
  totalSalesOfQuarter: number = 0;
  totalSalesOfYear: number = 0;
  chiTieuDoanhThuTuan: number = 0;
  chiTieuDoanhThuThang: number = 0;
  chiTieuDoanhThuQuy: number = 0;
  chiTieuDoanhThuNam: number = 0;

  totalSalesOfWeekPress: number = 0;
  totalSalesOfMonthPress: number = 0;
  totalSalesOfQuarterPress: number = 0;
  totalSalesOfYearPress: number = 0;

  salesOfWeek: number = 0;
  salesOfMonth: number = 0;
  salesOfQuarter: number = 0;
  salesOfYear: number = 0;

  listQuote: Array<Quote> = [];
  listCustomer: Array<Customer> = [];
  listOrderNew: Array<Order> = [];
  listCustomerMeeting: Array<CustomerMeeting> = [];
  listLeadMeeting: Array<LeadMeeting> = [];
  listCusBirthdayOfWeek: Array<Customer> = [];
  listEmployeeBirthDayOfWeek: Array<Employee> = [];
  lstSubmenuLevel1: Array<BreadCrumMenuModel> = [
    //Module Tuy???n d???ng
    {
      Name: "Qu???n l?? tuy???n d???ng", Path: "", ObjectType: "rec", LevelMenu: 1, Active: false, nameIcon: "fa-address-book", IsDefault: false, CodeParent: "Recruitment_Module", Display: "none",
      LstChildren: [
        {
          Name: "Chi???n d???ch tuy???n d???ng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-search", IsDefault: false, CodeParent: "rec_cdtd", Display: "none", LstChildren: [
            { Name: "Dashboard", Path: "/employee/dashboard-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o m???i", Path: "/employee/tao-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh s??ch", Path: "/employee/danh-sach-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "B??o c??o", Path: "/employee/bao-cao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "V??? tr?? tuy???n d???ng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-file-text", IsDefault: false, CodeParent: "rec_cvtd", Display: "none", LstChildren: [
            { Name: "T???o m???i", Path: "/employee/tao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh s??ch", Path: "/employee/danh-sach-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "???ng vi??n", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "rec_uv", Display: "none", LstChildren: [
            { Name: "T???o m???i", Path: "/employee/tao-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh s??ch", Path: "/employee/danh-sach-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
    //Module Nh??n s???
    {
      Name: "Qu???n l?? nh??n s???", Path: "", ObjectType: "hrm", LevelMenu: 1, Active: false, nameIcon: "fa-users", IsDefault: false, CodeParent: "Employee_Module", Display: "none",
      LstChildren: [
        {
          Name: "Qu???n l?? nh??n vi??n", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-user-circle", IsDefault: false, CodeParent: "hrm_nv", Display: "none", LstChildren: [
            // { Name: "Dashboard", Path: "/employee/dashboard", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o nh??n vi??n", Path: "/employee/create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh s??ch nh??n vi??n", Path: "/employee/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: 'HRM_EmployeeTK' },
            // { Name: "????? xu???t xin ngh???", Path: "/employee/request/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
            { Name: "Danh s??ch nh??n vi??n ???? ngh??? vi???c", Path: "/employee/employee-quit-work", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
            { Name: "C???u h??nh checklist", Path: "/employee/cauhinh-checklist", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Qu???n l?? b???o hi???m", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-futbol-o", IsDefault: false, CodeParent: "hrm_qlbh", Display: "none", LstChildren: [
            { Name: "C???u h??nh", Path: "/employee/cauhinh-baohiem", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_qlbh", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        // {
        //   Name: "Ti???n l????ng", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "hrm_tl", Display: "none", LstChildren: [
        //     { Name: "B???ng l????ng nh??n vi??n", Path: "/employee/employee-salary/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "hrm_tl", LstChildren: [], Display: "none", Code: '' },
        //   ], Code: ''
        // },
        {
          Name: "????? xu???t t??ng l????ng", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-cube", IsDefault: false, CodeParent: "hrm_dxtl", Display: "none", LstChildren: [
            { Name: "Danh s??ch ????? xu???t t??ng l????ng", Path: "/employee/danh-sach-de-xuat-tang-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o ????? xu???t t??ng l????ng", Path: "/employee/tao-de-xuat-tang-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "????? xu???t ch???c v???", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-briefcase", IsDefault: false, CodeParent: "hrm_dxcv", Display: "none", LstChildren: [
            { Name: "Danh s??ch ????? xu???t ch???c v???", Path: "/employee/danh-sach-de-xuat-chuc-vu", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o ????? xu???t ch???c v???", Path: "/employee/tao-de-xuat-chuc-vu", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Qu???n l?? c??ng t??c", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-car", IsDefault: false, CodeParent: "hrm_qlct", Display: "none", LstChildren: [
            { Name: "????? xu???t c??ng t??c", Path: "/employee/danh-sach-de-xuat-cong-tac", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
            { Name: "H??? s?? c??ng t??c", Path: "/employee/danh-sach-ho-so-cong-tac", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: 'HRM_HSCT' },
            { Name: "????? ngh??? t???m ???ng", Path: "/employee/danh-sach-de-nghi-tam-ung", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: 'HRM_DNTU' },
            { Name: "????? ngh??? ho??n ???ng", Path: "/employee/danh-sach-de-nghi-hoan-ung", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: 'HRM_DNHU' },

          ], Code: ''
        },
        {
          Name: "????? xu???t k??? ho???ch OT", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "hrm_dxkhot", Display: "none", LstChildren: [
            { Name: "Danh s??ch k??? ho???ch OT", Path: "/employee/danh-sach-de-xuat-ot", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o ????? xu???t k??? ho???ch OT", Path: "/employee/kehoach-ot-create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
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
          Name: "Qu???n l?? ????nh gi??", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-check-circle", IsDefault: false, CodeParent: "hrm_qldg", Display: "none", LstChildren: [
            { Name: "C???u h??nh m???c ????nh gi??", Path: "/employee/quy-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
            { Name: "C???u h??nh phi???u ????nh gi??", Path: "/employee/danh-sach-phieu-danh-gia", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
            { Name: "K??? ????nh gi??", Path: "/employee/danh-sach-ky-danh-gia", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "B??o c??o nh??n s???", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-area-chart", IsDefault: false, Display: "none", CodeParent: "hrm_bcns",
          LstChildren: [
            { Name: "B??o c??o nh??n s???", Path: "/employee/bao-cao-nhan-su", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_bcns", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },

      ], Code: ''
    },
    //Module L????ng
    {
      Name: "Qu???n l?? l????ng", Path: "", ObjectType: "salary", LevelMenu: 1, Active: false, nameIcon: "fa-money", IsDefault: false, CodeParent: "Salary_Module", Display: "none",
      LstChildren: [
        {
          Name: "C???u h??nh chung", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, CodeParent: "_cau_hinh_chung", Display: "none",
          LstChildren: [
            { Name: "C???u h??nh", Path: "/salary/cau-hinh-chung", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "_cau_hinh_chung", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Ch???m c??ng", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: false, CodeParent: "_di_muon_ve_som", Display: "none",
          LstChildren: [
            { Name: "Ch???m c??ng", Path: "/salary/tk-cham-cong", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "_di_muon_ve_som", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "K??? l????ng", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-university", IsDefault: false, Display: "none", CodeParent: "salary_kl",
          LstChildren: [
            { Name: "Danh s??ch k??? l????ng", Path: "/salary/ky-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "salary_kl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Phi???u l????ng", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, Display: "none", CodeParent: "salary_pl",
          LstChildren: [
            { Name: "Danh s??ch phi???u l????ng", Path: "/salary/phieu-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "salary_pl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "B??o c??o chi ph??", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-pie-chart", IsDefault: false, Display: "none", CodeParent: "salary_bccp",
          LstChildren: [
            { Name: "B??o c??o chi ph??", Path: "/salary/bao-cao-chi-phi", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "salary_bccp", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
    //T??i s???n
    {
      Name: "Qu???n l?? t??i s???n", Path: "", ObjectType: "ass", LevelMenu: 1, Active: false, nameIcon: "fa-cubes", IsDefault: false, CodeParent: "Asset_Module", Display: "none",
      LstChildren: [
        {
          Name: "Danh s??ch t??i s???n", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-database", IsDefault: false, CodeParent: "ass_ass", Display: "none", LstChildren: [
            { Name: "Danh s??ch", Path: "/asset/list", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o m???i", Path: "/asset/create", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Y??u c???u c???p ph??t", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-shopping-basket", IsDefault: false, CodeParent: "ass_request", Display: "none", LstChildren: [
            { Name: "Danh s??ch", Path: "/asset/danh-sach-yeu-cau-cap-phat", ObjectType: "ass", LevelMenu: 3, Active: true, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '' },
            { Name: "T???o m???i", Path: "/asset/yeu-cau-cap-phat-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Ki???m k?? t??i s???n", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-check-square", IsDefault: false, CodeParent: "ass_KiemKe", Display: "none", LstChildren: [
            { Name: "Ki???m k?? t??i s???n", Path: "/asset/danh-sach-dot-kiem-ke", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_KiemKe", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "B??o c??o", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "ass_report", Display: "none", LstChildren: [
            // { Name: "B??o c??o ph??n b???", Path: "/asset/bao-cao-phan-bo", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '' },
            // { Name: "B??o c??o kh???u hao", Path: "/asset/bao-cao-khau-hao", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
  ];

  items: MenuItem[] = [
    // {
    //   label: 'CRM',
    //   items: [
    //     { label: 'T???o ti???m n??ng', routerLink: '/customer/potential-customer-create' },
    //     { label: 'T???o c?? h???i', routerLink: '/lead/create-lead' },
    //     { label: 'T???o b??o gi??', routerLink: '/customer/quote-create' },
    //     { label: 'T???o Kh??ch h??ng', routerLink: '/customer/create' },
    //   ]
    // },
    // {
    //   label: 'B??n h??ng',
    //   items: [
    //     { label: 'T???o s???n ph???m', routerLink: '/product/create' },
    //     { label: 'T???o h???p ?????ng b??n', routerLink: '/sales/contract-create' },
    //     { label: 'T???o ????n h??ng', routerLink: '/order/create' },
    //     { label: 'T???o h??a ????n', routerLink: '/bill-sale/create' },
    //   ]
    // },
    // {
    //   label: 'Mua h??ng',
    //   items: [
    //     { label: 'T???o nh?? cung c???p', routerLink: '/vendor/create' },
    //     { label: 'T???o ????? xu???t mua h??ng', routerLink: '/procurement-request/create' },
    //   ]
    // },
    // {
    //   label: 'T??i ch??nh',
    //   items: [
    //     { label: 'T???o phi???u thu', routerLink: '/accounting/cash-receipts-create' },
    //     { label: 'T???o phi???u chi', routerLink: '/accounting/cash-payments-create' },
    //     { label: 'T???o b??o c??', routerLink: '/accounting/bank-receipts-create' },
    //     { label: 'T???o UNC', routerLink: '/accounting/bank-payments-create' },
    //   ]
    // },
    {
      label: 'Nh??n s???',
      items: [
        { label: 'Nh??n vi??n', routerLink: '/employee/create' },
      ]
    },
    // {
    //   label: 'Kho',
    //   items: [
    //     { label: 'T???o phi???u nh???p kho', routerLink: '/warehouse/inventory-receiving-voucher/create' },
    //     { label: 'T???o phi???u xu???t kho', routerLink: '/warehouse/inventory-delivery-voucher/create-update' }
    //   ]
    // },
    // {
    //   label: 'D??? ??n',
    //   items: [
    //     { label: 'T???o m???c d??? ??n', routerLink: '/home' },
    //     { label: 'T???o h???ng m???c', routerLink: '/home' },
    //     { label: 'T???o ngu???n l???c', routerLink: '/home' },
    //     { label: 'T???o c??ng vi???c', routerLink: '/project/create-project-task' },
    //     { label: 'T???o t??i li???u', routerLink: '/home' },
    //   ]
    // },
    {
      label: 'T??i s???n',
      items: [
        { label: 'Danh s??ch t??i s???n', routerLink: '/asset/list' },
        { label: 'T???o t??i s???n', routerLink: '/asset/create' },
      ]
    },
    {
      label: 'Tuy???n d???ng',
      items: [
        { label: 'T???o m???i chi???n d???ch', routerLink: '/employee/tao-chien-dich' },
        { label: 'T???o m???i v??? tr?? tuy???n d???ng', routerLink: '/employee/tao-cong-viec-tuyen-dung' },
        { label: 'T???o m???i ???ng vi??n', routerLink: '/employee/tao-ung-vien' },
      ]
    }
  ];

  listEmployee: Array<any> = [];
  selectedEmployee: Array<any> = [];
  totalEvents: Array<Calendar> = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private getPermission: GetPermission,
    private notiService: NotificationService,
    private dashboardHomeService: DashboardHomeService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private renderer: Renderer2,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    public reSearchService: ReSearchService,
    public ref: ChangeDetectorRef,
  ) {
    $("body").addClass('sidebar-collapse');
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.toggleNotifi) {
        //???n hi???n khi click Th??ng b??o
        if (this.toggleNotifi.nativeElement.contains(e.target)) {
          this.isOpenNotifi = !this.isOpenNotifi;
        } else {
          this.isOpenNotifi = false;
        }

        //???n hi???n khi click T???o m???i
        // if (this.toggleCreateElement.nativeElement.contains(e.target)) {
        //   this.isOpenCreateElement = !this.isOpenCreateElement;
        // } else {
        //   this.isOpenCreateElement = false;
        // }

        //???n hi???n khi click Config
        if (this.toggleConfig.nativeElement.contains(e.target)) {
          this.isOpenConfig = !this.isOpenConfig;
        } else {
          this.isOpenConfig = false;
        }

        //???n hi???n khi click User
        if (this.toggleUser.nativeElement.contains(e.target)) {
          this.isOpenUser = !this.isOpenUser;
        } else {
          this.isOpenUser = false;
        }
      }

      // if (this.dropdownMenus) {
      //   // ???n hi???n khi click menu items T???o m???i
      //   if (this.dropdownMenus.nativeElement.contains(e.target)) {
      //     this.isOpenCreateElement = !this.isOpenCreateElement;
      //   } else {
      //     this.isOpenCreateElement = false;
      //   }
      // }
    });
  }

  ngOnInit() {
    this.getPemistion();
    this.getListModuleAndResource();
    this.getNotification();
    this.isManager = localStorage.getItem('IsManager') === "true" ? true : false;
    this.username = localStorage.getItem("Username");
    this.userAvatar = '';
    this.userFullName = localStorage.getItem("UserFullName");
    this.userEmail = localStorage.getItem("UserEmail");

    //var leftMenu = localStorage.getItem('lstBreadCrumLeftMenu');

    var leftMenu = JSON.stringify(this.lstSubmenuLevel1);

    this.lstBreadCrumLeftMenu = [];
    this.lstBreadCrumLeftMenu = JSON.parse(leftMenu);

    var X = localStorage.getItem('menuMapPath');
    this.lstBreadCrum = JSON.parse(X);

    //kiem tra xem co toggle ko
    if ($("body").hasClass("sidebar-collapse")) {
      this.isToggleCick = true;
    }
    else {
      this.isToggleCick = false;
    }

    if (localStorage.getItem('IsAdmin') == 'true') {
      localStorage.setItem('menuIndex', 'admin');
    }

    // if (this.eventEmitterService.subsVar == undefined) {
    //   this.eventEmitterService.subsVar = this.eventEmitterService.
    //     invokeFirstComponentFunction.subscribe((name: string) => {
    //       console.log('home')
    //       this.updateLeftMenu();
    //     });
    // }

    //Call Update IsToggle v???i eventEmitterService
    if (this.eventEmitterService.subsVar2 == undefined) {
      this.eventEmitterService.subsVar2 = this.eventEmitterService.
        invokeUpdateIsToggleFunction.subscribe((name: string) => {
          this.updateLeftIsToggle();
        });
    }

    this.getMasterData();
  }

  ngAfterViewInit() {
    this.ref.detectChanges();
  }


  initChart() {
    let toDay = new Date();
    Highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Inter UI',
        },
      }
    });

    //Th???ng k?? sinh nh???t
    this.chartThongKeSinhNhat = (Highcharts as any).chart('sinhNhat', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        text: 'TH???NG K?? NH??N S??? SINH NH???T TRONG TH??NG ' + (toDay.getMonth() + 1),
        align: 'left',
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%'
        }
      },
      series: [
        {
          type: 'pie',
          innerSize: '50%',
          data: this.dataThongKeNhanSuSinhNhat
        }],
      credits: {
        enabled: false
      },
    });


    //pie chart
    this.chartPie = (Highcharts as any).chart('pieChart', {
      navigation: {
        buttonOptions: {
          enabled: true
        }
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        align: 'left',
        useHtml: true,
        text: `TH???NG K?? NH??N S???`
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: {
              color: '#333',
              fontSize: '13px',
            },
            distance: -40,
            bazeindex: 0,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4
            },
          }
        }
      },
      series: [{
        name: '{series.name}: {y}',
        colorByPoint: true,
        data: this.dataPieChart,
        showInLegend: true,
      }],
      credits: {
        enabled: false
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'middle',
        y: 30,
        itemMarginBottom: 20,
        useHTML: true,
        symbolWidth: 0,
        labelFormatter: function () {
          return '<span style="width:auto;margin-bottom:10px;padding: 5px">' + this.name + ": " + this.y + '</span>';
        },
        navigation: {
          activeColor: '#3E576F',
          animation: true,
          arrowSize: 15,
          inactiveColor: '#CCC',
        },
        itemStyle: {
          fontWeight: 'light'
        }
      },


    });
    //bar chart
    this.chart1 = (Highcharts as any).chart('barChart1', {
      chart: {
        type: 'column',
      },
      title: {
        align: 'left',
        text: 'TH???NG K?? NH??N S??? S???P H???T H???N H???P ?????NG'
      },
      credits: {
        enabled: false
      },

      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        categories: this.dataThongKeHetHanThuViec.map(item => item.name)
      },
      yAxis: {
        title: {
          text: ''
        }

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          }
        }
      },

      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
      },

      series: [
        {
          name: "Browsers",
          colorByPoint: true,
          data: this.dataThongKeHetHanHopDong
        }
      ],
    });

    this.chart2 = (Highcharts as any).chart('barChart2', {
      chart: {
        type: 'column',
      },

      credits: {
        enabled: false
      },
      title: {
        align: 'left',
        text: 'TH???NG K?? NH??N S??? S???P H???T H???N TH??? VI???C'
      },

      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        categories: this.dataThongKeHetHanThuViec.map(item => item.name)
      },
      yAxis: {
        title: {
          text: ''
        }

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          }
        }
      },

      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
      },

      series: [
        {
          colorByPoint: true,
          data: this.dataThongKeHetHanThuViec
        }
      ],
    });

    this.chart3 = Highcharts.chart('barChart3', {

      credits: {
        enabled: false
      },
      chart: {
        type: 'column',
      },

      title: {
        align: 'left',
        text: 'TH???NG K?? T??I S???N'
      },

      xAxis: {
        categories: this.loaiTaiSan
      },

      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: ''
        }
      },

      tooltip: {
        formatter: function () {
          return '<b>' + this.x + '</b><br/>' +
            this.series.name + ': ' + this.y + '<br/>' +
            'Total: ' + this.point.stackTotal;
        }
      },


      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          }
        },

      },

      series: this.dataThongKeTaiSan
    });

  }

  getMasterData() {
    this.setTable();
    this.loading = true;
    let pieCharDate = convertToUTCTime(this.pieCharDate);
    this.dashboardHomeService.getDataDashboardHome(pieCharDate).subscribe(response => {
      let result: any = response;
      this.loading = false;
      if (result.statusCode == 200) {
        this.loaiTaiSan = result.listTenTaiSan;
        this.dataThongKeTaiSan = result.dataThongKeTaiSan;
        this.dataThongKeHetHanThuViec = result.dataThongKeNhanSuSapHetHanThuViec;
        this.dataThongKeHetHanHopDong = result.dataThongKeNhanSuSapHetHanHD;
        this.dataPieChart = result.dataThongKeNhanSu
        this.dataThongKeNhanSuSinhNhat = result.dataThongKeNhanSuSinhNhat;
        this.initChart();
      } else {
        let msg = { severity: 'error', summary: 'Th??ng b??o:', detail: result.messageCode };
        this.showMessage(msg);
      }
    });
  }

  changeEventFullCalendar(els: any) {
    if (els) {
      let startDate = null;
      if (els.event.start) {
        startDate = convertToUTCTime(els.event.start)
      }
      let endDate = null;
      if (els.event.end) {
        endDate = convertToUTCTime(els.event.end);
      }
      let message: string = '';
      if (els.event.end) {
        message = "B???n c?? mu???n ch???nh s???a th???i gian l???ch h???n b???t ?????u t??? : " + this.datePipe.transform(els.event.start, "h:mm dd/MM/yyyy ") + " ?????n " + this.datePipe.transform(els.event.end, "h:mm dd/MM/yyyy");
      } else {
        message = "B???n c?? mu???n ch???nh s???a th???i gian l???ch h???n b???t ?????u t??? : " + this.datePipe.transform(els.event.start, "h:mm dd/MM/yyyy ");
      }
      this.confirmationService.confirm({
        message: message,
        accept: () => {
          this.loading = true;
          this.dashboardHomeService.updateCustomerMeeting(els.event.id, startDate, endDate, this.auth.UserId).subscribe(response => {
            let result: any = response;
            this.loading = false;
            if (result.statusCode == 200) {
              this.getMasterData();
              let msg = { severity: 'success', summary: 'Th??ng b??o:', detail: 'C???p nh???t l???ch h???n th??nh c??ng' };
              this.showMessage(msg);
            } else {
              let msg = { severity: 'error', summary: 'Th??ng b??o:', detail: result.messageCode };
              this.showMessage(msg);
            }
          });
        },
        reject: () => {
          this.getMasterData();
        }
      });

    }

  }

  // changeTimeEventFullCalendar(els: any) {
  //   if (els) {
  //     let startDate = null;
  //     if (els.event.start) {
  //       startDate = convertToUTCTime(els.event.start)
  //     }
  //     let endDate = null;
  //     if (els.event.end) {
  //       endDate = convertToUTCTime(els.event.end);
  //     }
  //     let message: string = '';
  //     if (els.event.end) {
  //       message = "B???n c?? mu???n ch???nh s???a th???i gian l???ch h???n b???t ?????u t??? : " + this.datePipe.transform(els.event.start, "h:mm dd/MM/yyyy ") + " ?????n " + this.datePipe.transform(els.event.end, "h:mm dd/MM/yyyy");
  //     } else {
  //       message = "B???n c?? mu???n ch???nh s???a th???i gian l???ch h???n b???t ?????u t??? : " + this.datePipe.transform(els.event.start, "h:mm dd/MM/yyyy ");
  //     }
  //     this.confirmationService.confirm({
  //       message: message,
  //       accept: () => {
  //         this.loading = true;
  //         this.dashboardHomeService.updateCustomerMeeting(els.event.id, startDate, endDate).subscribe(response => {
  //           let result: any = response;
  //           this.loading = false;
  //           if (result.statusCode == 200) {
  //             this.getMasterData();
  //             let msg = { severity: 'success', summary: 'Th??ng b??o:', detail: 'C???p nh???t l???ch h???n th??nh c??ng' };
  //             this.showMessage(msg);
  //           } else {
  //             let msg = { severity: 'error', summary: 'Th??ng b??o:', detail: result.messageCode };
  //             this.showMessage(msg);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }

  setCalendar() {
    this.events = [];
    if (this.listCustomerMeeting) {
      this.listCustomerMeeting.forEach(item => {
        let meeting = new Calendar();
        meeting.id = item.customerMeetingId;
        meeting.title = item.customerName;
        meeting.start = item.startDate;
        meeting.end = item.endDate;
        meeting.participants = item.participants;
        meeting.isCreateByUser = item.isCreateByUser;

        if (meeting.start < new Date()) {
          meeting.backgroundColor = "#DD0000";
        }
        this.events = [...this.events, meeting];
      });
    }

    this.totalEvents = this.events;
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
  setTable() {

    if (this.applicationName == 'VNS') {
      this.colsQuote = [
        { field: 'quoteCode', header: 'M?? b??o gi??', textAlign: 'left' },
        { field: 'totalAmountAfterVat', header: 'Tr??? gi?? b??o gi??', textAlign: 'right' },
        { field: 'customerName', header: 'Kh??ch h??ng', textAlign: 'left' },
      ];
    } else {
      this.colsQuote = [
        { field: 'quoteCode', header: 'M?? b??o gi??', textAlign: 'left' },
        { field: 'totalAmount', header: 'Tr??? gi?? b??o gi??', textAlign: 'right' },
        { field: 'customerName', header: 'Kh??ch h??ng', textAlign: 'left' },
      ];
    }

    this.colsCustomer = [
      { field: 'customerName', header: 'T??n kh??ch h??ng', textAlign: 'left' },
      { field: 'customerPhone', header: 'S??? ??i???n tho???i', textAlign: 'right' },
      { field: 'customerEmail', header: 'Email', textAlign: 'left' },
    ];

    this.colsOrder = [
      { field: 'orderCode', header: 'M?? ????n h??ng', textAlign: 'left' },
      { field: 'amount', header: 'Tr??? gi?? ????n h??ng', textAlign: 'right' },
      { field: 'customerName', header: 'Kh??ch h??ng', textAlign: 'left' },
    ];

    this.colsCustomerMeeting = [
      { field: 'customerName', header: 'T??n kh??ch h??ng', textAlign: 'left' },
      { field: 'title', header: 'Ti??u ?????', textAlign: 'left' },
      { field: 'createByName', header: 'Ng?????i t???o l???ch h???n', textAlign: 'left' },
      { field: 'startDate', header: 'Th???i gian', textAlign: 'left' },
      { field: 'locationMeeting', header: '?????a ??i???m', textAlign: 'left' },
      { field: 'content', header: 'N???i dung', textAlign: 'left' },
    ];
    this.selectedColsCustomerMeeting = this.colsCustomerMeeting.filter(e => e.field == "customerName" || e.field == "title"
      || e.field == "startDate" || e.field == "locationMeeting" || e.field == "content");

    this.colsLeadMeeting = [
      { field: 'leadName', header: 'T??n c?? h???i', textAlign: 'left' },
      { field: 'title', header: 'Ti??u ?????', textAlign: 'left' },
      { field: 'createByName', header: 'Ng?????i t???o l???ch h???n', textAlign: 'left' },
      { field: 'startDate', header: 'Th???i gian', textAlign: 'left' },
      { field: 'startDate', header: '?????a ??i???m', textAlign: 'left' },
      { field: 'content', header: 'N???i dung', textAlign: 'left' },
    ];
    this.selectedColsLeadMeeting = this.colsLeadMeeting.filter(e => e.field == "leadName" || e.field == "title"
      || e.field == "startDate" || e.field == "startDate" || e.field == "content");

    this.colsCusBirthdayOfWeek = [
      { field: 'customerName', header: 'T??n kh??ch h??ng', textAlign: 'left' },
      { field: 'customerPhone', header: 'S??? ??i???n tho???i', textAlign: 'right' },
      { field: 'customerEmail', header: 'Email', textAlign: 'left' },
      { field: 'dateOfBirth', header: 'Sinh nh???t', textAlign: 'left' },
    ];

    this.colsEmployeeBirthDayOfWeek = [
      { field: 'employeeName', header: 'T??n kh??ch h??ng', textAlign: 'left' },
      { field: 'organizationName', header: 'Ph??ng ban', textAlign: 'right' },
      { field: 'positionName', header: 'Ch???c v???', textAlign: 'left' },
      { field: 'dateOfBirth', header: 'Sinh nh???t', textAlign: 'left' },
    ];
  }

  setStepSize(data) {
    //Chia nhi???u nh???t l?? 10 m???c d??? li???u
    return this.formatRoundNumber(data[0] / 10);
  }

  //L??m tr??n s???
  formatRoundNumber(number) {
    number = number.toString();
    let stt = number.length;
    let first_number = number.slice(0, 1);
    let result: number;
    switch (first_number) {
      case '1':
        result = this.addZero(2, stt);
        break;
      case '2':
        result = this.addZero(3, stt);
        break;
      case '3':
        result = this.addZero(4, stt);
        break;
      case '4':
        result = this.addZero(5, stt);
        break;
      case '5':
        result = this.addZero(6, stt);
        break;
      case '6':
        result = this.addZero(7, stt);
        break;
      case '7':
        result = this.addZero(8, stt);
        break;
      case '9':
        result = this.addZero(9, stt);
        break;
      default:
        break;
    }
    return result;
  }

  //Th??m s??? ch??? s??? 0 v??o sau m???t k?? t???
  addZero(tmp: number, stt: number) {
    if (tmp == 9) {
      stt = stt + 1;
      tmp = 1;
    }
    let num = tmp.toString();
    for (let i = 0; i < stt - 1; i++) {
      num += "0";
    }
    return Number(num);
  }

  //L???y ra list module c???a user
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

  //Ki???m tra user c?? ???????c quy???n nh??n th???y c??c resource n??o tr??n menu:
  checkUserResource(resourceName) {
    let result = false;
    if (this.listResource.indexOf(resourceName) !== -1) {
      result = true;
    }
    return result;
  }

  // checkUserResourceModule(resourceName: string[]) {
  //   let result = false;
  //   for (var i = 0; i < resourceName.length; i++) {
  //     if (this.listResource.indexOf(resourceName[i]) !== -1) {
  //       result = true;
  //       return result;
  //     }
  //   }
  //   return result;
  // }

  updateLeftMenuTest(event: any) {
    if (event) {
      var leftMenu = localStorage.getItem('lstBreadCrumLeftMenu');
      this.lstBreadCrumLeftMenu = [];
      this.lstBreadCrumLeftMenu = JSON.parse(leftMenu);
    }
  }

  updateLeftIsToggle() {
    this.isToggleCick = JSON.parse(localStorage.getItem('isToggleCick'));
  }

  openMenuLevel4(resource, resourceParent: BreadCrumMenuModel) {
    //Ki???m tra reset b??? l???c
    this.resetSearchModel(resource.Path);

    this.router.navigate([resource.Path]);
  }

  getNotification() {
    this.notiService.getNotification(this.auth.EmployeeId, this.auth.UserId).subscribe(response => {
      var result = <any>response;
      this.notificationNumber = result.numberOfUncheckedNoti;
      this.notificationList = result.shortNotificationList;
    });
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
    });
  }

  goToNotification() {
    //this.notificationNumber = 0;
    this.router.navigate(['/notification']);
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
  }
  //Ket thuc

  // Mo giao dien UserProfile
  goToViewProfile() {
    this.router.navigate(['/userprofile']);
  }

  goToUrlSysConfig(Path) {
    this.router.navigate([Path]);
  }

  goListQuote() {
    this.router.navigate(['/customer/quote-list']);
  }

  onViewQuoteDetail(id: string) {
    this.router.navigate(['/customer/quote-detail', { quoteId: id }]);
  }

  goListCustomer() {
    this.router.navigate(['/customer/list']);
  }

  onViewCustomerDetail(id: string) {
    this.router.navigate(['/customer/detail', { customerId: id }]);
  }

  onViewLeadDetail(id: string) {

  }

  onViewObjectDetail(id: string, contactId: string, type: string) {
    if (type == 'CUSTOMER') {
      this.router.navigate(['/customer/detail', { customerId: id }]);
    } else if (type = 'LEAD') {
      this.router.navigate(['/lead/detail', { leadId: id }]);
    }
  }

  goListOrder() {
    this.router.navigate(['/order/list']);
  }

  onViewOrderDetail(id: string) {
    this.router.navigate(['/order/order-detail', { customerOrderID: id }]);
  }

  onViewEmployeeDetail(employeeId: string, contactId: string) {
    this.router.navigate(['/employee/detail', { employeeId: employeeId, contactId: contactId }]);
  }

  showMessage(msg: any) {
    this.messageService.add(msg);
  }

  isHomepage() {
    if (this.router.url === '/home') {
      return true;
    } else {
      return false;
    }
  }


  rowclick: number = -1;
  rowclickParent: number = -1;
  active: boolean = true;
  activeParent: boolean = true;
  countLengthParrent: number = 0;

  addRemoveIcon(index) {
    for (let i = 0; i < this.lstBreadCrumLeftMenu.length; i++) {
      $(".module-remove" + i).hide();
      $(".module-add" + i).show();
    }
    if (this.rowclick !== index) {
      $(".module-remove" + index).show();
      $(".module-add" + index).hide();
      this.active = true;

      for (let i = 0; i < this.countLengthParrent; i++) {
        $(".module-remove-parent" + i).hide();
        $(".module-add-parent" + i).show();
      }
      this.activeParent = true;
    }
    else {
      if (!this.active) {
        $(".module-remove" + index).show();
        $(".module-add" + index).hide();
      }
      else {
        $(".module-remove" + index).hide();
        $(".module-add" + index).show();
      }
      this.active = !this.active;
    }

    this.rowclick = index;
  }

  addRemoveIconParren(index, countLength) {
    this.countLengthParrent = countLength;
    for (let i = 0; i < countLength; i++) {
      $(".module-remove-parent" + i).hide();
      $(".module-add-parent" + i).show();
    }
    if (this.rowclickParent !== index) {
      $(".module-remove-parent" + index).show();
      $(".module-add-parent" + index).hide();
      this.activeParent = true;
    }
    else {
      if (!this.activeParent) {
        $(".module-remove-parent" + index).show();
        $(".module-add-parent" + index).hide();
      }
      else {
        $(".module-remove-parent" + index).hide();
        $(".module-add-parent" + index).show();
      }
      this.activeParent = !this.activeParent;
    }

    this.rowclickParent = index;
  }

  getDefaultApplicationName() {
    return this.systemParameterList.find(systemParameter => systemParameter.systemKey == "ApplicationName")?.systemValueString;
  }

  searchMeetingForEmployee() {
    this.events = this.totalEvents;
    let listEmployeeId = this.selectedEmployee.map(x => x.employeeId);

    if (listEmployeeId.length > 0) {
      let currentEvent: Array<any> = [];
      this.events.forEach(item => {
        let listParticipants = item.participants.split(';');

        let flag = false;
        listEmployeeId.forEach(_item => {
          if (listParticipants.includes(_item)) {
            flag = true;
          }
        });

        if (flag) {
          currentEvent.push(item);
        }
      });

      this.events = [];
      this.events = [...currentEvent];
    }
    else {
      this.events = this.totalEvents;
    }
  }

  //Ki???m tra reset b??? l???c
  resetSearchModel(path) {
    this.reSearchService.resetSearchModel(path);
  }

  gotoProductionDetailDelay(rowData: delayProductionOrder) {
    this.router.navigate(['/manufacture/production-order/detail', { productionOrderId: rowData.productionOrderId }]);
  }

  gotoProductionDetail(rowData: totalProductionOrderInDashBoard) {
    this.router.navigate(['/manufacture/production-order/detail', { productionOrderId: rowData.productionOrderId }]);
  }

  XemChiTiet(number) {
    this.loading = true;
    this.dashboardHomeService.dashboardHomeViewDetail(number, 8).subscribe(response => {
      let result: any = response;
      this.loading = false;
      if (result.statusCode == 200) {
        if (result.type == 0) {
          this.Title = 'Danh s??ch nh??n vi??n sinh nh???t trong th??ng';
          this.selectedColumns = [
            { field: 'index', header: '#', width: '40px', textAlign: 'center' },
            { field: 'employeeName', header: 'T??n nh??n vi??n', width: '150px', textAlign: 'left' },
            { field: 'employeeCode', header: 'M?? nh??n vi??n', width: '150px', textAlign: 'left' },
            { field: 'organizationName', header: 'Ph??ng ban', width: '100px', textAlign: 'left' },
            { field: 'positionName', header: 'Ch???c v???', width: '100px', textAlign: 'right' },
            { field: 'viTriLamViec', header: '?????a ??i???m l??m vi???c', width: '140px', textAlign: 'left' },
            { field: 'dateOfBirth', header: 'Ng??y sinh', width: '120px', textAlign: 'right' },
            { field: 'startDateMayChamCong', header: 'Ng??y v??o', width: '140px', textAlign: 'left' },
          ];
        }
        if (result.type == 1 || result.type == 2) {
          if (result.type == 1) this.Title = 'Danh s??ch nh??n vi??n s???p h???t h???n h???p ?????ng';
          if (result.type == 2) this.Title = 'Danh s??ch nh??n vi??n s???p h???t h???n th??? vi???c';
          this.selectedColumns = [
            { field: 'index', header: '#', width: '40px', textAlign: 'center' },
            { field: 'employeeName', header: 'T??n nh??n vi??n', width: '150px', textAlign: 'left' },
            { field: 'employeeCode', header: 'M?? nh??n vi??n', width: '150px', textAlign: 'left' },
            { field: 'organizationName', header: 'Ph??ng ban', width: '100px', textAlign: 'left' },
            { field: 'positionName', header: 'Ch???c v???', width: '100px', textAlign: 'right' },
            { field: 'viTriLamViec', header: '?????a ??i???m l??m vi???c', width: '140px', textAlign: 'left' },
            { field: 'loaiHopDongName', header: 'Lo???i h???p ?????ng', width: '120px', textAlign: 'right' },
            { field: 'ngayKyHopDong', header: 'Ng??y k?? h???p ?????ng', width: '140px', textAlign: 'left' },
            { field: 'ngayBatDau', header: 'Ng??y b???t ?????u', width: '140px', textAlign: 'left' },
            { field: 'ngayKetThuc', header: 'Ng??y k???t th??c', width: '140px', textAlign: 'left' },
          ];
        }
        this.listDataDetail = result.listDataDetail;
        this.displayModal = true;
      } else {
        let msg = { severity: 'error', summary: 'Th??ng b??o:', detail: result.messageCode };
        this.showMessage(msg);
      }
    });
  }
}

function convertToUTCTime(time: any) {
  return new Date(Date.UTC(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()));
};
