import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GetPermission } from '../../../../../../app/shared/permission/get-permission';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Paginator, Table } from 'primeng';
import { QuanLyCongTacService } from '../../../../services/quan-ly-cong-tac/quan-ly-cong-tac.service';
import { HoSoCongTacModel } from '../../../../models/ho-so-cong-tac';
import { EncrDecrService } from '../../../../../shared/services/encrDecr.service';

export class EmployeeModel {
  EmployeeId: string;
  EmployeeName: string;
  StartedDate: Date;
  OrganizationId: string;
  PositionId: string;
  CreatedById: string;
  CreatedDate: Date;
  UpdatedById: string;
  UpdatedDate: Date;
  Active: Boolean;
  deXuatCongTacId: number;
  constructor() { }
}

class FileInFolder {
  fileInFolderId: string;
  folderId: string;
  fileFullName: string;
  fileName: string;
  objectId: string;
  objectNumber: number;
  fileUrl: string;
  objectType: string;
  size: string;
  active: boolean;
  fileExtension: string;
  createdById: string;
  createdDate: Date;
  uploadByName: string;
}

class FileUploadModel {
  FileInFolder: FileInFolder;
  FileSave: File;
}

@Component({
  selector: 'app-ho-so-cong-tac-create',
  templateUrl: './ho-so-cong-tac-create.component.html',
  styleUrls: ['./ho-so-cong-tac-create.component.css']
})
export class TaoHoSoCongTacComponent implements OnInit {
  today: Date = new Date();
  @ViewChild('toggleButton') toggleButton: ElementRef;
  isOpenNotifiError: boolean = false;
  @ViewChild('notifi') notifi: ElementRef;
  @ViewChild('save') save: ElementRef;
  @ViewChild('fileUpload') fileUpload: FileUpload;
  @ViewChild('paginator', { static: true }) paginator: Paginator
  @ViewChild('myTable') myTable: Table;
  /* End */
  /*Khai b??o bi???n*/
  auth: any = JSON.parse(localStorage.getItem("auth"));
  employeeId: string = JSON.parse(localStorage.getItem('auth')).EmployeeId;
  loading: boolean = false;
  systemParameterList = JSON.parse(localStorage.getItem('systemParameterList'));
  listPermissionResource: string = localStorage.getItem("ListPermissionResource");
  actionAdd: boolean = true;
  emptyGuid: string = '00000000-0000-0000-0000-000000000000';
  awaitResult: boolean = false;

  /* Form */
  taoHoSoCongTacForm: FormGroup;

  theoQuyetDinhCTControl: FormControl;
  donViDenCTControl: FormControl;
  ngayBatDauControl: FormControl;
  ngayKetThucControl: FormControl;
  diaDiemCTControl: FormControl;
  phuongTienControl: FormControl;
  nhiemVuControl: FormControl;

  thongTinChungForm: FormGroup;
  /* End */

  isShow: boolean = true;
  fixed: boolean = false;
  withFiexd: string = "";
  minYear: number = 2010;
  currentYear: number = (new Date()).getFullYear();

  // D??? li???u masterdata
  listQuyetDinhCT: Array<any> = new Array<any>();
  listNhanVienCTDefault: Array<EmployeeModel> = new Array<EmployeeModel>();
  listNhanVienCT: Array<EmployeeModel> = new Array<EmployeeModel>();

  deXuatCTModel: any;

  // notification
  isInvalidForm: boolean = false;
  emitStatusChangeForm: any;

  colsList: any[];

  // T??i li???u li??n quan
  uploadedFiles: any[] = [];
  arrayDocumentModel: Array<any> = [];
  colsFile: any[];
  defaultLimitedFileSize = Number(this.systemParameterList.find(systemParameter => systemParameter.systemKey == "LimitedFileSize").systemValueString) * 1024 * 1024;
  strAcceptFile: string = 'image video audio .zip .rar .pdf .xls .xlsx .doc .docx .ppt .pptx .txt';
  employeeModel: EmployeeModel = new EmployeeModel();
  isUpdate: boolean = false;
  deXuatCTId: number = 0;

  constructor(
    private quanLyCongtacService: QuanLyCongTacService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private getPermission: GetPermission,
    private el: ElementRef,
    private ref: ChangeDetectorRef,
    private encrDecrService: EncrDecrService,
  ) { }

  @HostListener('document:scroll', [])
  onScroll(): void {
    let num = window.pageYOffset;
    if (num > 100) {
      this.fixed = true;
      var width: number = $('#parent').width();
      this.withFiexd = width + 'px';
    } else {
      this.fixed = false;
      this.withFiexd = "";
    }
  }

  async ngOnInit() {
    this.setTable();
    this.setForm();

    let resource = "hrm/employee/tao-ho-so-cong-tac/";
    let permission: any = await this.getPermission.getPermission(resource);
    if (permission.status == false) {
      this.router.navigate(['/home']);
    }
    else {
      let listCurrentActionResource = permission.listCurrentActionResource;
      if (listCurrentActionResource.indexOf("add") == -1) {
        this.actionAdd = false;
      }
      // Check xem c?? ??i t??? m??n h??nh chi ti???t ????? xu???t c??ng t??c
      this.route.params.subscribe(params => { this.deXuatCTId = Number(this.encrDecrService.get(params['deXuatCTId'])) });
      
      this.getMasterData();
    }
  }

