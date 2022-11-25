import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EmployeeService } from '../../../../../services/employee.service';
import { CommonService } from '../../../../../../shared/services/common.service';

class importGiaDinhModel {
  EmployeeCode: string;
  QuanHe: string;
  FullName: string;
  EmpId: string;
  NgaySinh: Date;
  Sdt: string;
  Email: string;
  PhuThuoc: boolean;
  Tu: Date;
  Den: Date;
  QuanHeId: any;

  listStatus = [];
  isValid: boolean;
}

interface ResultDialog {
  status: boolean,
  statusImport: boolean
}

class Note {
  public code: string;
  public name: string;
}

class GiaDinhModel {
  EmployeeCode: string;
  QuanHe: string;
  QuanHeId: string;
  FullName: string;
  DateOfBirth: Date;
  Phone: string;
  Email: string;
  PhuThuoc: boolean;
  PhuThuocTuNgay: Date;
  PhuThuocDenNgay: Date;
}

@Component({
  selector: 'app-gia-dinh-import-detail',
  templateUrl: './gia-dinh-import-detail.component.html',
  styleUrls: ['./gia-dinh-import-detail.component.css']
})
export class GiaDinhImportDetailComponent implements OnInit {
  emptyGuid: string = '00000000-0000-0000-0000-000000000000';
  auth: any = JSON.parse(localStorage.getItem('auth'));
  userId = this.auth.UserId;
  loading: boolean = false;
  @ViewChild('myTable') myTable: Table;

  today: Date = new Date();

  listNote: Array<Note> = [
    /* required fields */
    { code: "required_EmployeeCode", name: "Nhập mã nhân viên!" },
    { code: "required_QuanHe", name: "Nhập quan hệ!" },
    { code: "required_FullName", name: "Nhập họ tên!" },
    { code: "required_DateOfBirth", name: "Nhập ngày sinh!" },
    // { code: "required_Sdt", name: "Nhập số điện thoại!" },
    { code: "required_Tu", name: "Nhập ngày bắt đầu phụ thuộc!" },
    { code: "required_Den", name: "Nhập ngày kết thúc phụ thuộc!" },
    { code: "required_TuDen", name: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc!" },
    { code: "required_MucLuong", name: "Nhập mức lương!" },

    // check mã code trong DB
    { code: "existSoHopDong_inDB", name: "Số hợp đồng đã tồn tại trên hệ thống!" },
    { code: "existSoPhuLuc_inDB", name: "Số phụ lục đã tồn tại trên hệ thống!" },
    { code: "existEmployeeCode_inDB", name: "Mã nhân viên không tồn tại trong hệ thống!" },
    { code: "existQuanHe_inDB", name: "Mối quan hệ không tồn tại trên hệ thống" },


    //Check mã tài sản trong list
    { code: "existSoHopDong_inList", name: "Số hợp đồng đã tồn tại trên danh sách nhập!" },
    { code: "existSoPhuLuc_inList", name: "Số phụ lục đã tồn tại trên danh sách nhập!" },

    //Check số lơn hơn 0
    { code: "mucLuong_positive", name: "Mức lương phải lơn hơn 0" },


    { code: "wrong_ChucVuName", name: "Chức vụ không đúng!" },
    { code: "wrong_LoaiHDName", name: "Loại hợp đồng không đúng!" },

  ]

  listGiaDinhImport: Array<importGiaDinhModel> = [];

  listQuanHe = [];
  //table
  rows: number = 10;
  columns: Array<any> = [];
  selectedEmployeeImport: Array<importGiaDinhModel> = [];
  employeeCodeInDB: Array<any> = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    public employeeService: EmployeeService,
    public commonService: CommonService,
  ) {
    if (this.config.data) {
      this.listGiaDinhImport = this.config.data.listTaiSanImport;
    }
  }

  async ngOnInit() {
    this.initTable();
    await this.getMasterdata();
  }

