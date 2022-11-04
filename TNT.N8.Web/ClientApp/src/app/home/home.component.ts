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
  statusName: string;//trạng thái hiển thị trên table
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
  moduleCrm = 'crm'; //Module Quản trị quan hệ khách hàng
  moduleSal = 'sal'; //Module Quản lý bán hàng
  moduleBuy = 'buy'; //Module Quản lý mua hàng
  moduleAcc = 'acc'; //Module Quản lý tài chính
  moduleHrm = 'hrm'; //Module Quản trị nhân sự
  moduleSys = 'sys'; //Module Quản trị hệ thống
  moduleAss = 'ass'; //Module Quản lý tài sản
  moduleRec = 'rec'; //Module Quản lý tuyển dụng
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
    name: 'Đang sử dụng - HN',
    data: [14, 13, 12, 11, 24, 4],
    stack: 'male'
  }, {
    name: 'Không sử dụng - HN',
    data: [3, 4, 4, 2, 5, 5],
    stack: 'male'
  }, {
    name: 'Đang sử dụng - DN',
    data: [2, 5, 6, 2, 1, 1],
    stack: 'female'
  }, {
    name: 'Không sử dụng - DN',
    data: [3, 0, 4, 4, 3, 2],
    stack: 'female'
  }]

  loaiTaiSan = ['Bàn làm việc', 'Ghế làm việc', 'Màn hinh', 'Case', 'Bàn phím', 'Chuột']

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
    { Name: "Cấu hình thông tin chung", Path: "/admin/company-config", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "settings", IsDefault: true, CodeParent: "sys_chttc", LstChildren: [], Display: "none", Code: '' },
    { Name: "Cấu hình thư mục", Path: "/admin/folder-config", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "settings", IsDefault: true, CodeParent: "sys_chtm", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý thông báo", Path: "/admin/notifi-setting-list", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "settings", IsDefault: true, CodeParent: "sys_tb", LstChildren: [], Display: "none", Code: '' },
    { Name: "Tham số hệ thống", Path: "/admin/system-parameter", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "settings_applications", IsDefault: true, CodeParent: "sys_tsht", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Quản lý mẫu Email", Path: "/admin/email-configuration", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "device_hub", IsDefault: true, CodeParent: "Systems_QLE", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý sơ đồ tổ chức", Path: "/admin/organization", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "device_hub", IsDefault: true, CodeParent: "sys_sdtc", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý dữ liệu danh mục", Path: "/admin/masterdata", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "category", IsDefault: true, CodeParent: "sys_dldm", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý nhóm quyền", Path: "/admin/permission", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "sys_nq", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Phân hạng khách hàng", Path: "/admin/config-level-customer", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "filter_list", IsDefault: true, CodeParent: "sys_phkh", LstChildren: [], Display: "none", Code: '' },
    { Name: "Quản lý quy trình làm việc", Path: "/admin/danh-sach-quy-trinh", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "swap_horiz", IsDefault: true, CodeParent: "sys_qtlv", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Nhật ký hệ thống", Path: "/admin/audit-trace", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "menu_book", IsDefault: true, CodeParent: "sys_log", LstChildren: [], Display: "none", Code: '' },
    // { Name: "Kế hoạch kinh doanh", Path: "/admin/business-goals", ObjectType: "sys", LevelMenu: 3, Active: false, nameIcon: "menu_book", IsDefault: true, CodeParent: "sys_khkd", LstChildren: [], Display: "none", Code: '' },
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
    //Module Tuyển dụng
    {
      Name: "Quản lý tuyển dụng", Path: "", ObjectType: "rec", LevelMenu: 1, Active: false, nameIcon: "fa-address-book", IsDefault: false, CodeParent: "Recruitment_Module", Display: "none",
      LstChildren: [
        {
          Name: "Chiến dịch tuyển dụng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-search", IsDefault: false, CodeParent: "rec_cdtd", Display: "none", LstChildren: [
            { Name: "Dashboard", Path: "/employee/dashboard-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo mới", Path: "/employee/tao-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh sách", Path: "/employee/danh-sach-chien-dich", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Báo cáo", Path: "/employee/bao-cao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "rec_cdtd", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Vị trí tuyển dụng", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-file-text", IsDefault: false, CodeParent: "rec_cvtd", Display: "none", LstChildren: [
            { Name: "Tạo mới", Path: "/employee/tao-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh sách", Path: "/employee/danh-sach-cong-viec-tuyen-dung", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "rec_cvtd", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Ứng viên", Path: "", ObjectType: "recruitment", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, CodeParent: "rec_uv", Display: "none", LstChildren: [
            { Name: "Tạo mới", Path: "/employee/tao-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh sách", Path: "/employee/danh-sach-ung-vien", ObjectType: "rec", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: true, CodeParent: "rec_uv", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
    //Module Nhân sự
    {
      Name: "Quản lý nhân sự", Path: "", ObjectType: "hrm", LevelMenu: 1, Active: false, nameIcon: "fa-users", IsDefault: false, CodeParent: "Employee_Module", Display: "none",
      LstChildren: [
        {
          Name: "Quản lý nhân viên", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-user-circle", IsDefault: false, CodeParent: "hrm_nv", Display: "none", LstChildren: [
            // { Name: "Dashboard", Path: "/employee/dashboard", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo nhân viên", Path: "/employee/create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
            { Name: "Danh sách nhân viên", Path: "/employee/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: 'HRM_EmployeeTK' },
            // { Name: "Đề xuất xin nghỉ", Path: "/employee/request/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: 'HRM_Request_TK' },
            { Name: "Danh sách nhân viên đã nghỉ việc", Path: "/employee/employee-quit-work", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
            { Name: "Cấu hình checklist", Path: "/employee/cauhinh-checklist", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-tag", IsDefault: false, CodeParent: "hrm_nv", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Quản lý bảo hiểm", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-futbol-o", IsDefault: false, CodeParent: "hrm_qlbh", Display: "none", LstChildren: [
            { Name: "Cấu hình", Path: "/employee/cauhinh-baohiem", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_qlbh", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        // {
        //   Name: "Tiền lương", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "hrm_tl", Display: "none", LstChildren: [
        //     { Name: "Bảng lương nhân viên", Path: "/employee/employee-salary/list", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "hrm_tl", LstChildren: [], Display: "none", Code: '' },
        //   ], Code: ''
        // },
        {
          Name: "Đề xuất tăng lương", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-cube", IsDefault: false, CodeParent: "hrm_dxtl", Display: "none", LstChildren: [
            { Name: "Danh sách đề xuất tăng lương", Path: "/employee/danh-sach-de-xuat-tang-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo đề xuất tăng lương", Path: "/employee/tao-de-xuat-tang-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_dxtl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Đề xuất chức vụ", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-briefcase", IsDefault: false, CodeParent: "hrm_dxcv", Display: "none", LstChildren: [
            { Name: "Danh sách đề xuất chức vụ", Path: "/employee/danh-sach-de-xuat-chuc-vu", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo đề xuất chức vụ", Path: "/employee/tao-de-xuat-chuc-vu", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_dxcv", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Quản lý công tác", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-car", IsDefault: false, CodeParent: "hrm_qlct", Display: "none", LstChildren: [
            { Name: "Đề xuất công tác", Path: "/employee/danh-sach-de-xuat-cong-tac", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: '' },
            { Name: "Hồ sơ công tác", Path: "/employee/danh-sach-ho-so-cong-tac", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: 'HRM_HSCT' },
            { Name: "Đề nghị tạm ứng", Path: "/employee/danh-sach-de-nghi-tam-ung", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: 'HRM_DNTU' },
            { Name: "Đề nghị hoàn ứng", Path: "/employee/danh-sach-de-nghi-hoan-ung", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "hrm_qlct", LstChildren: [], Display: "none", Code: 'HRM_DNHU' },

          ], Code: ''
        },
        {
          Name: "Đề xuất kế hoạch OT", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-book", IsDefault: false, CodeParent: "hrm_dxkhot", Display: "none", LstChildren: [
            { Name: "Danh sách kế hoạch OT", Path: "/employee/danh-sach-de-xuat-ot", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo đề xuất kế hoạch OT", Path: "/employee/kehoach-ot-create", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "person_add", IsDefault: false, CodeParent: "hrm_dxkhot", LstChildren: [], Display: "none", Code: '' },
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
          Name: "Quản lý đánh giá", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-check-circle", IsDefault: false, CodeParent: "hrm_qldg", Display: "none", LstChildren: [
            { Name: "Cấu hình mức đánh giá", Path: "/employee/quy-luong", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "dashboard", IsDefault: true, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
            { Name: "Cấu hình phiếu đánh giá", Path: "/employee/danh-sach-phieu-danh-gia", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
            { Name: "Kỳ đánh giá", Path: "/employee/danh-sach-ky-danh-gia", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "search", IsDefault: false, CodeParent: "hrm_qldg", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Báo cáo nhân sự", Path: "", ObjectType: "employee", LevelMenu: 2, Active: false, nameIcon: "fa-area-chart", IsDefault: false, Display: "none", CodeParent: "hrm_bcns",
          LstChildren: [
            { Name: "Báo cáo nhân sự", Path: "/employee/bao-cao-nhan-su", ObjectType: "HRM", LevelMenu: 3, Active: false, nameIcon: "fa fa-pie-chart", IsDefault: true, CodeParent: "hrm_bcns", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },

      ], Code: ''
    },
    //Module Lương
    {
      Name: "Quản lý lương", Path: "", ObjectType: "salary", LevelMenu: 1, Active: false, nameIcon: "fa-money", IsDefault: false, CodeParent: "Salary_Module", Display: "none",
      LstChildren: [
        {
          Name: "Cấu hình chung", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-cog", IsDefault: false, CodeParent: "_cau_hinh_chung", Display: "none",
          LstChildren: [
            { Name: "Cấu hình", Path: "/salary/cau-hinh-chung", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "_cau_hinh_chung", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Chấm công", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-calendar-check-o", IsDefault: false, CodeParent: "_di_muon_ve_som", Display: "none",
          LstChildren: [
            { Name: "Chấm công", Path: "/salary/tk-cham-cong", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "_di_muon_ve_som", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Kỳ lương", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-university", IsDefault: false, Display: "none", CodeParent: "salary_kl",
          LstChildren: [
            { Name: "Danh sách kỳ lương", Path: "/salary/ky-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "salary_kl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Phiếu lương", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-address-card", IsDefault: false, Display: "none", CodeParent: "salary_pl",
          LstChildren: [
            { Name: "Danh sách phiếu lương", Path: "/salary/phieu-luong-list", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "salary_pl", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Báo cáo chi phí", Path: "", ObjectType: "salary", LevelMenu: 2, Active: false, nameIcon: "fa-pie-chart", IsDefault: false, Display: "none", CodeParent: "salary_bccp",
          LstChildren: [
            { Name: "Báo cáo chi phí", Path: "/salary/bao-cao-chi-phi", ObjectType: "salary", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "salary_bccp", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
    //Tài sản
    {
      Name: "Quản lý tài sản", Path: "", ObjectType: "ass", LevelMenu: 1, Active: false, nameIcon: "fa-cubes", IsDefault: false, CodeParent: "Asset_Module", Display: "none",
      LstChildren: [
        {
          Name: "Danh sách tài sản", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-database", IsDefault: false, CodeParent: "ass_ass", Display: "none", LstChildren: [
            { Name: "Danh sách", Path: "/asset/list", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo mới", Path: "/asset/create", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_ass", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Yêu cầu cấp phát", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-shopping-basket", IsDefault: false, CodeParent: "ass_request", Display: "none", LstChildren: [
            { Name: "Danh sách", Path: "/asset/danh-sach-yeu-cau-cap-phat", ObjectType: "ass", LevelMenu: 3, Active: true, nameIcon: "format_list_bulleted", IsDefault: true, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '' },
            { Name: "Tạo mới", Path: "/asset/yeu-cau-cap-phat-tai-san", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_request", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Kiểm kê tài sản", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-check-square", IsDefault: false, CodeParent: "ass_KiemKe", Display: "none", LstChildren: [
            { Name: "Kiểm kê tài sản", Path: "/asset/danh-sach-dot-kiem-ke", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_KiemKe", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
        {
          Name: "Báo cáo", Path: "", ObjectType: "asset", LevelMenu: 2, Active: false, nameIcon: "fa-pencil-square-o", IsDefault: false, CodeParent: "ass_report", Display: "none", LstChildren: [
            // { Name: "Báo cáo phân bổ", Path: "/asset/bao-cao-phan-bo", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '' },
            // { Name: "Báo cáo khấu hao", Path: "/asset/bao-cao-khau-hao", ObjectType: "ass", LevelMenu: 3, Active: false, nameIcon: "format_list_bulleted", IsDefault: false, CodeParent: "ass_report", LstChildren: [], Display: "none", Code: '' },
          ], Code: ''
        },
      ], Code: ''
    },
  ];

  items: MenuItem[] = [
    // {
    //   label: 'CRM',
    //   items: [
    //     { label: 'Tạo tiềm năng', routerLink: '/customer/potential-customer-create' },
    //     { label: 'Tạo cơ hội', routerLink: '/lead/create-lead' },
    //     { label: 'Tạo báo giá', routerLink: '/customer/quote-create' },
    //     { label: 'Tạo Khách hàng', routerLink: '/customer/create' },
    //   ]
    // },
    // {
    //   label: 'Bán hàng',
    //   items: [
    //     { label: 'Tạo sản phẩm', routerLink: '/product/create' },
    //     { label: 'Tạo hợp đồng bán', routerLink: '/sales/contract-create' },
    //     { label: 'Tạo đơn hàng', routerLink: '/order/create' },
    //     { label: 'Tạo hóa đơn', routerLink: '/bill-sale/create' },
    //   ]
    // },
    // {
    //   label: 'Mua hàng',
    //   items: [
    //     { label: 'Tạo nhà cung cấp', routerLink: '/vendor/create' },
    //     { label: 'Tạo đề xuất mua hàng', routerLink: '/procurement-request/create' },
    //   ]
    // },
    // {
    //   label: 'Tài chính',
    //   items: [
    //     { label: 'Tạo phiếu thu', routerLink: '/accounting/cash-receipts-create' },
    //     { label: 'Tạo phiếu chi', routerLink: '/accounting/cash-payments-create' },
    //     { label: 'Tạo báo có', routerLink: '/accounting/bank-receipts-create' },
    //     { label: 'Tạo UNC', routerLink: '/accounting/bank-payments-create' },
    //   ]
    // },
    {
      label: 'Nhân sự',
      items: [
        { label: 'Nhân viên', routerLink: '/employee/create' },
      ]
    },
    // {
    //   label: 'Kho',
    //   items: [
    //     { label: 'Tạo phiếu nhập kho', routerLink: '/warehouse/inventory-receiving-voucher/create' },
    //     { label: 'Tạo phiếu xuất kho', routerLink: '/warehouse/inventory-delivery-voucher/create-update' }
    //   ]
    // },
    // {
    //   label: 'Dự án',
    //   items: [
    //     { label: 'Tạo mốc dự án', routerLink: '/home' },
    //     { label: 'Tạo hạng mục', routerLink: '/home' },
    //     { label: 'Tạo nguồn lực', routerLink: '/home' },
    //     { label: 'Tạo công việc', routerLink: '/project/create-project-task' },
    //     { label: 'Tạo tài liệu', routerLink: '/home' },
    //   ]
    // },
    {
      label: 'Tài sản',
      items: [
        { label: 'Danh sách tài sản', routerLink: '/asset/list' },
        { label: 'Tạo tài sản', routerLink: '/asset/create' },
      ]
    },
    {
      label: 'Tuyển dụng',
      items: [
        { label: 'Tạo mới chiến dịch', routerLink: '/employee/tao-chien-dich' },
        { label: 'Tạo mới vị trí tuyển dụng', routerLink: '/employee/tao-cong-viec-tuyen-dung' },
        { label: 'Tạo mới ứng viên', routerLink: '/employee/tao-ung-vien' },
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
        //ẩn hiện khi click Thông báo
        if (this.toggleNotifi.nativeElement.contains(e.target)) {
          this.isOpenNotifi = !this.isOpenNotifi;
        } else {
          this.isOpenNotifi = false;
        }

        //ẩn hiện khi click Tạo mới
        // if (this.toggleCreateElement.nativeElement.contains(e.target)) {
        //   this.isOpenCreateElement = !this.isOpenCreateElement;
        // } else {
        //   this.isOpenCreateElement = false;
        // }

        //ẩn hiện khi click Config
        if (this.toggleConfig.nativeElement.contains(e.target)) {
          this.isOpenConfig = !this.isOpenConfig;
        } else {
          this.isOpenConfig = false;
        }

        //ẩn hiện khi click User
        if (this.toggleUser.nativeElement.contains(e.target)) {
          this.isOpenUser = !this.isOpenUser;
        } else {
          this.isOpenUser = false;
        }
      }

      // if (this.dropdownMenus) {
      //   // ẩn hiện khi click menu items Tạo mới
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

    //Call Update IsToggle với eventEmitterService
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

    //Thống kê sinh nhật
    this.chartThongKeSinhNhat = (Highcharts as any).chart('sinhNhat', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        text: 'THỐNG KÊ NHÂN SỰ SINH NHẬT TRONG THÁNG ' + (toDay.getMonth() + 1),
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
        text: `THỐNG KÊ NHÂN SỰ`
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
        text: 'THỐNG KÊ NHÂN SỰ SẮP HẾT HẠN HỢP ĐỒNG'
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
        text: 'THỐNG KÊ NHÂN SỰ SẮP HẾT HẠN THỬ VIỆC'
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
        text: 'THỐNG KÊ TÀI SẢN'
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
        let msg = { severity: 'error', summary: 'Thông báo:', detail: result.messageCode };
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
        message = "Bạn có muốn chỉnh sửa thời gian lịch hẹn bắt đầu từ : " + this.datePipe.transform(els.event.start, "h:mm dd/MM/yyyy ") + " đến " + this.datePipe.transform(els.event.end, "h:mm dd/MM/yyyy");
      } else {
        message = "Bạn có muốn chỉnh sửa thời gian lịch hẹn bắt đầu từ : " + this.datePipe.transform(els.event.start, "h:mm dd/MM/yyyy ");
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
              let msg = { severity: 'success', summary: 'Thông báo:', detail: 'Cập nhật lịch hẹn thành công' };
              this.showMessage(msg);
            } else {
              let msg = { severity: 'error', summary: 'Thông báo:', detail: result.messageCode };
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
  //       message = "Bạn có muốn chỉnh sửa thời gian lịch hẹn bắt đầu từ : " + this.datePipe.transform(els.event.start, "h:mm dd/MM/yyyy ") + " đến " + this.datePipe.transform(els.event.end, "h:mm dd/MM/yyyy");
  //     } else {
  //       message = "Bạn có muốn chỉnh sửa thời gian lịch hẹn bắt đầu từ : " + this.datePipe.transform(els.event.start, "h:mm dd/MM/yyyy ");
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
  //             let msg = { severity: 'success', summary: 'Thông báo:', detail: 'Cập nhật lịch hẹn thành công' };
  //             this.showMessage(msg);
  //           } else {
  //             let msg = { severity: 'error', summary: 'Thông báo:', detail: result.messageCode };
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
        { field: 'quoteCode', header: 'Mã báo giá', textAlign: 'left' },
        { field: 'totalAmountAfterVat', header: 'Trị giá báo giá', textAlign: 'right' },
        { field: 'customerName', header: 'Khách hàng', textAlign: 'left' },
      ];
    } else {
      this.colsQuote = [
        { field: 'quoteCode', header: 'Mã báo giá', textAlign: 'left' },
        { field: 'totalAmount', header: 'Trị giá báo giá', textAlign: 'right' },
        { field: 'customerName', header: 'Khách hàng', textAlign: 'left' },
      ];
    }

    this.colsCustomer = [
      { field: 'customerName', header: 'Tên khách hàng', textAlign: 'left' },
      { field: 'customerPhone', header: 'Số điện thoại', textAlign: 'right' },
      { field: 'customerEmail', header: 'Email', textAlign: 'left' },
    ];

    this.colsOrder = [
      { field: 'orderCode', header: 'Mã đơn hàng', textAlign: 'left' },
      { field: 'amount', header: 'Trị giá đơn hàng', textAlign: 'right' },
      { field: 'customerName', header: 'Khách hàng', textAlign: 'left' },
    ];

    this.colsCustomerMeeting = [
      { field: 'customerName', header: 'Tên khách hàng', textAlign: 'left' },
      { field: 'title', header: 'Tiêu đề', textAlign: 'left' },
      { field: 'createByName', header: 'Người tạo lịch hẹn', textAlign: 'left' },
      { field: 'startDate', header: 'Thời gian', textAlign: 'left' },
      { field: 'locationMeeting', header: 'Địa điểm', textAlign: 'left' },
      { field: 'content', header: 'Nội dung', textAlign: 'left' },
    ];
    this.selectedColsCustomerMeeting = this.colsCustomerMeeting.filter(e => e.field == "customerName" || e.field == "title"
      || e.field == "startDate" || e.field == "locationMeeting" || e.field == "content");

    this.colsLeadMeeting = [
      { field: 'leadName', header: 'Tên cơ hội', textAlign: 'left' },
      { field: 'title', header: 'Tiêu đề', textAlign: 'left' },
      { field: 'createByName', header: 'Người tạo lịch hẹn', textAlign: 'left' },
      { field: 'startDate', header: 'Thời gian', textAlign: 'left' },
      { field: 'startDate', header: 'Địa điểm', textAlign: 'left' },
      { field: 'content', header: 'Nội dung', textAlign: 'left' },
    ];
    this.selectedColsLeadMeeting = this.colsLeadMeeting.filter(e => e.field == "leadName" || e.field == "title"
      || e.field == "startDate" || e.field == "startDate" || e.field == "content");

    this.colsCusBirthdayOfWeek = [
      { field: 'customerName', header: 'Tên khách hàng', textAlign: 'left' },
      { field: 'customerPhone', header: 'Số điện thoại', textAlign: 'right' },
      { field: 'customerEmail', header: 'Email', textAlign: 'left' },
      { field: 'dateOfBirth', header: 'Sinh nhật', textAlign: 'left' },
    ];

    this.colsEmployeeBirthDayOfWeek = [
      { field: 'employeeName', header: 'Tên khách hàng', textAlign: 'left' },
      { field: 'organizationName', header: 'Phòng ban', textAlign: 'right' },
      { field: 'positionName', header: 'Chức vụ', textAlign: 'left' },
      { field: 'dateOfBirth', header: 'Sinh nhật', textAlign: 'left' },
    ];
  }

  setStepSize(data) {
    //Chia nhiều nhất là 10 mốc dữ liệu
    return this.formatRoundNumber(data[0] / 10);
  }

  //Làm tròn số
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

  //Thêm số chữ số 0 vào sau một ký tự
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

  //Lấy ra list module của user
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

  //Kiểm tra user có được quyền nhìn thấy các resource nào trên menu:
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
    //Kiểm tra reset bộ lọc
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

  //Kiểm tra reset bộ lọc
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
        console.log('result', result)
        if (result.type == 0) {
          this.Title = 'Danh sách nhân viên sinh nhật trong tháng';
          this.selectedColumns = [
            { field: 'index', header: '#', width: '40px', textAlign: 'center' },
            { field: 'employeeName', header: 'Tên nhân viên', width: '150px', textAlign: 'left' },
            { field: 'employeeCode', header: 'Mã nhân viên', width: '150px', textAlign: 'left' },
            { field: 'organizationName', header: 'Phòng ban', width: '100px', textAlign: 'left' },
            { field: 'positionName', header: 'Chức vụ', width: '100px', textAlign: 'right' },
            { field: 'viTriLamViec', header: 'Địa điểm làm việc', width: '140px', textAlign: 'left' },
            { field: 'dateOfBirth', header: 'Ngày sinh', width: '120px', textAlign: 'right' },
            { field: 'startDateMayChamCong', header: 'Ngày vào', width: '140px', textAlign: 'left' },
          ];
        }
        if (result.type == 1 || result.type == 2) {
          if (result.type == 1) this.Title = 'Danh sách nhân viên sắp hết hạn hợp đồng';
          if (result.type == 2) this.Title = 'Danh sách nhân viên sắp hết hạn thử việc';
          this.selectedColumns = [
            { field: 'index', header: '#', width: '40px', textAlign: 'center' },
            { field: 'employeeName', header: 'Tên nhân viên', width: '150px', textAlign: 'left' },
            { field: 'employeeCode', header: 'Mã nhân viên', width: '150px', textAlign: 'left' },
            { field: 'organizationName', header: 'Phòng ban', width: '100px', textAlign: 'left' },
            { field: 'positionName', header: 'Chức vụ', width: '100px', textAlign: 'right' },
            { field: 'viTriLamViec', header: 'Địa điểm làm việc', width: '140px', textAlign: 'left' },
            { field: 'loaiHopDongName', header: 'Loại hợp đồng', width: '120px', textAlign: 'right' },
            { field: 'ngayKyHopDong', header: 'Ngày ký hợp đồng', width: '140px', textAlign: 'left' },
            { field: 'ngayBatDau', header: 'Ngày bắt đầu', width: '140px', textAlign: 'left' },
            { field: 'ngayKetThuc', header: 'Ngày kết thúc', width: '140px', textAlign: 'left' },
          ];
        }
        this.listDataDetail = result.listDataDetail;
        this.displayModal = true;
      } else {
        let msg = { severity: 'error', summary: 'Thông báo:', detail: result.messageCode };
        this.showMessage(msg);
      }
    });
  }
}

function convertToUTCTime(time: any) {
  return new Date(Date.UTC(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()));
};