  setForm() {
    this.theoQuyetDinhCTControl = new FormControl(null, [Validators.required]);
    this.donViDenCTControl = new FormControl(null);
    this.ngayBatDauControl = new FormControl(null);
    this.ngayKetThucControl = new FormControl(null);
    this.diaDiemCTControl = new FormControl(null);
    this.phuongTienControl = new FormControl(null);
    this.nhiemVuControl = new FormControl(null);

    this.taoHoSoCongTacForm = new FormGroup({
      donViDenCTControl: this.donViDenCTControl,
      ngayBatDauControl: this.ngayBatDauControl,
      ngayKetThucControl: this.ngayKetThucControl,
      diaDiemCTControl: this.diaDiemCTControl,
      phuongTienControl: this.phuongTienControl,
      nhiemVuControl: this.nhiemVuControl,
    });

    this.thongTinChungForm = new FormGroup({
      theoQuyetDinhCTControl: this.theoQuyetDinhCTControl,
    });
  }

  async getMasterData() {
    this.loading = true;
    let result: any = await this.quanLyCongtacService.getMasterDataHoSoCTForm();
    this.loading = false;
    if (result.statusCode == 200) {

      this.listQuyetDinhCT = result.listQuyetDinhCT;
      this.listNhanVienCTDefault = result.listNhanVienCT;
      this.taoHoSoCongTacForm.disable();
      this.ref.detectChanges();

      this.setDefaultValue();
    }
  }

  setDefaultValue() {
    if (this.deXuatCTId != 0) {
      let deXuat = this.listQuyetDinhCT.find(x => x.deXuatCongTacId == this.deXuatCTId);
      if (deXuat != null && deXuat != undefined) {
        this.thayDoiDeXuatCongTac(deXuat);
      }
    }
  }

  onViewDetail(rowData: any) {
    let url = this.router.serializeUrl(this.router.createUrlTree(['/employee/detail', { employeeId: rowData.employeeId, contactId: rowData.contactId }]));
    window.open(url, '_blank');
  }

  setTable() {
    this.colsList = [
      { field: 'employeeName', header: 'H??? t??n', width: '200px', textAlign: 'left', color: '#f44336' },
      { field: 'employeeCode', header: 'M?? nh??n vi??n', width: '100px', textAlign: 'center', color: '#f44336' },
      { field: 'organizationName', header: 'Ph??ng ban', width: '150px', textAlign: 'left', color: '#f44336' },
      { field: 'positionName', header: 'Ch???c v???', width: '150px', textAlign: 'left', color: '#f44336' },
      { field: 'dateOfBirth', header: 'Ng??y sinh', width: '100px', textAlign: 'center', color: '#f44336' },
      { field: 'identity', header: 'S??? CMT/CCCD', width: '100px', textAlign: 'left', color: '#f44336' },
    ];
  }

  taoMoiHoSoCongTac() {

    if (!this.thongTinChungForm.valid) {
      Object.keys(this.thongTinChungForm.controls).forEach(key => {
        if (!this.thongTinChungForm.controls[key].valid) {
          this.thongTinChungForm.controls[key].markAsTouched();
        }
      });

      this.isInvalidForm = true;  //Hi???n th??? icon-warning-active
      this.isOpenNotifiError = true;  //Hi???n th??? message l???i
      this.emitStatusChangeForm = this.thongTinChungForm.statusChanges.subscribe((validity: string) => {
        switch (validity) {
          case "VALID":
            this.isInvalidForm = false;
            break;
          case "INVALID":
            this.isInvalidForm = true;
            break;
        }
      });

      let target = this.el.nativeElement.querySelector('.form-control.ng-invalid');
      if (target) {
        $('html,body').animate({ scrollTop: $(target).offset().top }, 'slow');
        target.focus();
      }
    }
    else {

      this.loading = true;
      this.awaitResult = true;
      // File t??i li???u
      let listFileUploadModel: Array<FileUploadModel> = [];
      this.uploadedFiles.forEach(item => {
        let fileUpload: FileUploadModel = new FileUploadModel();
        fileUpload.FileInFolder = new FileInFolder();
        fileUpload.FileInFolder.active = true;
        let index = item.name.lastIndexOf(".");
        let name = item.name.substring(0, index);
        fileUpload.FileInFolder.fileName = name;
        fileUpload.FileInFolder.fileExtension = item.name.substring(index + 1);
        fileUpload.FileInFolder.size = item.size;
        fileUpload.FileInFolder.objectId = '';
        fileUpload.FileInFolder.objectNumber = 0;
        fileUpload.FileInFolder.objectType = 'HOSOCT';
        fileUpload.FileSave = item;
        listFileUploadModel.push(fileUpload);
      });

      let hoSoCTModel: HoSoCongTacModel = this.mapFormToHoSoCTModel();

      this.quanLyCongtacService.createOrUpdateHoSoCT(hoSoCTModel, 'HOSOCT', listFileUploadModel, this.auth.UserId).subscribe(response => {
        this.loading = false;
        let result = <any>response;
        if (result.statusCode == 200) {
          this.showToast('success', 'Th??ng b??o', "T???o h??? s?? c??ng t??c th??nh c??ng");

          setTimeout(() => {
            this.router.navigate(['/employee/chi-tiet-ho-so-cong-tac', { hoSoCongTacId: this.encrDecrService.set(result.hoSoCongTacId) }]);
          }, 1000)

        }
        else {
          this.clearToast();
          this.showToast('error', 'Th??ng b??o', result.message);
        }
        this.awaitResult = false;
      });
    }
  }

