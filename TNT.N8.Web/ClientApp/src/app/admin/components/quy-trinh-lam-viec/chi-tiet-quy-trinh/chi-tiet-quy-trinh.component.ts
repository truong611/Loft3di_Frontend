import { CauHinhQuyTrinh } from './../../../models/cau-hinh-quy-trinh.model';
import { QuyTrinh } from './../../../models/quy-trinh.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { ThemQuyTrinhPheDuyetComponent } from './../them-quy-trinh-phe-duyet/them-quy-trinh-phe-duyet.component';
import { DialogService } from 'primeng/dynamicdialog';
import { QuyTrinhService } from './../../../services/quy-trinh.service';
import {
  ToolbarService, LinkService, ImageService,
  HtmlEditorService, TableService, RichTextEditorComponent,
  ImageSettingsModel
} from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-chi-tiet-quy-trinh',
  templateUrl: './chi-tiet-quy-trinh.component.html',
  styleUrls: ['./chi-tiet-quy-trinh.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class ChiTietQuyTrinhComponent implements OnInit {
  id: string = null;
  loading: boolean = false;
  defaultNumberType = 2;
  listDoiTuongApDung: Array<any> = [];
  nowDate = new Date();
  nguoiTao: string = localStorage.getItem("EmployeeCodeName");
  quyTrinh = new QuyTrinh();
  listCauHinhQuyTrinh: Array<CauHinhQuyTrinh> = [];
  cols: Array<any> = [];

  /* #region: Editor */
  @ViewChild('templateRTE') rteEle: RichTextEditorComponent;
  tools: object = {
    type: 'Expand',
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      'Outdent', 'Indent', '|',
      'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
      'SourceCode', 'FullScreen', '|', 'Undo', 'Redo', 'CreateTable']
  };
  insertImageSettings: ImageSettingsModel = {
    allowedTypes: ['.jpeg', '.jpg', '.png'],
    display: 'inline', width: 'auto',
    height: 'auto',
    saveFormat: 'Base64',
    saveUrl: null,
    path: null,
  };
  /* #endregion */

  quyTrinhForm: FormGroup;
  tenQuyTrinhControl: FormControl;
  doiTuongApDungControl: FormControl;
  hoatDongControl: FormControl;
  moTaControl: FormControl;

  warnQuyTrinh: boolean = false;
  warnUpdateQuyTrinh: boolean = false;
  listDoiTuong: Array<any> = [];

  constructor(
    public location: Location,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public router: Router,
    public route: ActivatedRoute,
    private dialogService: DialogService,
    private quyTrinhService: QuyTrinhService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initTable();

    this.route.params.subscribe(params => {
      this.id = params['Id'];
      this.getDetailQuyTrinhById();
    });
  }

  initForm() {
    this.tenQuyTrinhControl = new FormControl(null, [Validators.required]);
    this.doiTuongApDungControl = new FormControl(null, [Validators.required]);
    this.hoatDongControl = new FormControl(false);
    this.moTaControl = new FormControl(null);

    this.quyTrinhForm = new FormGroup({
      tenQuyTrinhControl: this.tenQuyTrinhControl,
      doiTuongApDungControl: this.doiTuongApDungControl,
      hoatDongControl: this.hoatDongControl,
      moTaControl: this.moTaControl
    });
  }

  initTable() {
    this.cols = [
      { field: 'stt', header: 'STT', textAlign: 'center', display: 'table-cell' },
      // { field: 'soTienTu', header: 'S??? ti???n t???', textAlign: 'right', display: 'table-cell' },
      { field: 'tenCauHinh', header: 'T??n c???u h??nh', textAlign: 'center', display: 'table-cell' },
      { field: 'loaiCauHinh', header: 'Lo???i c???u h??nh', textAlign: 'center', display: 'table-cell' },
      { field: 'quyTrinh', header: 'Quy tr??nh', textAlign: 'center', display: 'table-cell' },
      { field: 'actions', header: 'Thao t??c', textAlign: 'center', display: 'table-cell' },
    ];
  }

  getDetailQuyTrinhById() {
    this.loading = true;
    this.quyTrinhService.getDetailQuyTrinh(this.id).subscribe(res => {
      let result: any = res;
      this.loading = false;

      if (result.statusCode == 200) {
        this.listDoiTuongApDung = result.listDoiTuongApDung;
        this.quyTrinh = result.quyTrinh;
        this.listCauHinhQuyTrinh = result.listCauHinhQuyTrinh;
        this.mapDataToForm(result.quyTrinh);
      }
      else {
        this.showMessage('error', result.messageCode);
      }
    });
  }

  mapDataToForm(quyTrinh: QuyTrinh) {
    this.tenQuyTrinhControl.setValue(quyTrinh.tenQuyTrinh);
    let doiTuongApDung = this.listDoiTuongApDung.find(x => x.value == quyTrinh.doiTuongApDung);
    this.doiTuongApDungControl.setValue(doiTuongApDung);
    this.hoatDongControl.setValue(quyTrinh.hoatDong);
    this.moTaControl.setValue(quyTrinh.moTa);
  }

  themCauHinhQuyTrinh() {
    let newCauHinh = new CauHinhQuyTrinh();
    newCauHinh.soTienTu = '0';

    this.listCauHinhQuyTrinh = [...this.listCauHinhQuyTrinh, newCauHinh];
    this.checkSoTien();
  }

  themQuyTrinhPheDuyet(rowData: CauHinhQuyTrinh) {
    let ref = this.dialogService.open(ThemQuyTrinhPheDuyetComponent, {
      data: {
        cauHinhQuyTrinh: rowData
      },
      header: 'Th??m quy tr??nh ph?? duy???t',
      width: '60%',
      baseZIndex: 10001,
      contentStyle: {
        "min-height": "350px",
        "max-height": "500px",
        "overflow": "auto"
      }
    });

    ref.onClose.subscribe((result: any) => {
      if (result) {
        rowData = result;
        this.checkSoTien();
      }
    });
  }

  xoaCauHinhQuyTrinh(rowData) {
    this.listCauHinhQuyTrinh = this.listCauHinhQuyTrinh.filter(x => x != rowData);
    this.checkSoTien();
  }

  /*L???y list Price c?? gi?? tr??? ???? ???????c nh???p nhi???u h??n 1 l???n gi???ng nhau*/
  checkSoTien() {
    let listPrice = this.listCauHinhQuyTrinh.map(x => {
      let newItem = {
        soTienTu: x.soTienTu.toString(),
        loaiCauHinh: x.loaiCauHinh
      };
      
      return JSON.stringify(newItem);
    });

    let uniq = listPrice
      .map((name) => {
        return {
          count: 1,
          name: name
        }
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count
        return a
      }, {});

    let duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);

    this.listCauHinhQuyTrinh.forEach(item => {
      let temp = JSON.stringify({
        soTienTu: item.soTienTu.toString(),
        loaiCauHinh: item.loaiCauHinh
      });

      if (duplicates.includes(temp)) {
        item.error = true;
      }
      else {
        item.error = false;
      }
    });
  }

  async save() {
    if (!this.quyTrinhForm.valid) {
      Object.keys(this.quyTrinhForm.controls).forEach(key => {
        if (!this.quyTrinhForm.controls[key].valid) {
          this.quyTrinhForm.controls[key].markAsTouched();
        }
      });
      return;
    }

    if (this.listCauHinhQuyTrinh.find(x => x.error == true)) {
      this.showMessage('warn', 'C???u h??nh ph?? duy???t kh??ng h???p l???');
      return;
    }

    //T??? ?????ng b??? ??i nh???ng c???u h??nh ch??a ???????c th??m quy tr??nh
    this.listCauHinhQuyTrinh = this.listCauHinhQuyTrinh.filter(x => x.tenCauHinh != null);

    if (this.listCauHinhQuyTrinh.length == 0) {
      this.showMessage('warn', 'B???n c???n th??m C???u h??nh ph?? duy???t');
      return;
    }

    let quyTrinh = this.mapDataToModel_QuyTrinh();
    let listCauHinhQuyTrinh = this.mapDataToModel_CauHinhQuyTrinh();

    //N???u tr???ng th??i l?? Ho???t ?????ng th?? check
    if (quyTrinh.hoatDong) {
      let result: any = await this.quyTrinhService.checkTrangThaiQuyTrinh(quyTrinh.doiTuongApDung, quyTrinh.id);

      if (result.statusCode == 200) {
        //N???u ?????i t?????ng ???? c?? quy tr??nh ??ang ??c ??p d???ng
        if (result.exists) {
          this.warnQuyTrinh = true;
        }
        //N???u ?????i t?????ng ch??a c?? quy tr??nh ??p d???ng => update quy tr??nh
        else {
          this.checkUpdateQT(quyTrinh, listCauHinhQuyTrinh, quyTrinh.hoatDong);
        }
      }
      else {
        this.showMessage('error', result.messageCode);
      }
    }
    //N???u tr???ng th??i l?? Kh??ng ho???t ?????ng th?? => update quy tr??nh
    else {
      this.checkUpdateQT(quyTrinh, listCauHinhQuyTrinh, quyTrinh.hoatDong);
    }
  }

  /* T???o quy tr??nh v???i tr???ng th??i Ho???t ?????ng */
  chapNhan() {
    this.warnQuyTrinh = false;

    let quyTrinh = this.mapDataToModel_QuyTrinh();
    let listCauHinhQuyTrinh = this.mapDataToModel_CauHinhQuyTrinh();
    this.checkUpdateQT(quyTrinh, listCauHinhQuyTrinh, quyTrinh.hoatDong);
  }

  /* T???o quy tr??nh v???i tr???ng th??i Kh??ng ho???t ?????ng */
  khongChapNhan() {
    this.warnQuyTrinh = false;

    this.hoatDongControl.setValue(false);
    let quyTrinh = this.mapDataToModel_QuyTrinh();
    let listCauHinhQuyTrinh = this.mapDataToModel_CauHinhQuyTrinh();
    this.checkUpdateQT(quyTrinh, listCauHinhQuyTrinh, false);
  }

  async checkUpdateQT(quyTrinh: QuyTrinh, listCauHinhQuyTrinh: Array<CauHinhQuyTrinh>, hoatDong: boolean) {
    quyTrinh.hoatDong = hoatDong;

    this.loading = true;
    let result: any = await this.quyTrinhService.checkUpdateQuyTrinh(quyTrinh, listCauHinhQuyTrinh);

    if (result.statusCode != 200) {
      this.loading = false;
      this.showMessage('error', result.messageCode);
      return;
    }
    
    if (result.isResetDoiTuong) {
      this.loading = false;
      this.listDoiTuong = result.listDoiTuong;
      this.warnUpdateQuyTrinh = true;
    }
    else {
      this.updateQT(quyTrinh, listCauHinhQuyTrinh);
    }
  }

  khongCapNhat() {
    this.warnUpdateQuyTrinh = false;
  }

  capNhat() {
    let quyTrinh = this.mapDataToModel_QuyTrinh();
    let listCauHinhQuyTrinh = this.mapDataToModel_CauHinhQuyTrinh();

    this.updateQT(quyTrinh, listCauHinhQuyTrinh, true);
  }

  updateQT(quyTrinh: QuyTrinh, listCauHinhQuyTrinh: Array<CauHinhQuyTrinh>, isResetDoiTuong: boolean = true) {
    this.warnUpdateQuyTrinh = false;
    this.loading = true;
    this.quyTrinhService.updateQuyTrinh(quyTrinh, listCauHinhQuyTrinh,isResetDoiTuong).subscribe(response => {
      let result: any = response;
      this.loading = false;

      if (result.statusCode == 200) {
        this.showMessage('success', result.messageCode);
      }
      else {
        this.showMessage('error', result.messageCode);
      }
    });
  }

  mapDataToModel_QuyTrinh() {
    let quyTrinh = new QuyTrinh();
    quyTrinh.id = this.id;
    quyTrinh.tenQuyTrinh = this.tenQuyTrinhControl.value ?.trim();
    quyTrinh.doiTuongApDung = this.doiTuongApDungControl.value.value;
    quyTrinh.hoatDong = this.hoatDongControl.value;
    quyTrinh.moTa = this.moTaControl.value;

    return quyTrinh;
  }

  mapDataToModel_CauHinhQuyTrinh() {
    let listCauHinhQuyTrinh = this.listCauHinhQuyTrinh.map(item => Object.assign({}, item));
    listCauHinhQuyTrinh.forEach(item => {
      item.soTienTu = ParseStringToFloat(item.soTienTu.toString());
    });

    return listCauHinhQuyTrinh;
  }

  delete() {
    this.confirmationService.confirm({
      message: `D??? li???u s??? kh??ng th??? ho??n t??c, b???n ch???c ch???n mu???n x??a?`,
      accept: () => {
        this.loading = true;
        this.quyTrinhService.deleteQuyTrinh(this.id).subscribe(res => {
          let result: any = res;

          if (result.statusCode == 200) {
            this.router.navigate(['admin/danh-sach-quy-trinh']);
          }
          else {
            this.loading = false;
            this.showMessage('error', result.messageCode);
          }
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }

  showMessage(severity: string, detail: string) {
    this.messageService.add({ severity: severity, summary: 'Th??ng b??o:', detail: detail });
  }
}

function ParseStringToFloat(str: any) {
  if (str === "") return 0;
  str = String(str).replace(/,/g, '');
  return parseFloat(str);
}