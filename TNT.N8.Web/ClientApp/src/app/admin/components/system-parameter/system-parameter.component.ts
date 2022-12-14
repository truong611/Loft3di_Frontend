import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SystemParameterService } from '../../services/system-parameter.service';
import { EmployeeService } from '../../../employee/services/employee.service';
import { GetPermission } from '../../../shared/permission/get-permission';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService } from '../../../project/services/project.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface SystemParameterModel {
  systemDescription: string,
  systemKey: string,
  systemValue: boolean,
  systemValueString: string,
  systemGroupCode: string,
  description: string,
  isEdit: boolean
}

@Component({
  selector: 'app-system-parameter',
  templateUrl: './system-parameter.component.html',
  styleUrls: ['./system-parameter.component.css']
})

export class SystemParameterComponent implements OnInit {
  auth: any = JSON.parse(localStorage.getItem("auth"));
  userId: string = this.auth.UserId;
  loading: boolean = false;
  actionEdit: boolean = true;

  /*Check user permission*/
  listPermissionResource: string = localStorage.getItem("ListPermissionResource");

  systemParameterList: Array<SystemParameterModel> = [];
  listGroupSystem: Array<SystemParameterModel> = [];
  listGroupEmail: Array<SystemParameterModel> = [];
  listGroupTemplateEmail: Array<SystemParameterModel> = [];
  listGroupCurrency: Array<SystemParameterModel> = [];
  listGroupLogo: Array<SystemParameterModel> = [];
  colHeader: any[];
  base64Logo: any;
  currentBase64Logo: any;
  @ViewChild('currentLogo') currentLogo: ElementRef;
  validLogo: string = null;

  emailForm: FormGroup;
  emailControl: FormControl;
  passwordControl: FormControl;

  cols: Array<any> = [];
  listEmailNhanSu: Array<any> = [];
  clonedData: { [s: string]: any; } = {};

  constructor(
    private router: Router,
    private getPermission: GetPermission,
    private translate: TranslateService,
    private employeeService: EmployeeService,
    private systemParameterService: SystemParameterService,
    private messageService: MessageService,
    private ref: ChangeDetectorRef,
    private projectService: ProjectService,
    private confirmationService: ConfirmationService,
  ) {
    this.translate.setDefaultLang('vi');
  }

  async ngOnInit() {
    this.emailControl = new FormControl(null, [Validators.required]);
    this.passwordControl = new FormControl(null, [Validators.required]);

    this.emailForm = new FormGroup({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl
    });

    this.cols = [
      { field: 'email', header: 'Email', textAlign: 'left', colWith: '40%' },
      { field: 'password', header: 'Password', textAlign: 'left', colWith: '40%' },
      { field: 'actions', header: 'Thao t??c', textAlign: 'center', colWith: '20%' },
    ];

    /* #region  init table header */
    this.colHeader = [
      { field: 'loaiThamSo', header: 'Lo???i Tham S???', textAlign: 'left', display: 'table-cell', colWith: '15%' },
      { field: 'giaTri', header: 'Gi?? Tr???', textAlign: 'left', display: 'table-cell', colWith: '15%' },
      { field: 'moTa', header: 'M?? t???', textAlign: 'left', display: 'table-cell', colWith: '20%' },
      { field: 'chucNang', header: 'Ch???c n??ng', textAlign: 'center', display: 'table-cell', colWith: '5%' },
    ];
    /* #endregion */

    let resource = "sys/admin/system-parameter/";
    let permission: any = await this.getPermission.getPermission(resource);
    if (permission.status == false) {
      this.messageService.add({ severity: 'warn', summary: 'Th??ng b??o', detail: 'B???n kh??ng c?? quy???n truy c???p v??o ???????ng d???n n??y vui l??ng quay l???i trang ch???' });
      this.router.navigate(['/home']);
    }
    else {
      let listCurrentActionResource = permission.listCurrentActionResource;
      if (listCurrentActionResource.indexOf("edit") == -1) {
        this.actionEdit = false;
      }
      this.getMasterData();
    }
  }