  mapFormToHoSoCTModel(): HoSoCongTacModel {
    let hoSoCTModel = new HoSoCongTacModel();

    // ????? xu???t c??ng t??c
    hoSoCTModel.deXuatCongTacId = this.theoQuyetDinhCTControl.value.deXuatCongTacId;
    hoSoCTModel.donViDen = this.donViDenCTControl.value;
    hoSoCTModel.diaDiem = this.diaDiemCTControl.value;
    hoSoCTModel.phuongTien = this.phuongTienControl.value;
    hoSoCTModel.nhiemVu = this.nhiemVuControl.value;

    let ngayBatDau = this.taoHoSoCongTacForm.get('ngayBatDauControl').value ? convertToUTCTime(this.taoHoSoCongTacForm.get('ngayBatDauControl').value) : null;
    hoSoCTModel.ngayBatDau = ngayBatDau;

    let ngayKetThuc = this.taoHoSoCongTacForm.get('ngayKetThucControl').value ? convertToUTCTime(this.taoHoSoCongTacForm.get('ngayKetThucControl').value) : null;
    hoSoCTModel.ngayKetThuc = ngayKetThuc;

    hoSoCTModel.createdById = this.auth.UserId;
    hoSoCTModel.createdDate = convertToUTCTime(new Date());
    hoSoCTModel.updatedById = null;
    hoSoCTModel.updatedDate = null;
    return hoSoCTModel;
  }

  thayDoiDeXuatCongTac(event: any) {
    if (event) {
      this.theoQuyetDinhCTControl.setValue(event);

      this.listNhanVienCT = this.listNhanVienCTDefault.filter(x => x.deXuatCongTacId == event.deXuatCongTacId)
      this.mappingModelToFrom(event);
    }
  }

  mappingModelToFrom(event: any) {
    this.donViDenCTControl.setValue(event.donVi);

    this.diaDiemCTControl.setValue(event.diaDiem);

    this.phuongTienControl.setValue(event.phuongTien);

    this.nhiemVuControl.setValue(event.nhiemVu);

    let ngayBD = event.thoiGianBatDau ? new Date(event.thoiGianBatDau) : null;
    this.ngayBatDauControl.setValue(ngayBD);

    let ngayKT = event.thoiGianKetThuc ? new Date(event.thoiGianKetThuc) : null;
    this.ngayKetThucControl.setValue(ngayKT);
  }

  cancel() {
    this.router.navigate(['/employee/danh-sach-ho-so-cong-tac']);
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  clearToast() {
    this.messageService.clear();
  }
  toggleNotifiError() {
    this.isOpenNotifiError = !this.isOpenNotifiError;
  }
  //#region T??I LI???U LI??N QUAN

  /*Event L??u c??c file ???????c ch???n*/
  handleFile(event, uploader: FileUpload) {
    for (let file of event.files) {
      let size: number = file.size;
      let type: string = file.type;
      if (size <= this.defaultLimitedFileSize) {
        if (type.indexOf('/') != -1) {
          type = type.slice(0, type.indexOf('/'));
        }
        if (this.strAcceptFile.includes(type) && type != "") {
          this.uploadedFiles.push(file);
        } else {
          let subType = file.name.slice(file.name.lastIndexOf('.'));
          if (this.strAcceptFile.includes(subType)) {
            this.uploadedFiles.push(file);
          }
        }
      }
    }
  }

  /*Event Khi click x??a t???ng file*/
  removeFile(event) {
    let index = this.uploadedFiles.indexOf(event.file);
    this.uploadedFiles.splice(index, 1);
  }

  /*Event Khi click x??a to??n b??? file*/
  clearAllFile() {
    this.uploadedFiles = [];
  }

  /*Event khi x??a 1 file ???? l??u tr??n server*/
  deleteFile(file: any) {
    this.confirmationService.confirm({
      message: 'B???n ch???c ch???n mu???n x??a?',
      accept: () => {
        let index = this.arrayDocumentModel.indexOf(file);
        this.arrayDocumentModel.splice(index, 1);
      }
    });
  }
  //#endregion

}

function convertToUTCTime(time: any) {
  return new Date(Date.UTC(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()));
};

function ParseStringToFloat(str: string) {
  if (str === "" || str == null) return 0;
  str = str.toString().replace(/,/g, '');
  return parseFloat(str);
}