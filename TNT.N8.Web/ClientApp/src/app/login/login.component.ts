import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { UserModel } from '../shared/models/user.model';
import { MD5 } from '../shared/adapter/md5';
import { MenuBuild } from '../admin/models/menu-build.model';
import { MenuModule } from '../admin/models/menu-module.model';
import { MenuSubModule } from '../admin/models/menu-sub-module.model';
import { MenuPage } from '../admin/models/menu-page.model';
import { CookieService } from 'ngx-cookie-service';
import { EncrDecrService } from '../shared/services/encrDecr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messages: any = {};
  model: UserModel = {
    UserId: null, Password: '', UserName: '', EmployeeId: '', EmployeeCode: '', Disabled: false, CreatedById: 'DE2D55BF-E224-4ADA-95E8-7769ECC494EA', CreatedDate: null, UpdatedById: null, UpdatedDate: null, Active: true
  };
  loading = false;
  returnUrl: string;
  capcharLogo: string;
  capcharInput: string = '';
  loginMessageCode: string = "";
  state: number = 1;
  isCheckCaptcha: boolean = false;
  validateCaptcha: boolean = false;
  capcharCheck: string = '';
  base64Logo: any = null;
  checked: boolean = false; // check box lưu mật khẩu

  //danh sách params cần so sánh trong chuỗi url cần trả về
  listParams = [
    'deXuatTLId', 
    'deXuatCongTacId',
    'hoSoCongTacId', 
    'deNghiTamHoanUngId',
    'loaiDeNghi',
    'deXuatXinNghiId',
    'deXuatOTId',
    'kyDanhGiaId',
    'phieuDanhGiaId',
    'danhGiaNhanVienId',
    'deXuatOTId',
    'phieuLuongId',
    'assetId',
    'requestId',
    'kyLuongId'
  ];
  url = '';//url cần trả về không chứa param
  params = {};//danh sách params trong url cần trả về

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private md5: MD5,
    private cookieService: CookieService,
    private encrDecrService: EncrDecrService) {
    translate.setDefaultLang('vi');
    this.translate.get('login.title').subscribe(value => { this.messages.title = value; });
    this.translate.get('login.capchar_check').subscribe(value => { this.capcharCheck = value; });
    //this.global.TITLE = "";
  }

  capcharText() {
    if (this.capcharCheck == null || this.capcharCheck === '' || this.capcharCheck === undefined) this.capcharCheck = '1234567890';
    var random = this.capcharCheck[Math.floor(Math.random() * this.capcharCheck.length)];
    for (let i = 0; i < 3; i++) {
      random = random + this.capcharCheck[Math.floor(Math.random() * this.capcharCheck.length)];
    }
    this.capcharLogo = random;
  }

  resolved(captchaResponse: string) {
    if (captchaResponse != null) {
      this.isCheckCaptcha = true;
      this.validateCaptcha = false;
    }
    else {
      this.isCheckCaptcha = false;
      this.validateCaptcha = true;
    }
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    this.translate.get('login.capchar_check').subscribe(value => { this.capcharCheck = value; });
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.route.params.subscribe(params => {
      this.returnUrl = params['returnUrl'] ?? '/';
    });
    this.setUrl();
    this.capcharText();
    if (this.cookieService.get('remember') !== undefined) {
      if (this.cookieService.get('remember') === 'yes') {
        this.model.UserName = this.cookieService.get('username');
        this.model.Password = this.cookieService.get('password');
        this.checked = true;
      }
    }
  }

  setUrl() {
    let url = this.returnUrl.split(';');
    this.url = url[0];//url không chứa param
    let lstParam = [];//danh sách param trong url cần trả về
    if (url.length > 1) {
      for (let i = 1; i < url.length; i++) {
        let param = url[i].split('=');
        lstParam = [...lstParam, { key: param[0], value: param[1] }]
      }
    }

    if (lstParam.length > 0) {
      lstParam.forEach(item => {
        if (this.listParams.includes(item.key)) {
          if (!isNaN(Number(item.value))) {
            item.value = this.encrDecrService.set(item.value);//mã hóa value
          }
        }
        let field = item.key;
        this.params[field] = item.value;
      })
    }
  }

  login() {
    // if (this.capcharInput !== this.capcharLogo) {
    //   this.validateCaptcha = true;
    //   this.capcharText();
    //   return;
    // }
    var today = new Date()
    var expiresDate = new Date(today.setFullYear(today.getFullYear() + 1))
    this.loading = true;
    this.authenticationService.login(this.model)
      .subscribe(result => {
        //let encode = this.md5.encodeMD5("LÊ TRƯỜNG GIANG");
        if (result && result.statusCode === 200) {

          // var path = this.router.url;
          // var domain = window.location.hostname;
          if (this.checked) {
            this.cookieService.set('remember', 'yes', expiresDate);
            this.cookieService.set('username', this.model.UserName, expiresDate);
            this.cookieService.set('password', this.model.Password, expiresDate);
          } else {
            this.cookieService.deleteAll();
          }

          localStorage.setItem("UserPermission", result.permissionList);
          localStorage.setItem("Username", result.currentUser.userName);
          localStorage.setItem("Username", result.currentUser.userName);
          localStorage.setItem("UserFullName", result.userFullName);
          // localStorage.setItem("UserAvatar", result.userAvatar);
          localStorage.setItem("UserEmail", result.userEmail);
          localStorage.setItem("IsManager", result.isManager);
          localStorage.setItem("PositionId", result.currentUser.positionId);
          localStorage.setItem("systemParameterList", JSON.stringify(result.systemParameterList));
          localStorage.setItem("ListPermissionResource", result.listPermissionResource);
          localStorage.setItem("IsAdmin", result.isAdmin);
          localStorage.setItem("IsOrder", result.isOrder);
          localStorage.setItem("IsCashier", result.isCashier);
          localStorage.setItem("EmployeeCode", result.employeeCode);
          localStorage.setItem("EmployeeName", result.employeeName);
          localStorage.setItem("EmployeeCodeName", result.employeeCodeName);

          if (result.listMenuBuild) {
            let listMenuBuild: Array<MenuBuild> = result.listMenuBuild;

            let listMenuModule: Array<MenuModule> = [];
            listMenuBuild.forEach(item => {
              if (item.level == 0) {
                let menuModule = new MenuModule();
                menuModule.code = item.code;
                menuModule.name = item.name;
                menuModule.nameIcon = item.nameIcon;
                listMenuModule.push(menuModule);
              }
            });
            localStorage.setItem("ListMenuModule", JSON.stringify(listMenuModule));

            let listMenuSubModule: Array<MenuSubModule> = [];
            listMenuBuild.forEach(item => {
              if (item.level == 1) {
                let menuSubModule = new MenuSubModule();
                menuSubModule.indexOrder = item.indexOrder;
                menuSubModule.name = item.name;
                menuSubModule.code = item.code;
                menuSubModule.codeParent = item.codeParent;
                menuSubModule.path = item.path ?? '';

                listMenuSubModule.push(menuSubModule);
              }
            });
            localStorage.setItem("ListMenuSubModule", JSON.stringify(listMenuSubModule));

            let listMenuPage: Array<MenuPage> = [];
            listMenuBuild.forEach(item => {
              if (item.level == 2) {
                let menuPage = new MenuPage();
                menuPage.name = item.name;
                menuPage.codeParent = item.codeParent;
                menuPage.nameIcon = item.nameIcon;
                menuPage.path = item.path;

                //Nếu là màn hình chi tiết thì không hiển thị
                if (item.isPageDetail) {
                  menuPage.isShow = false;
                }

                listMenuPage.push(menuPage);
              }
            });
            localStorage.setItem("ListMenuPage", JSON.stringify(listMenuPage));
          }

          //Nếu là nhân viên đặt bàn thì chuyển luôn đến trang đặt bàn
          // if (result.isOrder) {
          //   this.router.navigate(['order/order-service-create']);
          // }
          // //Nếu là nhân viên thu ngân
          // else if (result.isCashier) {
          //   this.router.navigate(['order/pay-order-service']);
          // }
          
          if (Object.keys(this.params).length > 0) {
            this.router.navigate([this.url, this.params]);
          }
          else {
            this.router.navigate([this.url]);
          }
        } else {
          this.loading = false;
          this.loginMessageCode = result.messageCode;
          this.state = -1;
        }
      });
    this.validateCaptcha = false;
  }

  redirectForgotPass() {
    this.router.navigate(['forgot-pass/check']);
  }
}