  getMasterData() {
    this.loading = true;
    this.systemParameterService.GetAllSystemParameter().subscribe(response => {
      let result = <any>response;
      this.loading = false;

      this.listEmailNhanSu = result.listEmailNhanSu;
      this.systemParameterList = result.systemParameterList;
      this.systemParameterList.forEach(item => {
        item.isEdit = false;
      });

      //Chia theo groupCode
      // ???n c??c tham s???
      //Tab tham s??? h??? th???ng ???n c??c m???c:
      //-T??? l??? quy ?????i Ti???n th??nh ??i???m        
      //T??? l??? quy ?????i ti???n th??nh ??i???m c???a kh??ch h??ng, 1 Ti???n s??? ?????i ?????i ???????c 1 ??i???m
      //Ph?? duy???t kh??ch h??ng ?????nh danh                
      //Tr???ng th??i ????n h??ng ???????c xu???t kho        
      //?????nh d???ng s??? ??i???n tho???i        
      //M???c l???i nhu???n t???i thi???u k??? v???ng        
      //T??? l??? quy ?????i ??i???m th??nh Ti???n        
      //Tr???ng th??i ????n h??ng b??n t??nh t???ng doanh s???        
      //X??? l?? v?????t qu?? t???n kho t???i ??a
      //Tr???ng th??i ????n h??ng mua t??nh t???ng thanh to??n
      //Ki???m tra t???n kho
      var listHiddenCode = ["PurchaseOrderStatus", "KTTONKHO", "MoneyRate", "OrderStatus", "HIM", "MinimumProfitExpect", "IDO", "DefaultPhoneType", "AppovalCustomer", "PointRate"];
      this.listGroupSystem = this.systemParameterList.filter(x => x.systemGroupCode == "SYSTEM" && listHiddenCode.indexOf(x.systemKey) == -1);
      this.listGroupEmail = this.systemParameterList.filter(x => x.systemGroupCode == "EMAIL");
      this.listGroupTemplateEmail = this.systemParameterList.filter(x => x.systemGroupCode == "EmailTemplate");
      this.listGroupCurrency = this.systemParameterList.filter(x => x.systemGroupCode == "CURRENCY");
      this.listGroupLogo = this.systemParameterList.filter(x => x.systemGroupCode == "LOGO");

      this.base64Logo = this.systemParameterList.find(x => x.systemKey == 'Logo').systemValueString;
    });
  }

  /*H???y ch???nh s???a*/
  cancelEdit(data: SystemParameterModel) {
    data.isEdit = false;
  }

  /*Ch???nh s???a*/
  onEdit(data: SystemParameterModel) {
    data.isEdit = true;
  }

  changeParameter(element: any) {
    this.loading = true;
    let systemKey = element.systemKey;
    let systemValue = element.systemValue;
    let systemmValueString = element.systemValueString;
    this.systemParameterService.ChangeSystemParameter(systemKey, systemValue, systemmValueString, element.description).subscribe(response => {
      let result = <any>response;
      if (result.statusCode == 200) {
        this.loading = false;
        localStorage.setItem("systemParameterList", JSON.stringify(result.systemParameterList));
        this.messageService.add({ severity: 'success', summary: 'Th??ng b??o', detail: result.messageCode });
        this.getMasterData();
      }
      else {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Th??ng b??o', detail: result.messageCode });
      }
    });
  };

  handleFile(event: any) {
    this.validLogo = null;
  }

