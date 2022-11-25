import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';

import { ThongTinGiaDinhModel } from './../../../../../models/thong-tin-gia-dinh.model';

import { EmployeeService } from './../../../../../services/employee.service';
import { DataService } from './../../../../../../shared/services/data.service';

import { ThemMoiGiaDinhComponent } from '../them-moi-gia-dinh/them-moi-gia-dinh.component';
import * as XLSX from 'xlsx';
import { HopDongImportDetailComponent } from '../../hop-dong/hop-dong-import-detail/hop-dong-import-detail.component';
import { HopDongNhanSuModel } from '../../../../../models/hop-dong-nhan-su.model';
import { GiaDinhImportDetailComponent } from '../gia-dinh-import-detail/gia-dinh-import-detail.component';

class importGiaDinhModel {
  EmployeeCode: string;
  QuanHe: string;
  FullName: string;
  NgaySinh: Date;
  Sdt: string;
  Email: string;
  PhuThuoc: boolean;
  Tu: Date;
  Den: Date;
}


@Component({
  selector: 'app-thong-tin-gia-dinh',
  templateUrl: './thong-tin-gia-dinh.component.html',
  styleUrls: ['./thong-tin-gia-dinh.component.css']
})


export class ThongTinGiaDinhComponent implements OnInit {
  loading: boolean = false;
  @Input() actionEdit: boolean;
  @Input() employeeId: string;

  displayChooseFileImportGiaDinh: boolean = false;
  fileName: string = '';
  importFileExcel: any = null;
  listHopDong: Array<HopDongNhanSuModel> = [];

  isManager: boolean = false;
  listQuanHe = [];

  cols: Array<any> = [];
  listThanhVienGiaDinh: Array<ThongTinGiaDinhModel> = [];

  @ViewChild('myTable') myTable: Table;
  constructor(
    public dialogService: DialogService,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    public confirmationService: ConfirmationService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.initTable();
    this.getThongTinGiaDinh();
  }

  initTable() {
    this.cols = [
      { field: 'stt', header: '#', textAlign: 'center', colWith: '3vw' },
      { field: 'tenQuanHe', header: 'Quan hệ', textAlign: 'left', colWith: '8vw' },
      { field: 'fullName', header: 'Họ và tên', textAlign: 'left', colWith: '' },
      { field: 'dateOfBirth', header: 'Ngày sinh', textAlign: 'center', colWith: '8vw' },
      { field: 'phone', header: 'Điện thoại', textAlign: 'left', colWith: '8vw' },
      { field: 'email', header: 'Email', textAlign: 'left', colWith: '15vw' },
      { field: 'phuThuoc', header: 'Phụ thuộc', textAlign: 'center', colWith: '8vw' },
      { field: 'action', header: 'Thao tác', textAlign: 'center', colWith: '100px' }
    ];
  }

  async getThongTinGiaDinh() {
    this.loading = true;
    let result: any = await this.employeeService.getThongTinGiaDinh(this.employeeId);
    this.loading = false;

    if (result.statusCode == 200) {
      this.listThanhVienGiaDinh = result.listThanhVienGiaDinh;
      this.isManager = result.isManager;
      this.listQuanHe = result.listQuanHe;
    }
    else {
      this.showMessage('error', result.messageCode);
    }
  }

  addThongTinGiaDinh(rowData = null) {
    let isAdd: boolean = true;
    if (rowData) {
      isAdd = false;
    }
    let ref = this.dialogService.open(ThemMoiGiaDinhComponent, {
      data: {
        isAdd: isAdd,
        employeeId: this.employeeId,
        listQuanHe: this.listQuanHe,
        thanhVien: rowData
      },
      header: isAdd ? 'Thêm mới thông tin gia đình' : 'Chỉnh sửa thông tin gia đình',
      width: '690px',
      baseZIndex: 1030,
      contentStyle: {
        "min-height": "250px",
        "max-height": "500px",
        "overflow": "auto"
      }
    });

    ref.onClose.subscribe((result: any) => {
      this.getThongTinGiaDinh();
    });
  }