  showMessage(msg: any) {
    this.messageService.add(msg);
  }

  initTable() {
    // numberInt
    // text
    this.columns = [
      { field: 'EmployeeCode', header: 'Mã nhân viên', textAlign: 'left', display: 'table-cell', width: '100px', type: 'text', isRequired: true, isList: true },
      { field: 'QuanHe', header: 'Quan hệ', textAlign: 'left', display: 'table-cell', width: '100px', type: 'text', isRequired: true, isList: true },
      { field: 'FullName', header: 'Họ và tên', textAlign: 'left', display: 'table-cell', width: '150px', type: 'text', isRequired: true, isList: false },
      { field: 'NgaySinh', header: 'Ngày sinh', textAlign: 'left', display: 'table-cell', width: '150px', type: 'date', isRequired: true, isList: false },
      { field: 'Sdt', header: 'Số điện thoại', textAlign: 'center', display: 'table-cell', width: '100px', type: 'text', isRequired: false, isList: false },
      { field: 'Email', header: 'Email', textAlign: 'center', display: 'table-cell', width: '150px', type: 'text', isRequired: false, isList: false },
      { field: 'PhuThuoc', header: 'Phụ thuộc', textAlign: 'center', display: 'table-cell', width: '60px', type: 'boolean', isRequired: false, isList: false },
      { field: 'Tu', header: 'Phụ thuộc từ ngày', textAlign: 'center', display: 'table-cell', width: '120px', type: 'date', isRequired: false, isList: false },
      { field: 'Den', header: 'Phụ thuộc đến ngày', textAlign: 'center', display: 'table-cell', width: '120px', type: 'date', isRequired: false, isList: false },
      { field: 'listStatus', header: 'Trạng thái', textAlign: 'left', display: 'table-cell', width: '250px', type: 'listStatus' },
    ];
  }

  async getMasterdata() {
    let result: any = await this.employeeService.getMasterDateImportHDNS();
    this.loading = false;
    if (result.statusCode == 200) {
      this.listQuanHe = result.listQuanHe;
      this.employeeCodeInDB = result.listEmployeeCode
      this.checkStatus(true);
    }
    else {
      let mgs = { severity: 'error', summary: 'Thông báo', detail: result.message };
      this.showMessage(mgs);
    }
  }

  selectRow(checkValue) {
    if (checkValue) {
      this.selectedEmployeeImport = this.listGiaDinhImport.filter(e => e.isValid);
    } else {
      this.selectedEmployeeImport = [];
    }
  }

  checkStatus(autoAdd: boolean) {
    this.listGiaDinhImport.forEach(employee => {
      employee.listStatus = [];
      employee.isValid = true;

      employee.QuanHe = employee.QuanHeId != null ? employee.QuanHeId.categoryName : employee.QuanHe;

      /* required fields */
      if (!employee?.EmployeeCode.trim()) {
        employee.listStatus = [...employee.listStatus, this.listNote.find(e => e.code == "required_EmployeeCode")];
        employee.isValid = false;
      }

      if (!employee?.QuanHe) {
        employee.listStatus = [...employee.listStatus, this.listNote.find(e => e.code == "required_QuanHe")];
        employee.isValid = false;
      }

      if (!employee?.FullName) {
        employee.listStatus = [...employee.listStatus, this.listNote.find(e => e.code == "required_FullName")];
        employee.isValid = false;
      }

      if (!employee?.NgaySinh) {
        employee.listStatus = [...employee.listStatus, this.listNote.find(e => e.code == "required_DateOfBirth")];
        employee.isValid = false;
      }

      if (employee.PhuThuoc == true) {
        if (!employee?.Tu) {
          employee.listStatus = [...employee.listStatus, this.listNote.find(e => e.code == "required_Tu")];
          employee.isValid = false;
        }

        if (!employee?.Den) {
          employee.listStatus = [...employee.listStatus, this.listNote.find(e => e.code == "required_Den")];
          employee.isValid = false;
        }
      }

      //Check duplicate in DB
      if (employee.EmployeeCode) {
        let check = this.employeeCodeInDB.filter(x => x.toUpperCase().trim() == employee.EmployeeCode.toUpperCase().trim());
        if (check.length == 0) {
          employee.listStatus = [...employee.listStatus, this.listNote.find(e => e.code == "existEmployeeCode_inDB")];
          employee.isValid = false;
        }
      }

      if (employee?.Tu && employee?.Den) {
        if (employee?.Tu > employee?.Den) {
          employee.listStatus = [...employee.listStatus, this.listNote.find(e => e.code == "required_TuDen")];
          employee.isValid = false;
        }
      }

      if (employee.QuanHe) {
        let check = this.listQuanHe.find(x => x.categoryName.toUpperCase().trim() == employee.QuanHe.toUpperCase().trim());
        if (!check) {
          employee.listStatus = [...employee.listStatus, this.listNote.find(e => e.code == "existQuanHe_inDB")];
          employee.isValid = false;
        } else {
          employee.QuanHeId = check;
        }
      }

    })
  }