  async myUploader(event: any) {
    let blobUrl = '';
    this.validLogo = null;
    for (let file of event.files) {
      blobUrl = file.objectURL.changingThisBreaksApplicationSecurity;
    }

    if (blobUrl != '') {
      let base64 = await this.getBase64ImageFromURL(blobUrl);
      this.currentBase64Logo = base64;
      this.ref.detectChanges();
      setTimeout(() => {
        let naturalWidth = this.currentLogo.nativeElement.naturalWidth;
        let naturalHeight = this.currentLogo.nativeElement.naturalHeight;

        if ((naturalWidth < 140 || naturalWidth > 150) && (naturalHeight < 60 || naturalHeight > 70)) {
          this.validLogo = 'chi???u r???ng trong kho???ng: 140px -> 150px, chi??u d??i trong kho???ng 60px -> 70px';
        } else {
          let description = this.systemParameterList.find(x => x.systemKey == 'Logo').description;
          //Update base64
          this.systemParameterService.ChangeSystemParameter('Logo', null, this.currentBase64Logo, description).subscribe(response => {
            let result = <any>response;

            if (result.statusCode == 200) {
              localStorage.setItem("systemParameterList", JSON.stringify(result.systemParameterList));
              this.getMasterData();
              this.messageService.add({ severity: 'success', summary: 'Th??ng b??o', detail: 'L??u th??nh c??ng' });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Th??ng b??o', detail: result.messageCode });
            }
          });
        }
      }, 1);
    }
  }

  /*Event: x??a 1 file trong list file*/
  onRemove(event: any) {
    this.currentBase64Logo = null;
    this.validLogo = null;
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  synchronizedEvn() {
    this.loading = true;
    this.projectService.synchronizedEvn().subscribe(response => {
      let result: any = response;
      this.loading = false;
      if (result.statusCode === 200) {
        this.messageService.add({ severity: 'success', summary: 'Th??ng b??o', detail: '?????ng b??? d??? li???u th??nh c??ng!' });
      }
    });
  }

  async createEmailNhanSu() {
    if (!this.emailForm.valid) {
      Object.keys(this.emailForm.controls).forEach(key => {
        if (!this.emailForm.controls[key].valid) {
          this.emailForm.controls[key].markAsTouched();
        }
      });

      return;
    }

    let emailNhanSu = {
      emailNhanSuId: null,
      email: this.emailControl.value.trim(),
      password: this.passwordControl.value.trim()
    };

    this.loading = true;
    let result: any = await this.systemParameterService.createOrUpdateEmailNhanSu(emailNhanSu);
    if (result.statusCode != 200) {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Th??ng b??o', detail: result.messageCode });
      return;
    }

    this.messageService.add({ severity: 'success', summary: 'Th??ng b??o', detail: result.messageCode });
    this.emailForm.reset();

    let _result: any = await this.systemParameterService.getListEmailNhanSu();
    if (_result.statusCode != 200) {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Th??ng b??o', detail: _result.messageCode });
      return;
    }

    this.listEmailNhanSu = _result.listEmailNhanSu;
    this.loading = false;
  }

  onRowEditInit(data: any) {
    this.clonedData[data.emailNhanSuId.toString()] = { ...data };
  }

  async onRowEditSave(data: any, index: number) {
    let result: any = await this.systemParameterService.createOrUpdateEmailNhanSu(data);
    if (result.statusCode != 200) {
      this.messageService.add({ severity: 'error', summary: 'Th??ng b??o', detail: result.messageCode });

      this.listEmailNhanSu[index] = this.clonedData[data.emailNhanSuId.toString()];
      delete this.clonedData[data.emailNhanSuId.toString()];

      return;
    }

    this.messageService.add({ severity: 'success', summary: 'Th??ng b??o', detail: result.messageCode });
    delete this.clonedData[data.emailNhanSuId.toString()];
  }

  onRowEditCancel(data: any, index: number) {
    this.listEmailNhanSu[index] = this.clonedData[data.emailNhanSuId.toString()];
    delete this.clonedData[data.emailNhanSuId.toString()];
  }

  xoaEmail(data: any) {
    this.confirmationService.confirm({
      message: `D??? li???u kh??ng th??? ho??n t??c, b???n ch???c ch???n mu???n x??a c???u h??nh n??y?`,
      accept: async () => {
        this.loading = true;
        let result: any = await this.systemParameterService.deleteEmailNhanSu(data.emailNhanSuId);

        if (result.statusCode != 200) {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Th??ng b??o', detail: result.messageCode });
          return;
        }

        this.loading = false;
        this.listEmailNhanSu = this.listEmailNhanSu.filter(x => x != data);
        this.messageService.add({ severity: 'success', summary: 'Th??ng b??o', detail: result.messageCode });
      },
    });
  }
};
