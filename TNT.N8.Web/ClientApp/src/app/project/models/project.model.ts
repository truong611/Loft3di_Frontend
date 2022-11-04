export class ProjectModel {
  projectId: string;
  projectCode: string;
  projectName: string;
  customerId: string;
  contractId: string;
  projectManagerId: string;
  employeeSM: Array<string>;
  employeeSub: Array<string>;
  description: string;
  projectType: string;
  projectTypeName: string;
  projectSize: string;
  projectStatus: string;
  projectStatusName: string;
  budgetVND: number;
  budgetUSD: number;
  budgetNgayCong: number;
  priority: number;
  priorityName: string;
  projectStartDate: Date;
  projectEndDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
  includeWeekend: Boolean;
  createdById: string;
  createdDate: Date;
  updatedById: string;
  updatedDate: Date;
  taskComplate: number;
  estimateCompleteTime: number;
  giaBanTheoGio: number;
  projectStatusPlan: Boolean;
  ngayKyNghiemThu: Date;

  constructor() {
    this.projectId = '00000000-0000-0000-0000-000000000000';
    this.projectCode = '';
    this.projectName = '';
    this.customerId = null;
    this.contractId = null;
    this.projectManagerId = null;
    this.employeeSM = [];
    this.employeeSub = [];
    this.description = null;
    this.projectType = null;
    this.projectSize = null;
    this.projectStatus = null;
    this.budgetVND = null;
    this.budgetUSD = null;
    this.budgetNgayCong = null;
    this.priority = null;
    this.projectStartDate = null;
    this.projectEndDate = null;
    this.actualStartDate = null;
    this.actualEndDate = null;
    this.includeWeekend = null;
    this.createdById = '00000000-0000-0000-0000-000000000000';
    this.createdDate = new Date();
    this.updatedById = null;
    this.updatedDate = null;
    this.giaBanTheoGio = 0;
    this.projectStatusPlan = null;
    this.ngayKyNghiemThu = null;
  }
}