  deleteThongTinGiaDinh(data) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa, dữ liệu sẽ không thể hoàn tác?',
      accept: async () => {
        try {
          this.loading = true;
          let result: any = await this.employeeService.deleteThongTinGiaDinhById(data.contactId);
          this.loading = false;

          if (result.statusCode != 200) {
            this.showMessage('error', result.messageCode);
            return;
          }
          this.showMessage('success', "Xóa dữ liệu thành công");
          this.getThongTinGiaDinh();
          this.dataService.changeMessage("Update success"); //thay đổi message để call lại api getListNote trong component NoteTimeline
        } catch (error) {
          this.showMessage('error', error);
        }
      }
    });
  }

  showMessage(severity: string, detail: string) {
    let msg = { severity: severity, summary: 'Thông báo:', detail: detail };
    this.messageService.add(msg);
  }

  closeChooseFileImportDialog() {
    this.cancelFile();
  }

  chooseFile(event: any) {
    this.fileName = event.target?.files[0]?.name;
    this.importFileExcel = event.target;
  }

  cancelFile() {
    let fileInput = $("#importFileProduct")
    fileInput.replaceWith(fileInput.val('').clone(true));
    this.fileName = "";
  }

  async downloadTemplateExcelGiaDinh() {
    // this.loading = true;
    // let result: any = await this.employeeService.downloadTemplateImportHDNS();
    // this.loading = false;
    // if (result.templateExcel != null && result.statusCode === 200) {
    //   const binaryString = window.atob(result.templateExcel);
    //   const binaryLen = binaryString.length;
    //   const bytes = new Uint8Array(binaryLen);
    //   for (let idx = 0; idx < binaryLen; idx++) {
    //     const ascii = binaryString.charCodeAt(idx);
    //     bytes[idx] = ascii;
    //   }
    //   const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //   const link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(blob);
    //   const fileName = result.fileName + ".xlsx";
    //   link.download = fileName;
    //   link.click();
    // } else {
    //   // this.displayChooseFileImportDialog = false;
    //   let msg = { severity: 'error', summary: 'Thông báo:', detail: 'Download file thất bại' };
    //   this.messageService.add(msg);
    // }
  }

  onClickImportBtn(event: any) {
    /* clear value của file input */
    event.target.value = ''
  }

  importHopDong() {
    if (this.fileName == "") {
      let mgs = { severity: 'error', summary: 'Thông báo:', detail: "Chưa chọn file cần nhập" };
      this.messageService.add(mgs);
      return;
    }

    const targetFiles: DataTransfer = <DataTransfer>(this.importFileExcel);
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(targetFiles.files[0]);
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellText: true, cellDates: true,});
      let code = 'ImpotHDNS';
      if (!workbook.Sheets[code]) {
        let mgs = { severity: 'error', summary: 'Thông báo:', detail: "File không hợp lệ" };
        this.messageService.add(mgs);
        return;
      }
      let columns = [
        { field: 'EmployeeCode', type: 'text', isRequired: true },
        { field: 'QuanHe', type: 'text', isRequired: true },
        { field: 'FullName', type: 'text', isRequired: true },
        { field: 'NgaySinh', type: 'date', isRequired: true },
        { field: 'Sdt', type: 'text', isRequired: false },
        { field: 'Email', type: 'text', isRequired: false },
        { field: 'PhuThuoc', type: 'text', isRequired: false },
        { field: 'Tu', type: 'date', isRequired: false },
        { field: 'Den', type: 'date', isRequired: false },
      ];

      //lấy data từ file excel
      const worksheetProduct: XLSX.WorkSheet = workbook.Sheets[code];
      /* save data */
      let listTaiSanRawData: Array<any> = XLSX.utils.sheet_to_json(worksheetProduct, { header: 1, raw: false });
      /* remove header */
      listTaiSanRawData = listTaiSanRawData.filter((e, index) => index != 0);
      /* nếu không nhập 2 trường required: tên + mã khách hàng thì loại bỏ */
      listTaiSanRawData = listTaiSanRawData.filter(e => (e[1]));
      /* chuyển từ raw data sang model */
      let listTaiSanRawImport: Array<importGiaDinhModel> = [];
      listTaiSanRawData?.forEach(_rawData => {
        let customer = new importGiaDinhModel();
        columns.forEach((item, index) => {
          if (item.type == 'text') {
            if(_rawData[index]){
              if( _rawData[index].toString().trim() == "x"){
                customer[item.field] = true;
              }else{
                customer[item.field] =_rawData[index].toString().trim();
              }

            }else{
              customer[item.field] ='';
            }
          }
          if (item.type == 'date') customer[item.field] = _rawData[index] ? new Date(_rawData[index].toString().trim()) : null;
        });
        listTaiSanRawImport = [...listTaiSanRawImport, customer];
      });
      /* tắt dialog import file, bật dialog chi tiết khách hàng import */
      this.displayChooseFileImportGiaDinh = false;
      this.openDetailImportDialogGiaDinh(listTaiSanRawImport);
    }
  }

  openDetailImportDialogGiaDinh(listTaiSanRawImport) {
    let ref = this.dialogService.open(GiaDinhImportDetailComponent, {
      data: {
        listTaiSanImport: listTaiSanRawImport,
        employeeId: this.employeeId
      },
      header: 'Import thông tin gia đình',
      width: '85%',
      baseZIndex: 1050,
      contentStyle: {
        "max-height": "800px",
        // "over-flow": "hidden"
      }
    });
    ref.onClose.subscribe((result: any) => {
      if (result?.statusCode == 200) {
        this.getThongTinGiaDinh();
      }
    });
  }

}
