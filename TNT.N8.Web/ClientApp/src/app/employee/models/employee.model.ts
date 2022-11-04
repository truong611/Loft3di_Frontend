export class EmployeeModel {
  EmployeeId: string;
  EmployeeCode: string;
  EmployeeName: string;
  EmployeeLastname: string;
  EmployeeFirstname: string;
  StartedDate: Date;
  OrganizationId: string;
  PositionId: string;
  CreatedById: string;
  CreatedDate: Date;
  UpdatedById: string;
  UpdatedDate: Date;
  Active: Boolean;
  Username: string;
  Identity: string;
  OrganizationName: string;
  AvatarUrl: string;
  PositionName: string;
  ContactId: string;
  IsManager: boolean;
  PermissionSetId: string;
  ProbationEndDate: Date;
  ProbationStartDate: Date;
  TrainingStartDate: Date;
  ContractType: string;
  ContractEndDate: Date;
  IsTakeCare: boolean;
  IsXuLyPhanHoi: boolean;
  OrganizationLevel: number;
}

export class CreateEmployeeModel {
  HoTenTiengAnh: string;
  QuocTich: string;
  DanToc: string;
  TonGiao: string;
  StartDateMayChamCong: Date;
  PositionId: string;
  CreatedDate: Date;
  EmployeeCode: string;
  ViTriLamViec: string;
  TomTatHocVan: string;
  PhuongThucTuyenDungId: string;
  MucPhi: number;
}
