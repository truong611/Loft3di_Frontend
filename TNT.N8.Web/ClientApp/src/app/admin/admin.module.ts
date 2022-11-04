import { NgModule } from '@angular/core';
import { AdminRouting } from './admin.routing';
import { AdminComponent } from './admin.component';
import { AdminMenuComponent } from './components/menu/admin-menu.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { OrganizationComponent } from './components/organization/organization.component';
import { OrganizationService } from '../shared/services/organization.service';
import { PermissionService } from '../shared/services/permission.service';
import { CategoryService } from '../shared/services/category.service';
import { ProvinceService } from '../shared/services/province.service';
import { EmployeeService } from '../employee/services/employee.service';
import { PositionService } from '../shared/services/position.service';
import { BankService } from "../shared/services/bank.service";
import { ProductCategoryService } from './components/product-category/services/product-category.service';
import { ForderConfigurationService } from './components/folder-configuration/services/folder-configuration.service';
import { WorkflowService } from './components/workflow/services/workflow.service';
import { SystemParameterService } from './services/system-parameter.service';
import { EmailConfigService } from './services/email-config.service';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MasterdataComponent } from './components/masterdata/masterdata.component';
import { PermissionComponent } from './components/permission/permission.component';
import { PermissionDetailComponent } from './components/permission-detail/permission-detail.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { CreateComponent } from './components/product-category/components/create/create.component';
import { ListProductCategoryComponent } from './components/product-category/components/list-product-category/list-product-category.component';
import { CustomerlevelService } from '../shared/services/customerlevel.service';
import { CompanyConfigurationComponent } from './components/company-configuration/company-configuration.component';
import { BankpopupComponent } from '../shared/components/bankpopup/bankpopup.component';
import { MasterdataDialogComponent } from './components/masterdata-dialog/masterdata-dialog.component';
import { NgxLoadingModule } from 'ngx-loading';
import { WorkflowCreateComponent } from './components/workflow/components/workflow-create/workflow-create.component';
import { WorkflowComponent } from './components/workflow/workflow.component';
import { WorkflowDetailComponent } from './components/workflow/components/workflow-detail/workflow-detail.component';
import { WorkflowListComponent } from './components/workflow/components/workflow-list/workflow-list.component';
import { SystemParameterComponent } from './components/system-parameter/system-parameter.component';
import { PermissionCreateComponent } from './components/permission-create/permission-create.component';
import { GetPermission } from '../shared/permission/get-permission';
import { EmailConfigurationComponent } from './components/email-configuration/email-configuration.component';
import { EmailCreateTemplateComponent } from './components/email-create-template/email-create-template.component';
import { FolderConfigurationComponent } from './components/folder-configuration/folder-configuration.component';
import {TreeTableModule} from 'primeng/treetable';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { NotificationSettingComponent } from './components/notification-setting/notification-setting.component';
import { NotifiSettingService } from './services/notifi-setting.service';
import { NotificationSettingDetailComponent } from './components/notification-setting-detail/notification-setting-detail.component';
import { NotificationSettingListComponent } from './components/notification-setting-list/notification-setting-list.component';
import { MenuBuildComponent } from './components/menu-build/menu-build.component';
import { MenuBuildService } from './services/menu-build.service';
import { AuditTraceComponent } from './components/audit-trace/audit-trace.component';
import { BusinessGoalsComponent } from './components/business-goals/business-goals.component';
import { BusinessGoalsService } from './services/business-goals.service';
import { ChonNvDialogComponent } from './components/chon-nv-dialog/chon-nv-dialog.component';
import { TaoMoiQuyTrinhComponent } from './components/quy-trinh-lam-viec/tao-moi-quy-trinh/tao-moi-quy-trinh.component';
import { DanhSachQuyTrinhComponent } from './components/quy-trinh-lam-viec/danh-sach-quy-trinh/danh-sach-quy-trinh.component';
import { ThemQuyTrinhPheDuyetComponent } from './components/quy-trinh-lam-viec/them-quy-trinh-phe-duyet/them-quy-trinh-phe-duyet.component';
import { QuyTrinhService } from './services/quy-trinh.service';
import { ChiTietQuyTrinhComponent } from './components/quy-trinh-lam-viec/chi-tiet-quy-trinh/chi-tiet-quy-trinh.component';
import { ProjectService } from '../project/services/project.service';

//import { Ng4JsonEditorModule } from 'angular4-jsoneditor';

@NgModule({
  imports: [
    AdminRouting,
    SharedModule,
    FormsModule,
    MatListModule,
    TreeTableModule,
    InputSwitchModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    ProductCategoryService,
    AdminComponent,
    AdminMenuComponent,
    OrganizationComponent,
    MasterdataComponent,
    PermissionComponent,
    PermissionDetailComponent,
    PermissionCreateComponent,
    ProductCategoryComponent,
    CreateComponent,
    ListProductCategoryComponent,
    CompanyConfigurationComponent,
    MasterdataDialogComponent,
    WorkflowCreateComponent,
    WorkflowComponent,
    WorkflowDetailComponent,
    WorkflowListComponent,
    SystemParameterComponent, 
    PermissionCreateComponent, 
    EmailConfigurationComponent, 
    EmailCreateTemplateComponent,
    FolderConfigurationComponent,
    NotificationSettingComponent,
    NotificationSettingDetailComponent,
    NotificationSettingListComponent,
    MenuBuildComponent,
    AuditTraceComponent,
    BusinessGoalsComponent,
    ChonNvDialogComponent,
    TaoMoiQuyTrinhComponent,
    DanhSachQuyTrinhComponent,
    ThemQuyTrinhPheDuyetComponent,
    ChiTietQuyTrinhComponent,
  ],
  bootstrap: [
    OrganizationComponent,
    CreateComponent,
  ],
  entryComponents: [
    OrganizationComponent,
    CreateComponent,
    BankpopupComponent,
    MasterdataDialogComponent,
    ChonNvDialogComponent,
    ThemQuyTrinhPheDuyetComponent
  ],
  providers: [
    OrganizationService,
    PermissionService,
    CategoryService,
    ProvinceService,
    GetPermission,
    ProductCategoryService,
    ForderConfigurationService,
    MatSnackBarConfig,
    CustomerlevelService,
    BankService,
    EmployeeService,
    PositionService,
    WorkflowService,
    SystemParameterService,
    EmailConfigService,
    MessageService,
    NotifiSettingService,
    MenuBuildService,
    BusinessGoalsService,
    QuyTrinhService,
    ProjectService
  ]
})
export class AdminModule { }