  onCancel() {
    let result: ResultDialog = {
      status: false,
      statusImport: false
    };
    this.ref.close(result);
  }

  async importCustomer() {
    /* check valid list selected */
    if (this.selectedEmployeeImport.length == 0) {
      let msg = { severity: 'warn', summary: 'Thông báo', detail: 'Chọn danh sách cần import' };
      this.showMessage(msg);
      return;
    }
    let inValidRecord = this.selectedEmployeeImport.find(e => !e.isValid);
    if (inValidRecord) {
      let msg = { severity: 'error', summary: 'Thông báo', detail: 'Danh sách không hợp lệ' };
      this.showMessage(msg);
      return;
    }
    this.checkStatus(false);
    this.standardizedListCustomer();
    let listEmpPhuThuoc: Array<GiaDinhModel> = [];
    this.selectedEmployeeImport.forEach(item => {
      var newEmp = this.mapFormToEmployeeModel(item);
      listEmpPhuThuoc.push(newEmp);
    });
    this.loading = true;
    let result: any = await this.employeeService.importThongTinGiaDinh(listEmpPhuThuoc);
    this.loading = false;
    if (result.statusCode === 200) {
      let mgs = { severity: 'success', summary: 'Thông báo', detail: result.messageCode };
      this.showMessage(mgs);
      this.ref.close(result);
    } else {
      let mgs = { severity: 'error', summary: 'Thông báo', detail: result.messageCode };
      this.showMessage(mgs);
      this.getMasterdata();
      this.checkStatus(true);
    }
  }

  standardizedListCustomer() {
    this.listGiaDinhImport.forEach(customer => {
      // customer.materialID = customer.materialID?.trim() ?? "";
    });
  }

  mapFormToEmployeeModel(giaDinh): GiaDinhModel {
    let giaDinhModel = new GiaDinhModel();
    giaDinhModel.EmployeeCode = giaDinh.EmployeeCode;
    giaDinhModel.QuanHe = giaDinh.QuanHe;
    giaDinhModel.QuanHeId = giaDinh.QuanHeId.categoryId;
    giaDinhModel.FullName = giaDinh.FullName;
    giaDinhModel.DateOfBirth = giaDinh.NgaySinh;
    giaDinhModel.Phone = giaDinh.Sdt;
    giaDinhModel.Email = giaDinh.Email;
    giaDinhModel.PhuThuoc = giaDinh.PhuThuoc;
    giaDinhModel.PhuThuocTuNgay = giaDinh.Tu;
    giaDinhModel.PhuThuocDenNgay = giaDinh.Den;
    return giaDinhModel;
  }
  //end
}

function validateString(str: string) {
  if (str === undefined) return "";
  return str.trim();
}

function convertToUTCTime(time: any) {
  return new Date(Date.UTC(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()));
};

