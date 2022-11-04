import { QuyTrinhService } from './../../../../../admin/services/quy-trinh.service';
import { FormatDateService } from './../../../../../shared/services/formatDate.services';
import { ValidaytorsService } from './../../../../../shared/services/validaytors.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetPermission } from '../../../../../shared/permission/get-permission';
import { MessageService, ConfirmationService } from "primeng/api";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EncrDecrService } from '../../../../../shared/services/encrDecr.service';
import { SalaryService } from '../../../../services/salary.service';
import { KyLuong } from '../../../../models/ky-luong.model';
import { CommonService } from '../../../../../shared/services/common.service';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { UpdateDieuKienTroCapCoDinhComponent } from '../update-dieu-kien-tro-cap-co-dinh/update-dieu-kien-tro-cap-co-dinh.component';
import { UpdateDieuKienTroCapKhacComponent } from '../update-dieu-kien-tro-cap-khac/update-dieu-kien-tro-cap-khac.component';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { saveAs } from "file-saver";

class columnModel {
  column1: string;
  column2: string;
}

@Component({
  selector: 'app-tong-quan-ky-luong',
  templateUrl: './tong-quan-ky-luong.component.html',
  styleUrls: ['./tong-quan-ky-luong.component.css']
})
export class TongQuanKyLuongComponent implements OnInit {
  loading: boolean = false;
  awaitResult: boolean = false;
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  isEdit: boolean = false;

  actionEdit: boolean = false;
  actionDelete: boolean = false;
  actionComplete: boolean = false;

  soLuongColDong: number
  countOTHERALLOWANCE: number
  countOTHERBONUS: number
  dataTamThoi: number = 0

  kyLuongId: number = 0;
  kyLuong: KyLuong = null;
  kyLuongClone: KyLuong = null;
  listDuLieuQuyTrinh: Array<any> = [];

  @ViewChild('myTable1') myTable1: Table;
  @ViewChild('myTable2') myTable2: Table;
  @ViewChild('myTable3') myTable3: Table;
  @ViewChild('myTable4') myTable4: Table;
  @ViewChild('myTable5') myTable5: Table;
  @ViewChild('myTable6') myTable6: Table;
  @ViewChild('myTable7') myTable7: Table;
  @ViewChild('myTable8') myTable8: Table;
  @ViewChild('myTable9') myTable9: Table;
  @ViewChild('myTable10') myTable10: Table;
  @ViewChild('myTable11') myTable11: Table;
  @ViewChild('myTable12') myTable12: Table;

  frozenCols1: Array<any> = [];
  frozenCols2: Array<any> = [];
  frozenCols3: Array<any> = [];
  frozenCols4: Array<any> = [];
  frozenCols5: Array<any> = [];
  frozenCols6: Array<any> = [];
  frozenCols7: Array<any> = [];
  frozenCols8: Array<any> = [];
  frozenCols9: Array<any> = [];
  frozenCols10: Array<any> = [];
  frozenCols11: Array<any> = [];
  frozenCols12: Array<any> = [];

  cols1: Array<any> = [];
  cols2: Array<any> = [];
  cols3: Array<any> = []; //Trợ cấp cố định
  cols4: Array<any> = []; //Trợ cấp khác
  cols5: Array<any> = []; //Trợ cấp OT
  cols6: Array<any> = []; //Thu nhập chỉ đưa vào tính thuế
  cols7: Array<any> = []; //Bảo hiểm
  cols8: Array<any> = []; //Giảm trừ trước thuế
  cols9: Array<any> = []; //Giảm trừ sau thuế
  cols10: Array<any> = []; //Hoàn lại sau thuế
  cols11: Array<any> = []; //Cty đóng
  cols12: Array<any> = []; //Khác

  listTongHopChamCong: Array<any> = [];
  listLuongTongHop: Array<any> = [];
  listLuongCtThuNhapTinhThue: Array<any> = [];
  listLuongCtBaoHiem: Array<any> = [];
  listLuongCtGiamTruTruocThue: Array<any> = [];
  listLuongCtGiamTruSauThue: Array<any> = [];
  listLuongCtHoanLaiSauThue: Array<any> = [];
  listLuongCtCtyDong: Array<any> = [];
  listLuongCtOther: Array<any> = [];

  trRowTroCapOt: Array<any> = [];
  trRowTroCapOtFrozen: Array<any> = [];
  listDataTroCapOt: Array<any> = [];

  trRowTroCapCoDinh: Array<any> = [];
  trRowTroCapCoDinhFrozen: Array<any> = [];
  listDataTroCapCoDinh: Array<any> = [];

  trRowTroCapKhac: Array<any> = [];
  trRowTroCapKhacFrozen: Array<any> = [];
  listDataTroCapKhac: Array<any> = [];

  listLoaiTroCapKhac: Array<any> = [];
  listSelectedLoaiTroCapKhac: Array<any> = [];

  isShowSua: boolean = false;
  isShowXoa: boolean = false;
  isShowGuiPheDuyet: boolean = false;
  isShowTuChoi: boolean = false;
  isShowPheDuyet: boolean = false;
  isShowDatVeMoi: boolean = false;

  kyluongForm: FormGroup;
  tenKyLuongControl: FormControl;
  soNgayLamViecControl: FormControl;
  tuNgayControl: FormControl;
  denNgayControl: FormControl;

  showLyDoTuChoi: boolean = false;

  lyDoTuChoiForm: FormGroup;
  lyDoTuChoiControl: FormControl;

  refreshNote = 0;
  tabIndex = 0;

  showChoseReport: boolean = false
  listBaoCao = [
    { value: 0, name: "Báo cáo tổng hợp" },
    { value: 1, name: "Due date contract" },
    { value: 2, name: "Meal Allowance" },
    { value: 3, name: "Time sheet" },
    { value: 4, name: "Early _Late report" },
    { value: 5, name: "Allowances" },
    { value: 521, name: "Tổng hợp nghỉ đột xuất" },
    { value: 9, name: "OT" },
    // { value: 10, name: "Payroll" },
    // { value: 91, name: "Tổng hợp OT" },
  ]
  baoCaoNumber: any

  @ViewChild('attachment') attachment: any;
  fileExcelImport: any = null;
  displayDialogImport: boolean = false;
  fileName: string = '';

  typeImport = 1; //1: import trợ cấp khác; 2: import lương chi tiết
  displayErrorDialog: boolean = false;
  messEmpHeThong: string = null;
  messEmpBangLuong: string = null;
  messLoaiTroCap: string = null;

  constructor(
    private getPermission: GetPermission,
    private router: Router,
    private route: ActivatedRoute,
    private salaryService: SalaryService,
    private messageService: MessageService,
    private validaytorsService: ValidaytorsService,
    private formatDateService: FormatDateService,
    private confirmationService: ConfirmationService,
    private quyTrinhService: QuyTrinhService,
    private encrDecrService: EncrDecrService,
    private commonService: CommonService,
    private dialogService: DialogService
  ) { }

  async ngOnInit() {
    this.setForm();
    this.initTable();

    this.route.params.subscribe(params => {
      this.kyLuongId = Number(this.encrDecrService.get(params['kyLuongId']));
    });

    await this._getPermission();

    this.getData();
  }

  setForm() {
    this.tenKyLuongControl = new FormControl(null, [Validators.required]);
    this.soNgayLamViecControl = new FormControl(null, [Validators.required]);
    this.tuNgayControl = new FormControl(null, [Validators.required]);
    this.denNgayControl = new FormControl(null, [Validators.required]);

    this.kyluongForm = new FormGroup({
      tenKyLuongControl: this.tenKyLuongControl,
      soNgayLamViecControl: this.soNgayLamViecControl,
      tuNgayControl: this.tuNgayControl,
      denNgayControl: this.denNgayControl,
    });

    this.kyluongForm.disable();

    this.lyDoTuChoiControl = new FormControl(null, [Validators.required, this.validaytorsService.forbiddenSpaceText]);

    this.lyDoTuChoiForm = new FormGroup({
      lyDoTuChoiControl: this.lyDoTuChoiControl
    });
  }

  initTable() {
    this.cols1 = [
      { field: "ngayLamViecThucTe", header: "Ngày làm việc thực tế", width: "130px", textAlign: "right", height: "80px" },
      { field: "congTac", header: "Công tác", width: "130px", textAlign: "right", height: "80px" },
      { field: "daoTaoHoiThao", header: "Đào tạo/hội thảo", width: "130px", textAlign: "right", height: "80px" },
      { field: "nghiPhep", header: "Nghỉ phép", width: "130px", textAlign: "right", height: "80px" },
      { field: "nghiLe", header: "Nghỉ lễ", width: "130px", textAlign: "right", height: "80px" },
      { field: "nghiCheDo", header: "Nghỉ chế độ", width: "130px", textAlign: "right", height: "80px" },
      { field: "nghiHuongLuongKhac", header: "Nghỉ hưởng lương khác", width: "130px", textAlign: "right", height: "80px" },
      { field: "nghiBu", header: "Nghỉ bù", width: "130px", textAlign: "right", height: "80px" },
      { field: "nghiHuongBhxh", header: "Nghỉ hưởng BHXH", width: "130px", textAlign: "right", height: "80px" },
      { field: "nghiKhongPhep", header: "Tự ý nghỉ không hưởng lương", width: "130px", textAlign: "right", height: "80px" },
      { field: "nghiKhongLuong", header: "Nghỉ không lương", width: "130px", textAlign: "right", height: "80px" },
      { field: "tongNgayDmvs", header: "Tổng ngày đi muộn/về sớm không được trả lương", width: "160px", textAlign: "right", height: "80px" },
      { field: "soLanTruChuyenCan", header: "Số lần trừ chuyên cần", width: "130px", textAlign: "right", height: "80px" },
      { field: "tongSoNgayKhongTinhLuong", header: "Tổng số ngày không tính lương", width: "130px", textAlign: "right", height: "80px" },
      { field: "tongSoNgayTinhLuong", header: "Tổng số ngày tính lương", width: "130px", textAlign: "right", height: "80px" },
      { field: "tongNgayNghiTinhTroCapChuyenCan", header: "Tổng ngày nghỉ tính trợ cấp chuyên cần", width: "150px", textAlign: "right", height: "80px" },
    ];

    this.frozenCols1 = [
      { field: "stt", header: "#", width: "40px", textAlign: "center", height: "80px" },
      { field: "employeeCode", header: "Mã nhân viên", width: "150px", textAlign: "left", height: "80px" },
      { field: "subCode1", header: "Mã phòng ban", width: "90px", textAlign: "left", height: "80px" },
      { field: "employeeName", header: "Họ tên", width: "200px", textAlign: "left", height: "80px" }
    ]

    this.cols2 = [
      { field: "tongNgayTinhLuong", header: "Total payable day for this month, including Holiday (Mon-Fri)(Tổng ngày tính lương)", width: "180px", textAlign: "right" },
      { field: "mucLuongCu", header: "GROSS SALARY LAST MONTH/ VOCATIONAL TRAINING/ PROBATION(Mức lương cũ)", width: "150px", textAlign: "right" },
      { field: "soNgayMucLuongCu", header: "Actual working day with old salary (Số ngày tính theo mức lương cũ)", width: "160px", textAlign: "right" },
      { field: "mucLuongHienTai", header: "NEW GROSS MI TO SIGN LABOR CONTRACT THIS MONTH (Mức lương hiện tại)", width: "150px", textAlign: "right" },
      { field: "luongThucTe", header: "NEW GROSS BASED ON ACTUAL WORKING DAY (Lương thực tế)", width: "150px", textAlign: "right" },
      { field: "khoanBuTruThangTruoc", header: "PAYBACK - GROSS BASIC IF ANY (Khoản bù trừ tháng trước)", width: "150px", textAlign: "right" },
      { field: "luongOtTinhThue", header: "Taxable income O.T (Lương OT tính thuế)", width: "150px", textAlign: "right" },
      { field: "luongOtKhongTinhThue", header: "Tax exempt O.T (Lương OT không tính thuế)", width: "150px", textAlign: "right" },
      { field: "tongTroCapCoDinh", header: "TOTAL GROSS ALLOWANCE (Tổng trợ cấp cố định)", width: "150px", textAlign: "right" },
      { field: "tongTroCapKhac", header: "TOTAL BONUS (Tổng trợ cấp khác)", width: "150px", textAlign: "right" },
      { field: "troCapKhacKhongTinhThue", header: "ADDED NET  ALLOWANCE - TAX EXAMPTION FOR EMPLOYEE/ TAXABLE BY COMPANY Trợ cấp khác không tính thuế", width: "180px", textAlign: "right" },
      { field: "khauTruHoanLaiTruocThue", header: "DEDUCTION FROM EMPLOYEE/ Refund company before Tax (Over paid AL) (Khấu trừ/Hoàn lại trước thuế)", width: "180px", textAlign: "right" },
      { field: "tongThuNhapBaoGomThueVaKhongThue", header: "GRAND TOTAL GROSS (BF deduct OT Examption & Severance allowance yet) (Tổng thu nhập bao gồm cả các khoản tính thuế và không tính thuế)", width: "200px", textAlign: "right" },
      { field: "tongThuNhapSauKhiBoCacKhoanKhongTinhThue", header: "GRAND TOTAL GROSS (After deduct OT Examption, Severance allowance) (Tổng thu nhập sau khi đã loại bỏ các khoản không chịu thuế)", width: "200px", textAlign: "right" },
      { field: "giamTruTruocThue", header: "OTHER DEDUCTION BEFORE TAX (TAX EXAMPTION) (Giảm trừ trước thuế)", width: "150px", textAlign: "right" },
      { field: "thuNhapChiDuaVaoTinhThue", header: "OTHER ADDED TO CALCULATED TAX ONLY, none of those benefits be paid through payroll (Thu nhập chỉ đưa vào tính thuế)", width: "190px", textAlign: "right" },
      { field: "tongThuNhapChiuThueSauGiamTru", header: "TOTAL GROSS SALARY AFTER DEDUCT TAX EXAMPTION (Tổng thu nhập chịu thuế sau giảm trừ)", width: "180px", textAlign: "right" },
      { field: "tongThueTncnCtyVaNld", header: "TOTAL PIT PAYMENT PAID BY COMPANY AND EMPLOYEE (Tổng thuế TNCN phải trả bởi công ty và NLĐ)", width: "180px", textAlign: "right" },
      { field: "thueTncnNld", header: "TOTAL PIT PAYMENT_Borne by employee (Thuế TNCN NLĐ phải trả)", width: "150px", textAlign: "right" },
      { field: "luongCoBanDongBh", header: "Basic salary for SI, AI & HI, Trade Union from 1.7.2019 (Lương cơ bản đóng BHXH, BHYT, BHNN, KPCĐ)", width: "180px", textAlign: "right" },
      { field: "tongTienBhNldPhaiDong", header: "Total employee_SI, AI, UI and HI _10.5% (Tổng tiền BH NLĐ phải đóng)", width: "150px", textAlign: "right" },
      { field: "tongTienBhCtyPhaiDong", header: "Total Company_SI, AI, UI and HI _21.5% (Tổng tiền BH Công ty phải đóng)", width: "150px", textAlign: "right" },
      { field: "thuNhapThucNhanTruocKhiBuTruThue", header: "Net Income BEFORE ADD/ DEDUCT AFTER TAX (Thu nhập thực nhận trước khi bù trừ thuế nếu có)", width: "180px", textAlign: "right" },
      { field: "cacKhoanGiamTruSauThue", header: "Other deduction after Tax (Các khoản giảm trừ sau thuế)", width: "150px", textAlign: "right" },
      { field: "cacKhoanHoanLaiSauThue", header: "Other Additional after Tax (Các khoản hoàn lại sau thuế)", width: "150px", textAlign: "right" },
      { field: "thuNhapThucNhan", header: "TOTAL NET INCOME PAYABLE (Thu nhập thực nhận)", width: "150px", textAlign: "right" },
      { field: "luongTamUng", header: "Paid - 1st time if any Đã trả lần 1 nếu có (hoặc tạm ứng)", width: "150px", textAlign: "right" },
      { field: "luongConLai", header: "NET RECEIVE THIS MONTH (Thực nhận trong tháng)", width: "150px", textAlign: "right" },
      { field: "cacKhoanCtyPhaiTraKhac", header: "Other company payable (Các khoản công ty phải trả khác)", width: "150px", textAlign: "right" },
      { field: "tongChiPhiCtyPhaiTra", header: "Tổng chi phí công ty phải trả", width: "150px", textAlign: "right" },
    ];

    this.frozenCols2 = [
      { field: "stt", header: "#", width: "40px", textAlign: "center" },
      { field: "employeeCode", header: "Mã nhân viên", width: "150px", textAlign: "left" },
      { field: "subCode1", header: "Mã phòng ban", width: "90px", textAlign: "left" },
      { field: "employeeName", header: "Họ tên", width: "200px", textAlign: "left" },
      { field: "positionName", header: "Chức vụ", width: "130px", textAlign: "left" },
    ]

    this.cols6 = [
      { field: "netToGross", header: "Convert from Net to Gross to pay Tax (Chuyển từ net sang gross)", width: "150px", textAlign: "right" },
      { field: "month13", header: "13th monthy salary (Lương tháng 13)", width: "150px", textAlign: "right" },
      { field: "gift", header: "Tet gifts, Cash gift receiving during year-end meeting, Cash Tet bonus (Quà tết)", width: "180px", textAlign: "right" },
      { field: "other", header: "Other Net to pay PIT/ Gross salary and bonus (Khoản khác)", width: "150px", textAlign: "right" },
      { field: "sum", header: "Tổng", width: "150px", textAlign: "right" },
    ];

    this.frozenCols6 = [
      { field: "stt", header: "#", width: "40px", textAlign: "center" },
      { field: "employeeCode", header: "Mã nhân viên", width: "150px", textAlign: "left" },
      { field: "subCode1", header: "Mã phòng ban", width: "90px", textAlign: "left" },
      { field: "employeeName", header: "Họ tên", width: "200px", textAlign: "left" },
      { field: "positionName", header: "Chức vụ", width: "130px", textAlign: "left" },
    ]

    this.cols7 = [
      { field: "baseBhxh", header: "Lương cơ bản đóng BHXH", width: "150px", textAlign: "right" },
      { field: "bhxh", header: "Social Ins (BHXH)", width: "150px", textAlign: "right" },
      { field: "bhyt", header: "H.I (BHYT)", width: "150px", textAlign: "right" },
      { field: "bhtn", header: "Unemployment Ins (BHTN)", width: "150px", textAlign: "right" },
      { field: "bhtnnn", header: "Accident Ins (BHTNNN)", width: "150px", textAlign: "right" },
      { field: "other", header: "Additional SI, AI, HI, UI payback ….Paid in this month if any (Các khoản vể BH bắt buộc bù trừ tháng trước phải trả vào tháng này nếu có)", width: "250px", textAlign: "right" },
      { field: "sum", header: "Tổng", width: "150px", textAlign: "right" },
    ];

    this.frozenCols7 = [
      { field: "stt", header: "#", width: "40px", textAlign: "center" },
      { field: "employeeCode", header: "Mã nhân viên", width: "150px", textAlign: "left" },
      { field: "subCode1", header: "Mã phòng ban", width: "90px", textAlign: "left" },
      { field: "employeeName", header: "Họ tên", width: "200px", textAlign: "left" },
      { field: "positionName", header: "Chức vụ", width: "130px", textAlign: "left" },
    ]

    this.cols8 = [
      { field: "giamTruCaNhan", header: "Personal Deduction (Giảm trừ cá nhân)", width: "150px", textAlign: "right" },
      { field: "giamTruNguoiPhuThuoc", header: "Dependant Amount (Giảm trừ người phụ thuộc)", width: "150px", textAlign: "right" },
      { field: "tienDongBaoHiem", header: "Obligation 10.5%_Employee's side (Số tiền đóng bảo hiểm)", width: "150px", textAlign: "right" },
      { field: "giamTruKhac", header: "Other deduction (Các khoản giảm trừ trước thuế khác)", width: "150px", textAlign: "right" },
      { field: "sum", header: "Tổng", width: "150px", textAlign: "right" },
    ];

    this.frozenCols8 = [
      { field: "stt", header: "#", width: "40px", textAlign: "center" },
      { field: "employeeCode", header: "Mã nhân viên", width: "150px", textAlign: "left" },
      { field: "subCode1", header: "Mã phòng ban", width: "90px", textAlign: "left" },
      { field: "employeeName", header: "Họ tên", width: "200px", textAlign: "left" },
      { field: "positionName", header: "Chức vụ", width: "130px", textAlign: "left" },
    ]

    this.cols9 = [
      { field: "kinhPhiCongDoan", header: "T.U_Employee (KPCĐ)", width: "150px", textAlign: "right" },
      { field: "quyetToanThueTncn", header: "PIT liquidation (Quyết toán thuế TNCN)", width: "150px", textAlign: "right" },
      { field: "other", header: "Other deduction after Tax (Các khoản giảm trừ sau thuế khác)", width: "150px", textAlign: "right" },
      { field: "sum", header: "Tổng", width: "150px", textAlign: "right" },
    ];

    this.frozenCols9 = [
      { field: "stt", header: "#", width: "40px", textAlign: "center" },
      { field: "employeeCode", header: "Mã nhân viên", width: "150px", textAlign: "left" },
      { field: "subCode1", header: "Mã phòng ban", width: "90px", textAlign: "left" },
      { field: "employeeName", header: "Họ tên", width: "200px", textAlign: "left" },
      { field: "positionName", header: "Chức vụ", width: "130px", textAlign: "left" },
    ]

    this.cols10 = [
      { field: "thueTncn", header: "PIT Refund PIT last month (Thuế TNCN hoàn lại nếu có)", width: "150px", textAlign: "right" },
      { field: "other", header: "Other add after Tax (Các khoản cộng thêm sau thuế khác)", width: "150px", textAlign: "right" },
      { field: "sum", header: "Tổng", width: "150px", textAlign: "right" },
    ];

    this.frozenCols10 = [
      { field: "stt", header: "#", width: "40px", textAlign: "center" },
      { field: "employeeCode", header: "Mã nhân viên", width: "150px", textAlign: "left" },
      { field: "subCode1", header: "Mã phòng ban", width: "90px", textAlign: "left" },
      { field: "employeeName", header: "Họ tên", width: "200px", textAlign: "left" },
      { field: "positionName", header: "Chức vụ", width: "130px", textAlign: "left" },
    ]

    this.cols11 = [
      { field: "baseBhxh", header: "Lương cơ bản đóng BHXH", width: "150px", textAlign: "right" },
      { field: "bhxh", header: "Social Ins (BHXH)", width: "150px", textAlign: "right" },
      { field: "bhyt", header: "H.I (BHYT)", width: "150px", textAlign: "right" },
      { field: "bhtn", header: "Unemployment Ins (BHTN)", width: "150px", textAlign: "right" },
      { field: "bhtnnn", header: "Accident Ins (BHTNNN)", width: "150px", textAlign: "right" },
      { field: "kinhPhiCongDoan", header: "T.U_Company (KPCĐ)", width: "150px", textAlign: "right" },
      { field: "other", header: "Additional SI, AI, HI, UI payback …. Paid in this month if any (Các khoản vể BH bắt buộc bù trừ tháng trước phải trả vào tháng này công ty phải đóng nếu có)", width: "250px", textAlign: "right" },
      { field: "fundOct", header: "Fund_Oct", width: "150px", textAlign: "right" },
      { field: "sum", header: "Tổng", width: "150px", textAlign: "right" },
    ];

    this.frozenCols11 = [
      { field: "stt", header: "#", width: "40px", textAlign: "center" },
      { field: "employeeCode", header: "Mã nhân viên", width: "150px", textAlign: "left" },
      { field: "subCode1", header: "Mã phòng ban", width: "90px", textAlign: "left" },
      { field: "employeeName", header: "Họ tên", width: "200px", textAlign: "left" },
      { field: "positionName", header: "Chức vụ", width: "130px", textAlign: "left" },
    ]

    this.cols12 = [
      { field: "khoanBuTruThangTruoc", header: "PAYBACK - GROSS BASIC IF ANY (Khoản bù trừ tháng trước)", width: "150px", textAlign: "right" },
      { field: "troCapKhacKhongTinhThue", header: "ADDED NET ALLOWANCE - TAX EXAMPTION FOR EMPLOYEE/ TAXABLE BY COMPANY (Trợ cấp khác không tính thuế)", width: "200px", textAlign: "right" },
      { field: "khauTruHoanLaiTruocThue", header: "DEDUCTION FROM EMPLOYEE/ Refund company before Tax (Over paid AL) (Khấu trừ/Hoàn lại trước thuế)", width: "200px", textAlign: "right" },
      { field: "luongTamUng", header: "Paid - 1st time if any Đã trả lần 1 nếu có (hoặc tạm ứng)", width: "150px", textAlign: "right" },
    ];

    this.frozenCols12 = [
      { field: "stt", header: "#", width: "40px", textAlign: "center" },
      { field: "employeeCode", header: "Mã nhân viên", width: "150px", textAlign: "left" },
      { field: "subCode1", header: "Mã phòng ban", width: "90px", textAlign: "left" },
      { field: "employeeName", header: "Họ tên", width: "200px", textAlign: "left" },
      { field: "positionName", header: "Chức vụ", width: "130px", textAlign: "left" },
    ]
  }

  async _getPermission() {
    let resource = "salary/salary/ky-luong-detail/";
    this.loading = true;
    let permission: any = await this.getPermission.getPermission(resource);
    this.loading = false;

    if (permission.status == false) {
      this.router.navigate(["/home"]);
      return;
    }

    if (permission.listCurrentActionResource.indexOf("complete") != -1) {
      this.actionComplete = true;
    }

    if (permission.listCurrentActionResource.indexOf("edit") != -1) {
      this.actionEdit = true;
    }

    if (permission.listCurrentActionResource.indexOf("delete") != -1) {
      this.actionDelete = true;
    }
  }

  async getData() {
    this.loading = true;
    this.awaitResult = true;
    let result: any = await this.salaryService.getKyLuongById(this.kyLuongId);
    this.loading = false;
    this.awaitResult = false;

    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    this.kyLuong = result.kyLuong;
    this.kyLuongClone = result.kyLuong;
    this.listTongHopChamCong = result.listTongHopChamCong;
    this.listLuongTongHop = result.listLuongTongHop;
    this.listLuongCtThuNhapTinhThue = result.listLuongCtThuNhapTinhThue;
    this.listLuongCtBaoHiem = result.listLuongCtBaoHiem;
    this.listLuongCtGiamTruTruocThue = result.listLuongCtGiamTruTruocThue;
    this.listLuongCtGiamTruSauThue = result.listLuongCtGiamTruSauThue;
    this.listLuongCtHoanLaiSauThue = result.listLuongCtHoanLaiSauThue;
    this.listLuongCtCtyDong = result.listLuongCtCtyDong;
    this.listLuongCtOther = result.listLuongCtOther;
    this.trRowTroCapOt = result.listDataHeaderTroCapOt;
    this.trRowTroCapOtFrozen = [result.listDataHeaderTroCapOt[0].filter(item => item.columnKey == 'stt' || item.columnKey == 'employeeCode' || item.columnKey == 'subCode1' || item.columnKey == 'employeeName' || item.columnKey == 'positionName')];
    this.trRowTroCapOt[0] = this.trRowTroCapOt[0].filter(item => item.columnKey != 'stt' && item.columnKey != 'employeeCode' && item.columnKey != 'subCode1' && item.columnKey != 'employeeName' && item.columnKey != 'positionName')
    this.buildData(result.listDataTroCapCoDinh, 2);
    this.buildData(result.listDataTroCapOt, 1);
    this.trRowTroCapCoDinh = result.listDataHeaderTroCapCoDinh;
    this.trRowTroCapCoDinhFrozen = [result.listDataHeaderTroCapCoDinh[0].filter(item => item.columnKey == 'stt' || item.columnKey == 'employeeCode' || item.columnKey == 'subCode1' || item.columnKey == 'employeeName' || item.columnKey == 'positionName')];
    this.trRowTroCapCoDinh[0] = this.trRowTroCapCoDinh[0].filter(item => item.columnKey != 'stt' && item.columnKey != 'employeeCode' && item.columnKey != 'subCode1' && item.columnKey != 'employeeName' && item.columnKey != 'positionName')
    this.buildData(result.listDataTroCapCoDinh, 2);
    this.listLoaiTroCapKhac = result.listLoaiTroCapKhac;
    this.listSelectedLoaiTroCapKhac = result.listSelectedLoaiTroCapKhac;
    this.trRowTroCapKhac = result.listDataHeaderTroCapKhac;
    this.trRowTroCapKhacFrozen = [result.listDataHeaderTroCapKhac[0].filter(item => item.columnKey == 'stt' || item.columnKey == 'employeeCode' || item.columnKey == 'subCode1' || item.columnKey == 'employeeName' || item.columnKey == 'positionName')];
    this.trRowTroCapKhac[0] = this.trRowTroCapKhac[0].filter(item => item.columnKey != 'stt' && item.columnKey != 'employeeCode' && item.columnKey != 'subCode1' && item.columnKey != 'employeeName' && item.columnKey != 'positionName')
    this.buildData(result.listDataTroCapKhac, 3);
    this.isShowGuiPheDuyet = result.isShowGuiPheDuyet;
    this.isShowPheDuyet = result.isShowPheDuyet;
    this.isShowTuChoi = result.isShowTuChoi;
    this.isShowDatVeMoi = result.isShowDatVeMoi;
    this.isShowXoa = result.isShowXoa;
    this.isShowSua = result.isShowSua;

    if (!this.isShowSua) {
      this.kyluongForm.disable();
      this.isEdit = false;
    }

    this.mapDataToForm(this.kyLuong);

    this.getDuLieuQuyTrinh();
  }

  mapDataToForm(kyLuong: KyLuong) {
    this.tenKyLuongControl.setValue(kyLuong.tenKyLuong);
    this.soNgayLamViecControl.setValue(kyLuong.soNgayLamViec);
    this.tuNgayControl.setValue(new Date(kyLuong.tuNgay));
    this.denNgayControl.setValue(new Date(kyLuong.denNgay));
  }

  async save() {
    if (!this.kyluongForm.valid) {
      Object.keys(this.kyluongForm.controls).forEach(key => {
        if (!this.kyluongForm.controls[key].valid) {
          this.kyluongForm.controls[key].markAsTouched();
        }
      });

      this.showMessage('warn', 'Bạn chưa nhập đủ thông tin');
      return;
    }

    this.confirmationService.confirm({
      message: `Bạn chắc chắn đã lưu thông tin chỉnh sửa ở các tab chi tiết?`,
      accept: async () => {
        let kyLuong = new KyLuong();
        kyLuong.kyLuongId = this.kyLuongId;
        kyLuong.tenKyLuong = this.tenKyLuongControl.value.trim();
        kyLuong.soNgayLamViec = this.commonService.convertStringToNumber(this.soNgayLamViecControl.value.toString());
        kyLuong.tuNgay = this.formatDateService.convertToUTCTime(this.tuNgayControl.value);
        kyLuong.denNgay = this.formatDateService.convertToUTCTime(this.denNgayControl.value);

        this.loading = true;
        this.awaitResult = true;
        let result: any = await this.salaryService.createOrUpdateKyLuong(kyLuong);

        if (result.statusCode != 200) {
          this.loading = false;
          this.awaitResult = false;
          this.showMessage("error", result.messageCode);
          return;
        }

        this.isEdit = false;
        this.kyluongForm.disable();
        this.showMessage("success", result.messageCode);
        this.getData();
      },
    });
  }

  async xoa() {
    this.confirmationService.confirm({
      message: `Dữ liệu không thể hoàn tác, bạn chắc chắn muốn xóa?`,
      accept: async () => {
        this.loading = true;
        this.awaitResult = true;
        let result: any = await this.salaryService.deleteKyLuong(this.kyLuongId);

        if (result.statusCode != 200) {
          this.loading = false;
          this.awaitResult = false;
          this.showMessage("error", result.messageCode);
          return;
        }

        this.showMessage("success", result.messageCode);
        setTimeout(() => {
          this.router.navigate(['/salary/ky-luong-list']);
        }, 1500);
      },
    });
  }

  guiPheDuyet() {
    this.loading = true;
    this.awaitResult = true;
    this.quyTrinhService.guiPheDuyet(this.emptyGuid, 14, this.kyLuongId).subscribe(res => {
      let result: any = res;

      if (result.statusCode != 200) {
        this.loading = false;
        this.awaitResult = false;
        this.showMessage("error", result.messageCode);
        return;
      }

      this.showMessage("success", result.messageCode);
      this.getData();
      this.refreshNote++;
    });
  }

  showLyDoTuChoiDialog() {
    this.showLyDoTuChoi = true;
    this.lyDoTuChoiForm.reset();
  }

  closeLyDoTuChoi() {
    this.showLyDoTuChoi = false;
  }

  tuChoi() {
    if (!this.lyDoTuChoiForm.valid) {
      Object.keys(this.lyDoTuChoiForm.controls).forEach(key => {
        if (!this.lyDoTuChoiForm.controls[key].valid) {
          this.lyDoTuChoiForm.controls[key].markAsTouched();
        }
      });

      this.showMessage('warn', 'Bạn chưa nhập đủ thông tin');
      return;
    }

    this.loading = true;
    this.awaitResult = true;
    this.quyTrinhService.tuChoi(this.emptyGuid, 14, this.lyDoTuChoiControl.value?.trim(), this.kyLuongId).subscribe(async res => {
      let result: any = res;

      if (result.statusCode != 200) {
        this.loading = false;
        this.awaitResult = false;
        this.showMessage("error", result.messageCode);
        return;
      }

      this.showMessage("success", result.messageCode);
      await this.getData();
      this.refreshNote++;
      this.showLyDoTuChoi = false;
    });
  }

  pheDuyet() {
    this.loading = true;
    this.awaitResult = true;
    this.quyTrinhService.pheDuyet(this.emptyGuid, 14, null, this.kyLuongId).subscribe(res => {
      let result: any = res;

      if (result.statusCode != 200) {
        this.loading = false;
        this.awaitResult = false;
        this.showMessage("error", result.messageCode);
        return;
      }

      this.showMessage("success", result.messageCode);
      this.getData();
      this.refreshNote++;
    });
  }

  async datVeMoi() {
    this.loading = true;
    this.awaitResult = true;
    let result: any = await this.salaryService.datVeMoiKyLuong(this.kyLuongId);

    if (result.statusCode != 200) {
      this.loading = false;
      this.awaitResult = false;
      this.showMessage("error", result.messageCode);
      return;
    }

    this.showMessage("success", result.messageCode);
    this.getData();
    this.refreshNote++;
  }

  sua() {
    this.isEdit = true;
    this.kyluongForm.enable();
  }

  huySua() {
    this.mapDataToForm(this.kyLuongClone);
    this.isEdit = false;
    this.kyluongForm.disable();
  }

  getDuLieuQuyTrinh() {
    this.quyTrinhService.getDuLieuQuyTrinh(this.emptyGuid, 14, this.kyLuongId).subscribe(res => {
      let result: any = res;

      if (result.statusCode != 200) {
        this.showMessage("error", result.messageCode);
        return;
      }

      this.listDuLieuQuyTrinh = result.listDuLieuQuyTrinh;
    });
  }

  tinhTongThuNhapTinhThue() {
    this.listLuongCtThuNhapTinhThue.forEach(item => {
      let netToGross = 0;
      if (item.netToGross != null && item.netToGross != '') {
        netToGross = this.commonService.convertStringToNumber(item.netToGross.toString());
      }
      item.netToGross = netToGross;

      let month13 = 0;
      if (item.month13 != null && item.month13 != '') {
        month13 = this.commonService.convertStringToNumber(item.month13.toString());
      }
      item.month13 = month13;

      let gift = 0;
      if (item.gift != null && item.gift != '') {
        gift = this.commonService.convertStringToNumber(item.gift.toString());
      }
      item.gift = gift;

      let other = 0;
      if (item.other != null && item.other != '') {
        other = this.commonService.convertStringToNumber(item.other.toString());
      }
      item.other = other;

      item.sum = item.netToGross + item.month13 + item.gift + item.other;
    });
  }

  async saveThuNhapTinhThue() {
    this.loading = true;
    this.awaitResult = true;
    this.tinhTongThuNhapTinhThue();
    let result: any = await this.salaryService.saveThuNhapTinhThue(this.listLuongCtThuNhapTinhThue);
    this.loading = false;
    this.awaitResult = false;

    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    this.showMessage("success", result.messageCode);
  }

  tinhTongBaoHiem() {
    this.listLuongCtBaoHiem.forEach(item => {
      let other = 0;
      if (item.other != null && item.other != '') {
        other = this.commonService.convertStringToNumber(item.other.toString());
      }
      item.other = other;

      item.sum = item.bhxh + item.bhyt + item.bhtn + item.bhtnnn + item.other;
    });
  }

  async saveBaoHiem() {
    this.loading = true;
    this.awaitResult = true;
    this.tinhTongBaoHiem();
    let result: any = await this.salaryService.saveBaoHiem(this.listLuongCtBaoHiem);
    this.loading = false;
    this.awaitResult = false;

    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    this.showMessage("success", result.messageCode);
  }

  tinhTongGiamTruTruocThue() {
    this.listLuongCtGiamTruTruocThue.forEach(item => {
      let giamTruCaNhan = 0;
      if (item.giamTruCaNhan != null && item.giamTruCaNhan != '') {
        giamTruCaNhan = this.commonService.convertStringToNumber(item.giamTruCaNhan.toString());
      }
      item.giamTruCaNhan = giamTruCaNhan;

      let giamTruNguoiPhuThuoc = 0;
      if (item.giamTruNguoiPhuThuoc != null && item.giamTruNguoiPhuThuoc != '') {
        giamTruNguoiPhuThuoc = this.commonService.convertStringToNumber(item.giamTruNguoiPhuThuoc.toString());
      }
      item.giamTruNguoiPhuThuoc = giamTruNguoiPhuThuoc;

      let tienDongBaoHiem = 0;
      if (item.tienDongBaoHiem != null && item.tienDongBaoHiem != '') {
        tienDongBaoHiem = this.commonService.convertStringToNumber(item.tienDongBaoHiem.toString());
      }
      item.tienDongBaoHiem = tienDongBaoHiem;

      let giamTruKhac = 0;
      if (item.giamTruKhac != null && item.giamTruKhac != '') {
        giamTruKhac = this.commonService.convertStringToNumber(item.giamTruKhac.toString());
      }
      item.giamTruKhac = giamTruKhac;

      item.sum = item.giamTruCaNhan + item.giamTruNguoiPhuThuoc + item.tienDongBaoHiem + item.giamTruKhac;
    });
  }

  async saveGiamTruTruocThue() {
    this.loading = true;
    this.awaitResult = true;
    this.tinhTongGiamTruTruocThue();
    let result: any = await this.salaryService.saveGiamTruTruocThue(this.listLuongCtGiamTruTruocThue);
    this.loading = false;
    this.awaitResult = false;

    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    this.showMessage("success", result.messageCode);
  }

  tinhTongGiamTruSauThue() {
    this.listLuongCtGiamTruSauThue.forEach(item => {
      let kinhPhiCongDoan = 0;
      if (item.kinhPhiCongDoan != null && item.kinhPhiCongDoan != '') {
        kinhPhiCongDoan = this.commonService.convertStringToNumber(item.kinhPhiCongDoan.toString());
      }
      item.kinhPhiCongDoan = kinhPhiCongDoan;

      let quyetToanThueTncn = 0;
      if (item.quyetToanThueTncn != null && item.quyetToanThueTncn != '') {
        quyetToanThueTncn = this.commonService.convertStringToNumber(item.quyetToanThueTncn.toString());
      }
      item.quyetToanThueTncn = quyetToanThueTncn;

      let other = 0;
      if (item.other != null && item.other != '') {
        other = this.commonService.convertStringToNumber(item.other.toString());
      }
      item.other = other;

      item.sum = item.kinhPhiCongDoan + item.quyetToanThueTncn + item.other;
    });
  }

  async saveGiamTruSauThue() {
    this.loading = true;
    this.awaitResult = true;
    this.tinhTongGiamTruSauThue();
    let result: any = await this.salaryService.saveGiamTruSauThue(this.listLuongCtGiamTruSauThue);
    this.loading = false;
    this.awaitResult = false;

    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    this.showMessage("success", result.messageCode);
  }

  tinhTongHoanLaiSauThue() {
    this.listLuongCtHoanLaiSauThue.forEach(item => {
      let thueTncn = 0;
      if (item.thueTncn != null && item.thueTncn != '') {
        thueTncn = this.commonService.convertStringToNumber(item.thueTncn.toString());
      }
      item.thueTncn = thueTncn;

      let other = 0;
      if (item.other != null && item.other != '') {
        other = this.commonService.convertStringToNumber(item.other.toString());
      }
      item.other = other;

      item.sum = item.thueTncn + item.other;
    });
  }

  async saveHoanLaiSauThue() {
    this.loading = true;
    this.awaitResult = true;
    this.tinhTongHoanLaiSauThue();
    let result: any = await this.salaryService.saveHoanLaiSauThue(this.listLuongCtHoanLaiSauThue);
    this.loading = false;
    this.awaitResult = false;

    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    this.showMessage("success", result.messageCode);
  }

  tinhTongCtyDong() {
    this.listLuongCtCtyDong.forEach(item => {
      let bhxh = 0;
      if (item.bhxh != null && item.bhxh != '') {
        bhxh = this.commonService.convertStringToNumber(item.bhxh.toString());
      }
      item.bhxh = bhxh;

      let bhyt = 0;
      if (item.bhyt != null && item.bhyt != '') {
        bhyt = this.commonService.convertStringToNumber(item.bhyt.toString());
      }
      item.bhyt = bhyt;

      let bhtn = 0;
      if (item.bhtn != null && item.bhtn != '') {
        bhtn = this.commonService.convertStringToNumber(item.bhtn.toString());
      }
      item.bhtn = bhtn;

      let bhtnnn = 0;
      if (item.bhtnnn != null && item.bhtnnn != '') {
        bhtnnn = this.commonService.convertStringToNumber(item.bhtnnn.toString());
      }
      item.bhtnnn = bhtnnn;

      let kinhPhiCongDoan = 0;
      if (item.kinhPhiCongDoan != null && item.kinhPhiCongDoan != '') {
        kinhPhiCongDoan = this.commonService.convertStringToNumber(item.kinhPhiCongDoan.toString());
      }
      item.kinhPhiCongDoan = kinhPhiCongDoan;

      let other = 0;
      if (item.other != null && item.other != '') {
        other = this.commonService.convertStringToNumber(item.other.toString());
      }
      item.other = other;

      let fundOct = 0;
      if (item.fundOct != null && item.fundOct != '') {
        fundOct = this.commonService.convertStringToNumber(item.fundOct.toString());
      }
      item.fundOct = fundOct;

      item.sum = item.bhxh + item.bhyt + item.bhtn + item.bhtnnn + item.kinhPhiCongDoan + item.other + item.fundOct;
    });
  }

  async saveCtyDong() {
    this.loading = true;
    this.awaitResult = true;
    this.tinhTongCtyDong();
    let result: any = await this.salaryService.saveCtyDong(this.listLuongCtCtyDong);
    this.loading = false;
    this.awaitResult = false;

    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    this.showMessage("success", result.messageCode);
  }

  tinhTongOther() {
    this.listLuongCtOther.forEach(item => {
      let khoanBuTruThangTruoc = 0;
      if (item.khoanBuTruThangTruoc != null && item.khoanBuTruThangTruoc != '') {
        khoanBuTruThangTruoc = this.commonService.convertStringToNumber(item.khoanBuTruThangTruoc.toString());
      }
      item.khoanBuTruThangTruoc = khoanBuTruThangTruoc;

      let troCapKhacKhongTinhThue = 0;
      if (item.troCapKhacKhongTinhThue != null && item.troCapKhacKhongTinhThue != '') {
        troCapKhacKhongTinhThue = this.commonService.convertStringToNumber(item.troCapKhacKhongTinhThue.toString());
      }
      item.troCapKhacKhongTinhThue = troCapKhacKhongTinhThue;

      let khauTruHoanLaiTruocThue = 0;
      if (item.khauTruHoanLaiTruocThue != null && item.khauTruHoanLaiTruocThue != '') {
        khauTruHoanLaiTruocThue = this.commonService.convertStringToNumber(item.khauTruHoanLaiTruocThue.toString());
      }
      item.khauTruHoanLaiTruocThue = khauTruHoanLaiTruocThue;

      let luongTamUng = 0;
      if (item.luongTamUng != null && item.luongTamUng != '') {
        luongTamUng = this.commonService.convertStringToNumber(item.luongTamUng.toString());
      }
      item.luongTamUng = luongTamUng;

      item.sum = item.khoanBuTruThangTruoc + item.troCapKhacKhongTinhThue + item.khauTruHoanLaiTruocThue + item.luongTamUng;
    });
  }

  async saveOther() {
    this.loading = true;
    this.awaitResult = true;
    this.tinhTongOther();
    let result: any = await this.salaryService.saveOther(this.listLuongCtOther);
    this.loading = false;
    this.awaitResult = false;

    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    this.showMessage("success", result.messageCode);
  }

  buildData(list: Array<any>, type: number) {
    //Trợ cấp OT
    if (type == 1) {
      this.cols5 = [];
      this.listDataTroCapOt = [];

      if (list.length) {
        list[0].forEach(item => {
          if (item.isShow) {
            let col = {
              field: item.columnKey,
              header: item.columnKey,
              width: item.width,
              textAlign: item.textAlign
            };
            if (item.columnKey == 'stt' || item.columnKey == 'employeeCode' || item.columnKey == 'subCode1' || item.columnKey == 'employeeName' || item.columnKey == 'positionName') {
              this.frozenCols5.push(col);
            } else {
              this.cols5.push(col);
            }
          }
        });

        list.forEach(row => {
          let dataRow = {};
          row.forEach(item => {
            //Nếu là number
            if (item.valueType == 1) {
              dataRow[item.columnKey] = this.commonService.convertStringToNumber(item.columnValue);
            }
            else {
              dataRow[item.columnKey] = item.columnValue;
            }
          });

          this.listDataTroCapOt = [...this.listDataTroCapOt, dataRow];
        });
      }
    }
    //Trợ cấp cố định
    else if (type == 2) {
      this.cols3 = [];
      this.listDataTroCapCoDinh = [];
      this.frozenCols3 = [];
      if (list.length) {
        list[0].forEach(item => {
          if (item.isShow) {
            let col = {
              field: item.columnKey,
              header: item.columnKey,
              width: item.width,
              textAlign: item.textAlign
            };
            if (item.columnKey == 'stt' || item.columnKey == 'employeeCode' || item.columnKey == 'subCode1' || item.columnKey == 'employeeName' || item.columnKey == 'positionName') {
              this.frozenCols3.push(col);
            } else {
              this.cols3.push(col);
            }

          }
        });
        list.forEach(row => {
          let dataRow = {};
          row.forEach(item => {
            //Nếu là number
            if (item.valueType == 1) {
              dataRow[item.columnKey] = this.commonService.convertStringToNumber(item.columnValue);
            }
            else {
              dataRow[item.columnKey] = item.columnValue;
            }
          });

          this.listDataTroCapCoDinh = [...this.listDataTroCapCoDinh, dataRow];
        });
      }
    }
    else if (type == 3) {
      this.cols4 = [];
      this.listDataTroCapKhac = [];

      if (list.length) {
        list[0].forEach(item => {
          if (item.isShow) {
            let col = {
              field: item.columnKey,
              header: item.columnKey,
              width: item.width,
              textAlign: item.textAlign
            };
            if (item.columnKey == 'stt' || item.columnKey == 'employeeCode' || item.columnKey == 'subCode1' || item.columnKey == 'employeeName' || item.columnKey == 'positionName') {
              this.frozenCols4.push(col);
            } else {
              this.cols4.push(col);
            }
          }
        });

        list.forEach(row => {
          let dataRow = {};
          row.forEach(item => {
            //Nếu là number
            if (item.valueType == 1) {
              dataRow[item.columnKey] = this.commonService.convertStringToNumber(item.columnValue);
            }
            //Nếu là boolean
            else if (item.valueType == 2) {
              dataRow[item.columnKey] = item.columnValue == 'true' ? true : false;
            }
            else {
              dataRow[item.columnKey] = item.columnValue;
            }
          });

          this.listDataTroCapKhac = [...this.listDataTroCapKhac, dataRow];
        });
      }
    }
  }

  async showDieuKienTroCapCoDinh(data, key) {
    //Nếu click vào các ô giá trị của mức trợ cấp
    if (key.includes('index_')) {
      let luongCtLoaiTroCapCoDinhId = data['loaiTroCapCoDinhId_' + key];

      this.loading = true;
      this.awaitResult = true;
      let result: any = await this.salaryService.getListDieuKienTroCapCoDinh(luongCtLoaiTroCapCoDinhId);
      this.loading = false;
      this.awaitResult = false;

      if (result.statusCode != 200) {
        this.showMessage("error", result.messageCode);
        return;
      }

      if (!result.listLuongCtDieuKienTroCapCoDinh.length) {
        this.showMessage("warn", "Loại trợ cấp này không có điều kiện hưởng hoặc nhân viên không đủ điều kiện hưởng trợ cấp");
        return;
      }

      let ref = this.dialogService.open(UpdateDieuKienTroCapCoDinhComponent, {
        header: 'Điều kiện nhận trợ cấp',
        width: '40%',
        baseZIndex: 1030,
        closable: false,
        contentStyle: {
          "min-height": "auto",
          "max-height": "600px",
        },
        data: {
          trangThai: this.kyLuong.trangThai,
          employeeName: data.employeeName,
          loaiTroCap: result.loaiTroCap,
          listLuongCtDieuKienTroCapCoDinh: result.listLuongCtDieuKienTroCapCoDinh
        }
      });

      ref.onClose.subscribe((_result: any) => {
        this.getData();
        this.refreshNote++;
      });
    }
  }

  async themTroCapKhac() {
    let listLoaiTroCapKhacId = this.listSelectedLoaiTroCapKhac.map(x => x.categoryId);

    this.loading = true;
    this.awaitResult = true;
    let result: any = await this.salaryService.saveLuongCtTroCapKhac(this.kyLuongId, listLoaiTroCapKhacId);

    if (result.statusCode != 200) {
      this.loading = false;
      this.awaitResult = false;
      this.showMessage("error", result.messageCode);
      return;
    }

    await this.getData();
    this.showMessage("success", result.messageCode);
  }

  async showDieuKienTroCapKhac(data, key) {
    //Nếu click vào các ô giá trị của mức trợ cấp
    if (key.includes('index_')) {
      let luongCtLoaiTroCapKhacId = data['loaiTroCapKhacId_' + key];

      this.loading = true;
      this.awaitResult = true;
      let result: any = await this.salaryService.getListDieuKienTroCapKhac(luongCtLoaiTroCapKhacId);
      this.loading = false;
      this.awaitResult = false;

      if (result.statusCode != 200) {
        this.showMessage("error", result.messageCode);
        return;
      }

      let isCoCauHinhLoaiTroCap = result.isCoCauHinhLoaiTroCap;

      let ref = this.dialogService.open(UpdateDieuKienTroCapKhacComponent, {
        header: 'Điều kiện nhận trợ cấp',
        width: '40%',
        baseZIndex: 1030,
        closable: false,
        contentStyle: {
          "min-height": "auto",
          "max-height": "600px",
        },
        data: {
          luongCtLoaiTroCapKhacId: luongCtLoaiTroCapKhacId,
          trangThai: this.kyLuong.trangThai,
          employeeId: data.employee_id,
          employeeName: data.employeeName,
          loaiTroCap: result.loaiTroCap,
          mucTroCap: result.mucTroCap,
          listLuongCtDieuKienTroCapKhac: result.listLuongCtDieuKienTroCapKhac,
          isCoCauHinhLoaiTroCap: isCoCauHinhLoaiTroCap
        }
      });

      ref.onClose.subscribe((_result: any) => {
        this.getData();
        this.refreshNote++;
      });
    }
  }

  importBangLuongChiTiet() {
    this.displayDialogImport = true;
    this.typeImport = 2;
  }

  importTroCapKhac() {
    this.displayDialogImport = true;
    this.typeImport = 1;
  }

  chooseFileTroCapKhac(event: any) {
    this.fileName = event.target.files[0].name;
    this.fileExcelImport = event.target;
  }

  cancelFileTroCapKhac() {
    this.attachment.nativeElement.value = '';
    this.fileName = null;
  }

  importExcel() {
    if (!this.fileName) {
      this.showMessage("error", 'Bạn chưa chọn file');
      return;
    }

    const targetFiles: DataTransfer = <DataTransfer>(this.fileExcelImport);
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(targetFiles.files[0]);

    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      let code = workbook.SheetNames[0];

      // Lấy data từ file excel
      const worksheetProduct: XLSX.WorkSheet = workbook.Sheets[code];

      //Trợ cấp khác
      if (this.typeImport == 1) {
        let dataPoint: Array<any> = XLSX.utils.sheet_to_json(worksheetProduct, { header: 1 });
        dataPoint.shift();

        let listDataHeader = dataPoint[0];
        listDataHeader.shift();

        dataPoint.shift();

        let listData = [];
        dataPoint.forEach((row, index) => {
          if (row.length != 0) {
            let data = {
              employeeCode: row[0],
              listDataLoaiTroCap: []
            };

            listDataHeader.forEach((tenLoaiTroCap, _index) => {
              let troCap = {
                tenLoaiTroCap: tenLoaiTroCap,
                mucTroCap: row[_index + 1]
              };

              data.listDataLoaiTroCap.push(troCap)
            });

            listData.push(data);
          }
        });

        if (!listData.length) {
          this.showMessage("error", 'File import không có dữ liệu');
          this.displayDialogImport = false;
          return;
        }

        this.loading = true;
        this.awaitResult = true;
        let result: any = await this.salaryService.importTroCapKhac(listData, this.kyLuongId);

        if (result.statusCode != 200) {
          this.loading = false;
          this.awaitResult = false;
          this.showMessage("error", result.messageCode);
          return;
        }

        //Nếu có lỗi
        if (result.isError) {
          this.loading = false;
          this.awaitResult = false;

          this.messEmpHeThong = result.messEmpHeThong;
          this.messEmpBangLuong = result.messEmpBangLuong;
          this.messLoaiTroCap = result.messLoaiTroCap;

          this.displayErrorDialog = true;
        }
        //Nếu ko có lỗi
        else {
          await this.getData();
          this.refreshNote++;

          this.showMessage("success", result.messageCode);
          this.displayDialogImport = false;
        }
      }
      //Lương chi tiết
      else {
        let dataPoint: Array<any> = XLSX.utils.sheet_to_json(worksheetProduct, { header: 1 });
        dataPoint.shift();
        dataPoint.shift();

        let listData = [];
        dataPoint.forEach((row, index) => {
          if (row.length != 0) {
            let data = {
              kyLuongId: this.kyLuongId,
              employeeCode: row[0],
              thuNhapTinhThueNetToGross: row[1],
              thuNhapTinhThueMonth13: row[2],
              thuNhapTinhThueGift: row[3],
              thuNhapTinhThueOther: row[4],
              baoHiemOther: row[5],
              giamTruTruocThueGiamTruKhac: row[6],
              giamTruSauThueQuyetToanThueTncn: row[7],
              giamTruSauThueOther: row[8],
              hoanLaiSauThueThueTncn: row[9],
              hoanLaiSauThueOther: row[10],
              ctyDongOther: row[11],
              ctyDongFundOct: row[12],
              otherKhoanBuTruThangTruoc: row[13],
              otherTroCapKhacKhongTinhThue: row[14],
              otherKhauTruHoanLaiTruocThue: row[15],
              otherLuongTamUng: row[16],
            };

            listData.push(data);
          }
        });

        if (!listData.length) {
          this.showMessage("error", 'File import không có dữ liệu');
          this.displayDialogImport = false;
          return;
        }

        this.loading = true;
        this.awaitResult = true;
        let result: any = await this.salaryService.importLuongChiTiet(listData);

        if (result.statusCode != 200) {
          this.loading = false;
          this.awaitResult = false;
          this.showMessage("error", result.messageCode);
          return;
        }

        //Nếu có lỗi
        if (result.isError) {
          this.loading = false;
          this.awaitResult = false;

          this.messEmpHeThong = result.messEmpHeThong;
          this.messEmpBangLuong = result.messEmpBangLuong;

          this.displayErrorDialog = true;
        }
        //Nếu ko có lỗi
        else {
          await this.getData();
          this.refreshNote++;

          this.showMessage("success", result.messageCode);
          this.displayDialogImport = false;
        }
      }
    }
  }

  closeErrorDialog() {
    this.displayErrorDialog = false;
    this.messEmpHeThong = null;
    this.messEmpBangLuong = null;
    this.messLoaiTroCap = null;
  }

  async complete() {
    this.confirmationService.confirm({
      message: `Bạn chắc chắc xác nhận hoàn thành kỳ lương và gửi payslip cho nhân viên?`,
      accept: async () => {
        this.loading = true;
        this.awaitResult = true;
        let result: any = await this.salaryService.hoanThanhKyLuong(this.kyLuongId);

        if (result.statusCode != 200) {
          this.loading = false;
          this.awaitResult = false;
          this.showMessage("error", result.messageCode);
          return;
        }

        await this.getData();
        this.refreshNote++;
        this.showMessage("success", result.messageCode);
      },
    });
  }

  async xuatBaoCao(workbook) {
    if (this.baoCaoNumber)
      this.loading = true;
    this.awaitResult = true;
    let result: any = await this.salaryService.exportBaoCaoKyLuong(this.kyLuongId);
    this.loading = false;
    this.awaitResult = false;

    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    let title = 'In Comparison with forecast';
    let worksheet = workbook.addWorksheet(title);

    /* header table */
    let headerBaoCao1 = result.listHeaderBaoBao;

    let headerRow1 = worksheet.addRow(headerBaoCao1);

    headerRow1.height = 70;
    headerRow1.font = { name: 'Times New Roman', size: 11, bold: true };

    headerBaoCao1.forEach((item, index) => {
      headerRow1.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow1.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (index == 4 || index == 5) {
        headerRow1.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000' }
        };
      }
      else {
        headerRow1.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FABF8F' }
        };
      }
    });

    /* data table */
    let dataBaoCao1 = result.listDataBaoCao;

    let data = dataBaoCao1.map((item, index) => {
      let row = [];

      if (index == 4) {
        row.push('');
        row.push('');
        row.push(item.cdActual1);
        row.push(item.forecast);
        row.push(item.cdActual2);
        row.push(item.vsActual);
        row.push(item.vsForecast);
        row.push('');
      } else {
        row.push(index + 1);
        row.push(item.payment);
        row.push(item.cdActual1);
        row.push(item.forecast);
        row.push(item.cdActual2);
        row.push(item.vsActual);
        row.push(item.vsForecast);
        row.push('');
      }

      return row;
    });

    data.forEach((el, index) => {
      let row = worksheet.addRow(el);
      row.font = { name: 'Times New Roman' };
      if (index == 4) {
        row.font = { bold: true };
        row.height = 30;
      }

      for (let i = 0; i < el.length; i++) {
        row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

        if (i == 0) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
        else if (i == 1 || i == 7) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        }
        else {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '#,##0';
        }

        if (i == 5) {
          row.getCell(i + 1).value = { formula: `=E${row.number}-C${row.number}`, date1904: false };
        }
        else if (i == 6) {
          row.getCell(i + 1).value = { formula: `=D${row.number}-E${row.number}`, date1904: false };
        }
      }
    });
    worksheet.mergeCells('A6:B6');

    /* set width */
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 35;
    worksheet.getColumn(8).width = 100;

    for (let i = 1; i <= headerBaoCao1.length; i++) {
      if (i > 2 && i < 8) {
        worksheet.getColumn(i).width = 15;
      }
    }

    /*---------------Begin: Sheet 2---------------*/

    let titleSheet2 = 'Cost Center_Loft';
    let worksheet2 = workbook.addWorksheet(titleSheet2);

    /* title table 2 */
    let titleTable2Row = worksheet2.addRow(['SUMMARY BY CODE CENTER - LOFT']);
    titleTable2Row.font = { name: 'Times New Roman', family: 4, size: 30, bold: true };
    titleTable2Row.height = 40;
    worksheet2.mergeCells(`A${titleTable2Row.number}:K${titleTable2Row.number}`)
    titleTable2Row.alignment = { vertical: 'middle', horizontal: 'left' };

    titleTable2Row = worksheet2.addRow([`PAYROL OF ${result.thangNamBatDauKyLuongTiengAnh}`.toUpperCase()]);
    titleTable2Row.font = { name: 'Times New Roman', family: 4, size: 15, bold: true };
    titleTable2Row.height = 20;
    worksheet2.mergeCells(`A${titleTable2Row.number}:K${titleTable2Row.number}`)
    titleTable2Row.alignment = { vertical: 'middle', horizontal: 'left' };

    /* header table 2 */
    let headerTable2 = [
      'Dept',
      'No of staff',
      'Basic Gross salary',
      'Bonus/ Allowances/ Others_AV',
      'Trade Union',
      'PIT',
      'PIT (Tax)',
      'Obligation insurance',
      'Net payable',
      'Total company gross payable before off-set',
      'Total company gross payable after off-set'
    ];

    let headerTable2Row = worksheet2.addRow(headerTable2);
    headerTable2Row.height = 80;
    headerTable2Row.font = { name: 'Times New Roman', size: 15, bold: true };

    headerTable2.forEach((item, index) => {
      headerTable2Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerTable2Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (index == 9) {
        headerTable2Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }
        };
      }
      else if (index >= 4 && index <= 8) {
        headerTable2Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
        headerTable2Row.getCell(index + 1).font = {
          name: 'Times New Roman', size: 15, bold: true, color: { argb: 'C00000' }
        }
      }
      else {
        headerTable2Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
      }
    });

    /* data table 2 */
    let dataTable2 = result.listDataBaoCao2Bang1.map((item, index) => {
      let row = [];

      row.push(item.dept);
      row.push(item.noOfStaff);
      row.push(item.basicGrossSalary);
      row.push(item.bonus);
      row.push(item.tradeUnion);
      row.push(item.pit);
      row.push(item.pitTax);
      row.push(item.obligation);
      row.push(item.netPayable);
      row.push(item.totalCompBefore);
      row.push(item.totalCompAfter);

      return row;
    });

    dataTable2.forEach((el, index) => {
      let row = worksheet2.addRow(el);
      row.height = 40;
      row.font = { name: 'Times New Roman', size: 13, bold: true };

      for (let i = 0; i < el.length; i++) {
        row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

        if (i == 0) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
        else if (i >= 4 && i <= 8) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).font = { name: 'Times New Roman', size: 13, bold: true, color: { argb: 'C00000' } };
          row.getCell(i + 1).numFmt = '#,##0';
        }
        else {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '#,##0';
        }
      }
    });

    let dataTable2Sum = ['TOTAL VND', '', '', '', '', '', '', '', '', '', ''];
    let dataTable2SumRow = worksheet2.addRow(dataTable2Sum);
    dataTable2SumRow.height = 40;
    dataTable2SumRow.font = { name: 'Times New Roman', size: 13, bold: true, underline: true };
    for (let i = 0; i < dataTable2Sum.length; i++) {
      dataTable2SumRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (i == 0) {
        dataTable2SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      }
      else if (i >= 4 && i <= 8) {
        dataTable2SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable2SumRow.getCell(i + 1).font = { name: 'Times New Roman', size: 13, bold: true, underline: true, color: { argb: 'C00000' } };
        dataTable2SumRow.getCell(i + 1).numFmt = '#,##0';
      }
      else {
        dataTable2SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable2SumRow.getCell(i + 1).numFmt = '#,##0';
      }

      if (i > 0 && i < 10) {
        dataTable2SumRow.getCell(i + 1).value = { formula: `=SUM(${this.getHeaderColumn(dataTable2SumRow.getCell(i + 1).$col$row)}${dataTable2SumRow.number - dataTable2.length}:${this.getHeaderColumn(dataTable2SumRow.getCell(i + 1).$col$row)}${dataTable2SumRow.number - 1})`, date1904: false };
      }
    }

    let dataTable2Check = ['CHECK', '', '', '', '', '', '', '', '', '', ''];
    let dataTable2CheckRow = worksheet2.addRow(dataTable2Check);
    dataTable2CheckRow.height = 40;
    dataTable2CheckRow.font = { name: 'Times New Roman', size: 13, bold: true };
    for (let i = 0; i < dataTable2Sum.length; i++) {
      dataTable2CheckRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (i == 0) {
        dataTable2CheckRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        dataTable2CheckRow.getCell(i + 1).font = { name: 'Times New Roman', size: 13, bold: true, underline: true };
      }
      else {
        dataTable2CheckRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable2CheckRow.getCell(i + 1).numFmt = '#,##0';
      }
    }

    for (var i = 0; i < 5; i++) {          // cach khoang 5 dong
      let space = worksheet2.addRow(['']);
      space.height = 30;
    }

    /* title table 3 */
    let titleTable3Row = worksheet2.addRow(['SUMMARY BY GRADE - 3D & QA']);
    titleTable3Row.font = { name: 'Times New Roman', family: 4, size: 30, bold: true };
    titleTable3Row.height = 40;
    worksheet2.mergeCells(`A${titleTable3Row.number}:K${titleTable3Row.number}`)
    titleTable3Row.alignment = { vertical: 'middle', horizontal: 'left' };

    /* header table 3 */
    let headerTable3 = [
      'Dept',
      'No of staff',
      'Gross salary',
      'Bonus/ Allowances/ Others_AV',
      'Trade Union ER',
      'PIT',
      'PIT (Tax)',
      'Obligation insurance',
      'Net payroll',
      'Total company gross payable_DF',
    ];
    let headerTable3Row = worksheet2.addRow(headerTable3);

    headerTable3Row.height = 70;
    headerTable3Row.font = { name: 'Times New Roman', size: 15, bold: true };

    headerTable3.forEach((item, index) => {
      headerTable3Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerTable3Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (index == 10) {
        headerTable3Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }
        };
      } else {
        headerTable3Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
      }
    });

    /* data table 3*/
    let dataTable3 = result.listDataBaoCao2Bang2.map((item, index) => {
      let row = [];

      row.push(item.dept);
      row.push(item.noOfStaff);
      row.push(item.grossSalary);
      row.push(item.bonus);
      row.push(item.tradeUnion);
      row.push(item.pit);
      row.push(item.pitTax);
      row.push(item.obligation);
      row.push(item.netPayroll);
      row.push(item.totalComp);

      return row;
    });

    dataTable3.forEach((el, index) => {
      let row = worksheet2.addRow(el);
      row.height = 30;
      row.font = { name: 'Times New Roman', size: 13, bold: true };

      for (let i = 0; i < el.length; i++) {
        row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

        if (i == 0) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        } else {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '#,##0';
        }
      }
    });

    let dataTable3Sum = ['TOTAL VND', '', '', '', '', '', '', '', '', ''];
    let dataTable3SumRow = worksheet2.addRow(dataTable3Sum);
    dataTable3SumRow.height = 40;
    dataTable3SumRow.font = { name: 'Times New Roman', size: 13, bold: true, color: { argb: 'C00000' } };
    for (let i = 0; i < dataTable3Sum.length; i++) {
      dataTable3SumRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (i == 0) {
        dataTable3SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      }
      else {
        dataTable3SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable3SumRow.getCell(i + 1).numFmt = '#,##0';
      }

      //Tính theo công thức
      if (i > 0) {
        dataTable3SumRow.getCell(i + 1).value = { formula: `=SUM(${this.getHeaderColumn(dataTable3SumRow.getCell(i + 1).$col$row)}${dataTable3SumRow.number - dataTable3.length}:${this.getHeaderColumn(dataTable3SumRow.getCell(i + 1).$col$row)}${dataTable3SumRow.number - 1})`, date1904: false };
      }
    }

    let dataTable3Check = ['CHECK', '', '', '', '', '', '', '', '', ''];
    let dataTable3CheckRow = worksheet2.addRow(dataTable3Check);
    dataTable3CheckRow.height = 40;
    dataTable3CheckRow.font = { name: 'Times New Roman', size: 13, bold: true };
    for (let i = 0; i < dataTable3Sum.length; i++) {
      dataTable3CheckRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (i == 0) {
        dataTable3CheckRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        dataTable3CheckRow.getCell(i + 1).font = { name: 'Times New Roman', size: 13, bold: true, underline: true };
      }
      else {
        dataTable3CheckRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable3CheckRow.getCell(i + 1).numFmt = '#,##0';
      }
    }

    worksheet2.addRow(['']);
    worksheet2.addRow(['']);
    worksheet2.addRow(['']);
    worksheet2.addRow(['']);
    worksheet2.addRow(['']);
    worksheet2.addRow(['']);

    /* title table 4 */
    let titleTable4Row = worksheet2.addRow(['COMPARISION - BASIC PAYOUT VS TARGET']);
    titleTable4Row.font = { name: 'Times New Roman', family: 4, size: 14, bold: true };
    titleTable4Row.height = 20;
    worksheet2.mergeCells(`A${titleTable4Row.number}:K${titleTable4Row.number}`)
    titleTable4Row.alignment = { vertical: 'middle', horizontal: 'left' };

    /* header table 4 */
    let headerTable4_1 = [
      '(1)',
      '(2)',
      '(3)',
      '(4)',
      '(5)',
      '(6)',
      '(7)',
      '(8)',
      '(9)',
      '(10)',
    ];
    let headerTable4_1Row = worksheet2.addRow(headerTable4_1);

    headerTable4_1Row.height = 33;
    headerTable4_1Row.font = { name: 'Times New Roman', size: 10, bold: true };

    headerTable4_1.forEach((item, index) => {
      headerTable4_1Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      headerTable4_1Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    let headerTable4_2 = [
      'Grade',
      'Number of employees',
      'GROSS BASE SALARY',
      'AVERAGE-GROSS BASE SALARY',
      'TARGET Average BASIC SALARY STRUCTURE',
      '',
      'Actual vs Target',
      '',
      '',
      '',
    ];
    let headerTable4_2Row = worksheet2.addRow(headerTable4_2);

    headerTable4_2Row.height = 70;
    headerTable4_2Row.font = { name: 'Times New Roman', size: 11, bold: true };

    headerTable4_2.forEach((item, index) => {
      if (index < 5 || index == 6) {
        headerTable4_2Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        headerTable4_2Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        headerTable4_2Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
      }
    });

    /* data table 4*/
    let dataTable4 = result.listDataBaoCao2Bang3.map((item, index) => {
      let row = [];

      row.push(item.grade);
      row.push(item.numberOfEmployees);
      row.push(item.grossBase);
      row.push(item.averageGrossBase);
      row.push(item.targetAverage);
      row.push(item.empty1);
      row.push(item.actual);
      row.push(item.empty2);
      row.push(item.empty3);
      row.push(item.empty4);

      return row;
    });

    dataTable4.forEach((el, index) => {
      let row = worksheet2.addRow(el);
      row.height = 30;
      row.font = { name: 'Times New Roman', size: 10 };

      for (let i = 0; i < el.length; i++) {
        if (i < 5 || i == 6) {
          row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        }

        if (i == 0) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        }
        else if (i >= 1 && i <= 4) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '#,##0';
        }
        else if (i == 6) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '0%';
        }
        else if (i == 7) {
          row.getCell(i + 1).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        }
        else if (i == 8 || i == 9) {
          row.getCell(i + 1).numFmt = '_($* #,##0.0_);_($* (#,##0.0);_($* "-"??_);_(@_)';
        }

        //Tính theo công thức
        if (i == 3) {
          row.getCell(i + 1).value = { formula: `=C${row.number}/B${row.number}`, date1904: false };
        }
        else if (i == 6) {
          row.getCell(i + 1).value = { formula: `=D${row.number}/E${row.number}`, date1904: false };
        }
        else if (index == 1 && i == 7) {
          row.getCell(i + 1).value = { formula: `=AVERAGE(D31:D32)`, date1904: false };
        }
        else if (index == 1 && i == 8) {
          row.getCell(i + 1).value = { formula: `=H31/23000`, date1904: false };
        }
        else if (index == 1 && i == 9) {
          row.getCell(i + 1).value = { formula: `=I31*12`, date1904: false };
        }
        else if (index == 2 && i == 7) {
          row.getCell(i + 1).value = { formula: `=H31*40`, date1904: false };
        }
        else if (index == 2 && i == 8) {
          row.getCell(i + 1).value = { formula: `=I31*40`, date1904: false };
        }
      }
    });

    let dataTable4Sum = ['Total', '', '', '', '', '', '', '', '', ''];
    let dataTable4SumRow = worksheet2.addRow(dataTable4Sum);
    dataTable4SumRow.height = 30;
    dataTable4SumRow.font = { name: 'Times New Roman', size: 10, bold: true, color: { argb: 'C00000' } };
    for (let i = 0; i < dataTable4Sum.length; i++) {
      if (i < 5 || i == 6) {
        dataTable4SumRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      }

      if (i == 0) {
        dataTable4SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }
      else if (i >= 1 && i <= 4) {
        dataTable4SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable4SumRow.getCell(i + 1).numFmt = '#,##0';
      }
      else if (i == 6) {
        dataTable4SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable4SumRow.getCell(i + 1).numFmt = '0%';
      }

      //Tính theo công thức
      if (i == 1 || i == 2) {
        dataTable4SumRow.getCell(i + 1).value = { formula: `=SUM(${this.getHeaderColumn(dataTable4SumRow.getCell(i + 1).$col$row)}${dataTable4SumRow.number - dataTable4.length}:${this.getHeaderColumn(dataTable4SumRow.getCell(i + 1).$col$row)}${dataTable4SumRow.number - 1})`, date1904: false };
      }
      else if (i == 3) {
        dataTable4SumRow.getCell(i + 1).value = { formula: `=C${dataTable4SumRow.number}/B${dataTable4SumRow.number}`, date1904: false };
      }
      else if (i == 4) {
        dataTable4SumRow.getCell(i + 1).value = { formula: `=AVERAGE(${this.getHeaderColumn(dataTable4SumRow.getCell(i + 1).$col$row)}${dataTable4SumRow.number - 2}:${this.getHeaderColumn(dataTable4SumRow.getCell(i + 1).$col$row)}${dataTable4SumRow.number - 1})`, date1904: false };
      }
      else if (i == 6) {
        dataTable4SumRow.getCell(i + 1).value = { formula: `=D${dataTable4SumRow.number}/E${dataTable4SumRow.number}`, date1904: false };
      }
    }

    worksheet2.addRow(['']);
    worksheet2.addRow(['']);

    /* title table 5 */
    let titleTable5Row = worksheet2.addRow(['COMPARISION - TOTAL GROSS BASE + BENEFITS PAYOUT VS TARGET']);
    titleTable5Row.font = { name: 'Times New Roman', family: 4, size: 14, bold: true };
    titleTable5Row.height = 20;
    worksheet2.mergeCells(`A${titleTable5Row.number}:K${titleTable5Row.number}`)
    titleTable5Row.alignment = { vertical: 'middle', horizontal: 'left' };

    /* header table 5 */
    let headerTable5_1 = [
      '(1)',
      '(2)',
      '(3)',
      '(4)',
      '(5)',
      '(6)',
      '(7)',
      '(8)',
      '(9)',
      '(10)',
    ];
    let headerTable5_1Row = worksheet2.addRow(headerTable5_1);

    headerTable5_1Row.height = 33;
    headerTable5_1Row.font = { name: 'Times New Roman', size: 10, bold: true };

    headerTable5_1.forEach((item, index) => {
      headerTable5_1Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      headerTable5_1Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    let headerTable5_2 = [
      'Grade',
      'Number of employees',
      'GROSS BASE + OTHER ALLOWANCE',
      'AVERAGE-GROSS BASE + OTHER ALLOWANCE',
      'TARGET_Average GROSS + OTHER ALLOWANCE',
      '',
      'Actual vs Target',
      '',
      '',
      '',
    ];
    let headerTable5_2Row = worksheet2.addRow(headerTable5_2);

    headerTable5_2Row.height = 70;
    headerTable5_2Row.font = { name: 'Times New Roman', size: 11, bold: true };

    headerTable5_2.forEach((item, index) => {
      if (index < 5 || index == 6) {
        headerTable5_2Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        headerTable5_2Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        headerTable5_2Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
      }
    });

    /* data table 5 */
    let dataTable5 = result.listDataBaoCao2Bang4.map((item, index) => {
      let row = [];

      row.push(item.grade);
      row.push(item.numberOfEmployees);
      row.push(item.grossBase);
      row.push(item.averageGrossBase);
      row.push(item.targetAverage);
      row.push(item.empty1);
      row.push(item.actual);
      row.push(item.empty2);
      row.push(item.empty3);
      row.push(item.empty4);

      return row;
    });

    dataTable5.forEach((el, index) => {
      let row = worksheet2.addRow(el);
      row.height = 30;
      row.font = { name: 'Times New Roman', size: 10 };

      for (let i = 0; i < el.length; i++) {
        if (i < 5 || i == 6) {
          row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        }

        if (i == 0) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        }
        else if (i >= 1 && i <= 4) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        }
        else if (i == 6) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '0%';
        }

        //Tính theo công thức
        if (i == 2) {
          row.getCell(i + 1).value = { formula: `=C${row.number - 23}+D${row.number - 23}`, date1904: false };
        }
        else if (i == 3) {
          row.getCell(i + 1).value = { formula: `=C${row.number}/B${row.number}`, date1904: false };
        }
        else if (i == 6) {
          row.getCell(i + 1).value = { formula: `=D${row.number}/E${row.number}`, date1904: false };
        }
      }
    });

    let dataTable5Sum = ['Total', '', '', '', '', '', '', '', '', ''];
    let dataTable5SumRow = worksheet2.addRow(dataTable5Sum);
    dataTable5SumRow.height = 30;
    dataTable5SumRow.font = { name: 'Times New Roman', size: 10, bold: true, color: { argb: 'C00000' } };
    for (let i = 0; i < dataTable5Sum.length; i++) {
      if (i < 5 || i == 6) {
        dataTable5SumRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      }

      if (i == 0) {
        dataTable5SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }
      else if (i >= 1 && i <= 4) {
        dataTable5SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable5SumRow.getCell(i + 1).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      }
      else if (i == 6) {
        dataTable5SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable5SumRow.getCell(i + 1).numFmt = '0%';
      }

      //Tính theo công thức
      if (i == 1 || i == 2) {
        dataTable5SumRow.getCell(i + 1).value = { formula: `=SUM(${this.getHeaderColumn(dataTable5SumRow.getCell(i + 1).$col$row)}${dataTable5SumRow.number - dataTable5.length}:${this.getHeaderColumn(dataTable5SumRow.getCell(i + 1).$col$row)}${dataTable5SumRow.number - 1})`, date1904: false };
      }
      else if (i == 3) {
        dataTable5SumRow.getCell(i + 1).value = { formula: `=C${dataTable5SumRow.number}/B${dataTable5SumRow.number}`, date1904: false };
      }
      else if (i == 4) {
        dataTable5SumRow.getCell(i + 1).value = { formula: `=AVERAGE(${this.getHeaderColumn(dataTable5SumRow.getCell(i + 1).$col$row)}${dataTable5SumRow.number - 2}:${this.getHeaderColumn(dataTable5SumRow.getCell(i + 1).$col$row)}${dataTable5SumRow.number - 1})`, date1904: false };
      }
      else if (i == 6) {
        dataTable5SumRow.getCell(i + 1).value = { formula: `=D${dataTable5SumRow.number}/E${dataTable5SumRow.number}`, date1904: false };
      }
    }

    worksheet2.addRow(['']);
    worksheet2.addRow(['']);

    /* title table 6 */
    let titleTable6Row = worksheet2.addRow(['COMPARISION - TOTAL LUMPSUM GROSS (Net + PIT, Government fee) VS TARGET']);
    titleTable6Row.font = { name: 'Times New Roman', family: 4, size: 14, bold: true };
    titleTable6Row.height = 20;
    worksheet2.mergeCells(`A${titleTable6Row.number}:K${titleTable6Row.number}`)
    titleTable6Row.alignment = { vertical: 'middle', horizontal: 'left' };

    /* header table 6 */
    let headerTable6_1 = [
      '(1)',
      '(2)',
      '(3)',
      '(4)',
      '(5)',
      '(6)',
      '(7)',
      '(8)',
      '(9)',
      '(10)',
    ];
    let headerTable6_1Row = worksheet2.addRow(headerTable6_1);

    headerTable6_1Row.height = 33;
    headerTable6_1Row.font = { name: 'Times New Roman', size: 10, bold: true };

    headerTable6_1.forEach((item, index) => {
      headerTable6_1Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      headerTable6_1Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    let headerTable6_2 = [
      'Grade',
      'Number of employees',
      'TOTAL LUMPSUM GROSS PAYOUT',
      'AVERAGE TOTAL LUMPSUM GROSS PAYOUT',
      'TARGET_Average GROSS + OTHER ALLOWANCE',
      '',
      'Actual vs Target',
      '',
      '',
      '',
    ];
    let headerTable6_2Row = worksheet2.addRow(headerTable6_2);

    headerTable6_2Row.height = 70;
    headerTable6_2Row.font = { name: 'Times New Roman', size: 11, bold: true };

    headerTable6_2.forEach((item, index) => {
      if (index < 5 || index == 6) {
        headerTable6_2Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        headerTable6_2Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        headerTable6_2Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
      }
    });

    /* data table 6 */
    let dataTable6 = result.listDataBaoCao2Bang5.map((item, index) => {
      let row = [];

      row.push(item.grade);
      row.push(item.numberOfEmployees);
      row.push(item.grossBase);
      row.push(item.averageGrossBase);
      row.push(item.targetAverage);
      row.push(item.empty1);
      row.push(item.actual);
      row.push(item.empty2);
      row.push(item.empty3);
      row.push(item.empty4);

      return row;
    });

    dataTable6.forEach((el, index) => {
      let row = worksheet2.addRow(el);
      row.height = 30;
      row.font = { name: 'Times New Roman', size: 10 };

      for (let i = 0; i < el.length; i++) {
        if (i < 5 || i == 6) {
          row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        }

        if (i == 0) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        }
        else if (i >= 1 && i <= 4) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        }
        else if (i == 6) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '0%';
        }

        //Tính theo công thức
        if (i == 2) {
          row.getCell(i + 1).value = { formula: `=J${row.number - 32}`, date1904: false };
        }
        else if (i == 3) {
          row.getCell(i + 1).value = { formula: `=C${row.number}/B${row.number}`, date1904: false };
        }
        else if (i == 6) {
          row.getCell(i + 1).value = { formula: `=D${row.number}/E${row.number}`, date1904: false };
        }
      }
    });

    let dataTable6Sum = ['Total', '', '', '', '', '', '', '', '', ''];
    let dataTable6SumRow = worksheet2.addRow(dataTable6Sum);
    dataTable6SumRow.height = 30;
    dataTable6SumRow.font = { name: 'Times New Roman', size: 10, bold: true, color: { argb: 'C00000' } };
    for (let i = 0; i < dataTable6Sum.length; i++) {
      if (i < 5 || i == 6) {
        dataTable6SumRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      }

      if (i == 0) {
        dataTable6SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }
      else if (i >= 1 && i <= 4) {
        dataTable6SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable6SumRow.getCell(i + 1).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      }
      else if (i == 6) {
        dataTable6SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable6SumRow.getCell(i + 1).numFmt = '0%';
      }

      //Tính theo công thức
      if (i == 1 || i == 2) {
        dataTable6SumRow.getCell(i + 1).value = { formula: `=SUM(${this.getHeaderColumn(dataTable6SumRow.getCell(i + 1).$col$row)}${dataTable6SumRow.number - dataTable5.length}:${this.getHeaderColumn(dataTable6SumRow.getCell(i + 1).$col$row)}${dataTable6SumRow.number - 1})`, date1904: false };
      }
      else if (i == 3) {
        dataTable6SumRow.getCell(i + 1).value = { formula: `=C${dataTable6SumRow.number}/B${dataTable6SumRow.number}`, date1904: false };
      }
      else if (i == 4) {
        dataTable6SumRow.getCell(i + 1).value = { formula: `=AVERAGE(${this.getHeaderColumn(dataTable6SumRow.getCell(i + 1).$col$row)}${dataTable6SumRow.number - 2}:${this.getHeaderColumn(dataTable6SumRow.getCell(i + 1).$col$row)}${dataTable6SumRow.number - 1})`, date1904: false };
      }
      else if (i == 6) {
        dataTable6SumRow.getCell(i + 1).value = { formula: `=D${dataTable6SumRow.number}/E${dataTable6SumRow.number}`, date1904: false };
      }
    }

    worksheet2.addRow(['']);
    worksheet2.addRow(['']);
    worksheet2.addRow(['']);

    let labelSheet2 = worksheet2.addRow(['PREPARED BY:']);
    labelSheet2.font = { name: 'Times New Roman', family: 4, size: 11, bold: true };
    labelSheet2.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet2.addRow(['']);
    worksheet2.addRow(['']);
    worksheet2.addRow(['']);
    worksheet2.addRow(['']);

    let nameSheet2 = worksheet2.addRow(['NGUYEN THI TRANG']);
    nameSheet2.font = { name: 'Times New Roman', family: 4, size: 11, bold: true };
    nameSheet2.alignment = { vertical: 'middle', horizontal: 'left' };

    /*---------------End: Sheet 2---------------*/

    /*---------------Begin: Sheet 3---------------*/

    let titleSheet3 = 'Cost center_RSM';
    let worksheet3 = workbook.addWorksheet(titleSheet3);

    /* title */
    let titleSheet = worksheet3.addRow(['', `PAYROL OF ${result.thangNamBatDauKyLuongTiengAnh}`.toUpperCase()]);
    titleSheet.font = { name: 'Times New Roman', family: 4, size: 30, bold: true };
    titleSheet.height = 50;
    worksheet3.mergeCells(`B${titleSheet.number}:T${titleSheet.number}`)
    titleSheet.alignment = { vertical: 'middle', horizontal: 'left' };

    /* Đánh số thứ tự */
    let space = worksheet3.addRow([]);
    for (var i = 1; i < 45; i++) {
      space.getCell(i + 1).value = i;
    }
    space.height = 30;
    space.font = { name: 'Times New Roman', size: 15, bold: true };
    space.alignment = { vertical: 'middle', horizontal: 'center' };

    /* title table 7 */
    let titleTable7Row = worksheet3.addRow(['', 'SUMMARY BY CODE CENTER - RSM']);
    titleTable7Row.font = { name: 'Times New Roman', family: 4, size: 30, bold: true };
    titleTable7Row.height = 50;
    worksheet3.mergeCells(`B${titleTable7Row.number}:K${titleTable7Row.number}`);
    titleTable7Row.alignment = { vertical: 'middle', horizontal: 'left' };

    /* header table 7 */
    let headerTable7_1 = [
      "No.",
      "HR Filing Code",
      "Dept Code",
      "No. of staff",
      "Group Health Care",
      "Monthly Bonus/ Incentive Accrual Local Currency",
      "Actual working days",
      "Actual working days in vocational / Probation",
      "AL",
      "Holiday",
      "Other paid leave with full paid",
      "Unpaid Leave, paid by social innurance",
      "Unpaid leave without reason",
      "Unpaid leave",
      "Deduction days for attendance/ Deduction days for non- compliance of regulation",
      "Total payable day for this month, including Holiday (Mon-Fri)",
      "PAYBACK - GROSS BASIC IF ANY",
      "NEW GROSS BASED ON ACTUAL WORKING DAY",
      "GROSS OT",
      "GROSS ALLOWANCE (Cell phone, Housing allowance, lunch, attendance reward)",
      "GROSS BONUS",
      "NET SEVERANCE ALLOWANCE",
      "DEDUCTION FROM EMPLOYEE/ Refund company before Tax (Over paid AL) Các khoản giảm trừ trước thuế nếu có",
      "TOTAL PIT PAYMENT_Borne by employee",
      "PIT born by company &employee after off-set PIT liquidation",
      "UI",
      "UI",
      "SI",
      "SI",
      "HI",
      "HI",
      "Other HI - Additional",
      "Total company and employee_SI, AI, UI and HI _32%",
      "Total company and employee_SI, AI, UI and HI _32%",
      "Total company and employee_SI, AI, UI and HI _32%",
      "T.U_Company ",
      "Other deduction after Tax",
      "Other Additional after Tax for employee",
      "TOTAL NET INCOME PAYABLE",
      "Net pay before New Year",
      "Net_Paid 26th Jul",
      "TOTAL GROSS PAYABLE - BEFORE OFFSET PIT IF ANY",
      "TOTAL GROSS PAYABLE-AFTER OFFSET PIT IF ANY",
      "Bonus accrual from Jan-Dec",
      "Bonus accrual from Jan-Dec",
    ];

    let headerTable7_1Row = worksheet3.addRow(headerTable7_1);
    let headerTable7_2Row = worksheet3.addRow([]);

    headerTable7_1Row.height = 50;
    headerTable7_1Row.font = { name: 'Times New Roman', size: 12, bold: true };
    headerTable7_2Row.height = 140;
    headerTable7_2Row.font = { name: 'Times New Roman', size: 12, bold: true };

    let excelColumn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];

    for (var i = 0; i <= 24; i++) {
      worksheet3.mergeCells(`${excelColumn[i]}4:${excelColumn[i]}5`);
    }

    for (var i = 25; i <= 29; i += 2) {
      worksheet3.mergeCells(`${excelColumn[i]}4:${excelColumn[i + 1]}4`);
    }

    worksheet3.mergeCells(`${excelColumn[32]}4:${excelColumn[34]}4`);

    for (var i = 35; i <= 44; i++) {
      worksheet3.mergeCells(`${excelColumn[i]}4:${excelColumn[i]}5`);
    }

    headerTable7_2Row.getCell(26).value = 'Company';
    headerTable7_2Row.getCell(27).value = 'Employee';
    headerTable7_2Row.getCell(28).value = 'Company';
    headerTable7_2Row.getCell(29).value = 'Employee';
    headerTable7_2Row.getCell(30).value = 'Company';
    headerTable7_2Row.getCell(31).value = 'Employee';
    headerTable7_2Row.getCell(32).value = 'Employee';
    headerTable7_2Row.getCell(33).value = 'Company';
    headerTable7_2Row.getCell(34).value = 'Employee';
    headerTable7_2Row.getCell(35).value = 'TOTAL';

    headerTable7_1.forEach((item, index) => {
      headerTable7_1Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerTable7_1Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (index == 6 || index == 7 || index == 8 || index == 13 || index == 14) {
        headerTable7_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2DCDB' }
        };
      }
      else if (index == 1 || index == 15 || index == 18 || index == 24 || index == 36 || index == 37 || index == 42) {
        headerTable7_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E4DFEC' }
        };
      }
      else if (index == 9 || index == 10) {
        headerTable7_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2F2F2' }
        };
      }
      else if (index == 11) {
        headerTable7_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DAEEF3' }
        };
      }
      else if (index == 12) {
        headerTable7_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FDE9D9' }
        };
      }
      else {
        headerTable7_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
      }

      if (index >= 25 && index <= 34) {
        headerTable7_2Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
        headerTable7_2Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        headerTable7_2Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      }
    });

    let headerTable7_3Row = worksheet3.addRow([null, null, null, null, null, 'Day', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'AG', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'BY', 'BZ', 'CB,CE', 'CC,CF', 'CI', 'CJ', null, 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'DE', 'DF', 'VND', 'VND', 'VND', 'VND']);
    headerTable7_3Row.height = 40;
    headerTable7_3Row.font = { name: 'Times New Roman', size: 15, bold: true };
    headerTable7_3Row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    for (var i = 1; i <= 45; i++) {
      headerTable7_3Row.getCell(i).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }

    /* data table 7 */
    let dataTable7 = result.listDataBaoCao3Bang1.map((item, index) => {
      let row = [];

      row.push(item.col1);
      row.push(item.col2);
      row.push(item.col3);
      row.push(item.col4);
      row.push(item.col5);
      row.push(item.col6);
      row.push(item.col7);
      row.push(item.col8);
      row.push(item.col9);
      row.push(item.col10);
      row.push(item.col11);
      row.push(item.col12);
      row.push(item.col13);
      row.push(item.col14);
      row.push(item.col15);
      row.push(item.col16);
      row.push(item.col17);
      row.push(item.col18);
      row.push(item.col19);
      row.push(item.col20);
      row.push(item.col21);
      row.push(item.col22);
      row.push(item.col23);
      row.push(item.col24);
      row.push(item.col25);
      row.push(item.col26);
      row.push(item.col27);
      row.push(item.col28);
      row.push(item.col29);
      row.push(item.col30);
      row.push(item.col31);
      row.push(item.col32);
      row.push(item.col33);
      row.push(item.col34);
      row.push(item.col35);
      row.push(item.col36);
      row.push(item.col37);
      row.push(item.col38);
      row.push(item.col39);
      row.push(item.col40);
      row.push(item.col41);
      row.push(item.col42);
      row.push(item.col43);
      row.push(item.col44);
      row.push(item.col45);

      return row;
    });

    dataTable7.forEach((el, index) => {
      let row = worksheet3.addRow(el);
      row.height = 30;
      row.font = { name: 'Times New Roman', size: 15 };

      for (let i = 0; i < el.length; i++) {
        row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

        if (i == 0) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
        else if (i == 1 || i == 2 || i == 3) {
          row.getCell(i + 1).font = { name: 'Times New Roman', size: 20, bold: true };
        }

        if (i >= 3) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        }

        //Tính theo công thức
        if (i == 32) {
          row.getCell(i + 1).value = { formula: `=Z${row.number}+AB${row.number}+AD${row.number}`, date1904: false };
        }
        else if (i == 33) {
          row.getCell(i + 1).value = { formula: `=AA${row.number}+AC${row.number}+AE${row.number}+AF${row.number}`, date1904: false };
        }
        else if (i == 34) {
          row.getCell(i + 1).value = { formula: `=AH${row.number}+AG${row.number}`, date1904: false };
        }
      }
    });

    let empty = [];
    for (let i = 0; i <= 44; i++) {
      empty.push('');
    }
    let emptyRow = worksheet3.addRow(empty);
    emptyRow.height = 30;
    emptyRow.font = { name: 'Times New Roman', size: 15 };
    for (let i = 0; i < empty.length; i++) {
      emptyRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }

    let dataTable7Sum = [];
    for (let i = 0; i <= 44; i++) {
      if (i == 1) dataTable7Sum.push('TOTAL');
      else dataTable7Sum.push('');
    }

    let dataTable7SumRow = worksheet3.addRow(dataTable7Sum);
    dataTable7SumRow.height = 35;
    dataTable7SumRow.font = { name: 'Times New Roman', size: 16, bold: true, color: { argb: 'C00000' } };
    for (let i = 0; i < dataTable7Sum.length; i++) {
      dataTable7SumRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      dataTable7SumRow.getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FDE9D9' }
      };

      if (i == 1) {
        dataTable7SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }
      else if (i > 1) {
        dataTable7SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable7SumRow.getCell(i + 1).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
      }

      //Tính theo công thức
      if (i > 2) {
        dataTable7SumRow.getCell(i + 1).value = { formula: `=SUM(${this.getHeaderColumn(dataTable7SumRow.getCell(i + 1).$col$row)}7:${this.getHeaderColumn(dataTable7SumRow.getCell(i + 1).$col$row)}10)`, date1904: false };
      }
    }

    let HcNote = ['', 'HC note:', 'Staffs'];
    let HcNoteRow = worksheet3.addRow(HcNote);
    HcNoteRow.height = 30;
    HcNoteRow.font = { name: 'Times New Roman', size: 18, bold: true };
    HcNoteRow.getCell(3).font = { name: 'Times New Roman', size: 18, bold: true, color: { argb: 'C00000' } };

    worksheet3.addRow([]);

    /* header table 8 */
    let headerTable8 = ['', 'Dept Code', 'No. of HC'];
    for (let i = 0; i < 15; i++) {
      headerTable8.push('');
    }
    headerTable8.push('Description');
    headerTable8.push('Before PIT adjustment');
    headerTable8.push('PIT overpaid/under paid');
    headerTable8.push('After PIT adjustment');
    headerTable8.push('Diff');

    let headerTable8Row = worksheet3.addRow(headerTable8);
    headerTable8Row.height = 53;
    headerTable8Row.font = { name: 'Times New Roman', size: 13, bold: true };
    headerTable8Row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    for (let i = 0; i < headerTable8.length; i++) {
      if (i == 1 || i == 2 || i == 18 || i == 19 || i == 20 || i == 21 || i == 22) {
        headerTable8Row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        headerTable8Row.getCell(i + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        }
      }
    }

    let row15 = worksheet3.addRow([]);
    row15.font = { name: 'Times New Roman', size: 13, bold: true };
    row15.getCell(2).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row15.getCell(3).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row15.getCell(19).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row15.getCell(20).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row15.getCell(21).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row15.getCell(22).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row15.getCell(23).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

    row15.getCell(3).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row15.getCell(20).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row15.getCell(22).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

    row15.getCell(19).value = 'Total gross-income';
    row15.getCell(20).value = { formula: `=SUM(Q11:V11)-W11`, date1904: false };
    row15.getCell(22).value = { formula: `=T15+U15`, date1904: false };

    let row16 = worksheet3.addRow([]);
    row16.font = { name: 'Times New Roman', size: 13, bold: true };
    row16.getCell(2).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row16.getCell(3).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row16.getCell(19).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row16.getCell(20).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row16.getCell(21).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row16.getCell(22).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row16.getCell(23).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

    row16.getCell(3).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row16.getCell(20).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row16.getCell(22).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

    row16.getCell(2).value = 'G&A';
    row16.getCell(3).value = { formula: `=D7`, date1904: false };
    row16.getCell(19).value = 'PIT of the month (EE)';
    row16.getCell(20).value = { formula: `=X11`, date1904: false };
    row16.getCell(22).value = { formula: `=T16+U16`, date1904: false };

    let row17 = worksheet3.addRow([]);
    row17.font = { name: 'Times New Roman', size: 13, bold: true };
    row17.getCell(2).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row17.getCell(3).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row17.getCell(19).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row17.getCell(20).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row17.getCell(21).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row17.getCell(22).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row17.getCell(23).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

    row17.getCell(3).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row17.getCell(20).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row17.getCell(22).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

    row17.getCell(2).value = 'OPS';
    row17.getCell(3).value = { formula: `=D8`, date1904: false };
    row17.getCell(19).value = 'PIT of the month (ER)';
    row17.getCell(20).value = { formula: `=Y11-X11`, date1904: false };
    row17.getCell(22).value = { formula: `=T17+U17`, date1904: false };

    let row18 = worksheet3.addRow([]);
    row18.font = { name: 'Times New Roman', size: 13, bold: true };
    row18.getCell(2).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row18.getCell(3).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row18.getCell(19).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row18.getCell(20).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row18.getCell(21).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row18.getCell(22).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row18.getCell(23).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

    row18.getCell(3).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row18.getCell(20).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row18.getCell(22).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

    row18.getCell(2).value = 'COS';
    row18.getCell(3).value = { formula: `=D9`, date1904: false };
    row18.getCell(19).value = 'SHUI (EE)';
    row18.getCell(20).value = { formula: `=AH11`, date1904: false };
    row18.getCell(22).value = { formula: `=T18+U18`, date1904: false };

    let row19 = worksheet3.addRow([]);
    row19.font = { name: 'Times New Roman', size: 13, bold: true };

    row19.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF1DE' }
    }
    row19.getCell(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF1DE' }
    }
    row19.getCell(19).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF1DE' }
    }
    row19.getCell(20).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF1DE' }
    }
    row19.getCell(21).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF1DE' }
    }
    row19.getCell(22).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF1DE' }
    }
    row19.getCell(23).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF1DE' }
    }

    row19.getCell(2).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row19.getCell(3).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row19.getCell(19).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row19.getCell(20).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row19.getCell(21).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row19.getCell(22).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    row19.getCell(23).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

    row19.getCell(2).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    row19.getCell(3).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row19.getCell(19).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row19.getCell(20).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row19.getCell(22).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

    row19.getCell(2).value = 'Total HC';
    row19.getCell(3).value = { formula: `=C18+C17+C16+C15`, date1904: false };
    row19.getCell(19).value = 'Net receiving';
    row19.getCell(20).value = { formula: `=T15+AL11-T16-T18`, date1904: false };
    row19.getCell(21).value = { formula: `=SUM(U15:U18)`, date1904: false };
    row19.getCell(22).value = { formula: `=T19+U19`, date1904: false };
    row19.getCell(23).value = { formula: `=SUM(W15:W18)`, date1904: false };

    let row20 = worksheet3.addRow([]);
    row20.alignment = { vertical: 'middle', wrapText: true };
    row20.getCell(19).value = 'Diff';
    row20.getCell(19).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    row20.getCell(19).font = { name: 'Times New Roman', size: 13, bold: true, color: { argb: 'C00000' } };
    row20.getCell(20).value = { formula: `=T19-AM11`, date1904: false };
    row20.getCell(20).font = { name: 'Times New Roman', size: 13, bold: true, color: { argb: 'C00000' } };

    row16.getCell(2).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
    row16.getCell(20).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
    row16.getCell(22).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';

    row17.getCell(2).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
    row17.getCell(20).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
    row17.getCell(22).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';

    row18.getCell(2).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
    row18.getCell(20).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
    row18.getCell(22).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';

    row19.getCell(2).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
    row19.getCell(20).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
    row19.getCell(21).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
    row19.getCell(22).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
    row19.getCell(23).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';

    row20.getCell(20).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';

    worksheet3.addRow([]);

    let row21 = worksheet3.addRow(['', 'BỎ TỪ DÒNG 21 TRỞ ĐI TRƯỚC KHI GỬI']);
    row21.font = { name: 'Times New Roman', size: 30, bold: true, color: { argb: 'C00000' } };
    row21.height = 47;

    let row22 = worksheet3.addRow(['', 'SUMMARY BY SUB-COST CENTER']);
    row22.font = { name: 'Times New Roman', size: 30, bold: true };
    row22.height = 47;

    let headerTable9_1 = [
      "No.",
      "HR Filing Code",
      "Dept Code",
      "No. of staff",
      "Group Health Care",
      "Monthly Bonus/ Incentive Accrual Local Currency",
      "Actual working days",
      "Actual working days in vocational / Probation",
      "AL",
      "Holiday",
      "Other paid leave with full paid",
      "Unpaid Leave, paid by social innurance",
      "Unpaid leave without reason",
      "Unpaid leave",
      "Deduction days for attendance/ Deduction days for non- compliance of regulation",
      "Total payable day for this month, including Holiday (Mon-Fri)",
      "PAYBACK - GROSS BASIC IF ANY",
      "NEW GROSS BASED ON ACTUAL WORKING DAY",
      "GROSS OT",
      "GROSS ALLOWANCE (Cell phone, Housing allowance, lunch, attendance reward)",
      "GROSS BONUS",
      "NET SEVERANCE ALLOWANCE",
      "DEDUCTION FROM EMPLOYEE/ Refund company before Tax (Over paid AL) Các khoản giảm trừ trước thuế nếu có",
      "TOTAL PIT PAYMENT_Borne by employee",
      "PIT born by company &employee after off-set PIT liquidation",
      "UI",
      "UI",
      "SI",
      "SI",
      "HI",
      "HI",
      "Other HI - Additional",
      "Total company and employee_SI, AI, UI and HI _32%",
      "Total company and employee_SI, AI, UI and HI _32%",
      "Total company and employee_SI, AI, UI and HI _32%",
      "T.U_Company ",
      "Other deduction after Tax",
      "Other Additional after Tax",
      "TOTAL NET INCOME PAYABLE",
      "Net pay before New Year",
      "Net_Paid 10th Feb",
      "TOTAL GROSS PAYABLE - BEFORE OFFSET PIT LIQUIDATION",
      "TOTAL GROSS PAYABLE-AFTER OFFSET PIT LIQUIDATION",
    ];

    let headerTable9_1Row = worksheet3.addRow(headerTable9_1);
    let headerTable9_2Row = worksheet3.addRow([]);

    headerTable9_1Row.height = 50;
    headerTable9_1Row.font = { name: 'Times New Roman', size: 15, bold: true };
    headerTable9_2Row.height = 140;
    headerTable9_2Row.font = { name: 'Times New Roman', size: 15, bold: true };

    for (var i = 0; i <= 24; i++) {
      worksheet3.mergeCells(`${excelColumn[i]}24:${excelColumn[i]}25`);
    }
    for (var i = 25; i <= 29; i += 2) {
      worksheet3.mergeCells(`${excelColumn[i]}24:${excelColumn[i + 1]}24`);
    }
    worksheet3.mergeCells(`${excelColumn[32]}24:${excelColumn[34]}24`);
    for (var i = 35; i <= 42; i++) {
      worksheet3.mergeCells(`${excelColumn[i]}24:${excelColumn[i]}25`);
    }

    headerTable9_2Row.getCell(26).value = 'Company';
    headerTable9_2Row.getCell(27).value = 'Employee';
    headerTable9_2Row.getCell(28).value = 'Company';
    headerTable9_2Row.getCell(29).value = 'Employee';
    headerTable9_2Row.getCell(30).value = 'Company';
    headerTable9_2Row.getCell(31).value = 'Employee';
    headerTable9_2Row.getCell(32).value = 'Employee';
    headerTable9_2Row.getCell(33).value = 'Company';
    headerTable9_2Row.getCell(34).value = 'Employee';
    headerTable9_2Row.getCell(35).value = 'TOTAL';

    headerTable9_1.forEach((item, index) => {
      headerTable9_1Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerTable9_1Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (index == 6 || index == 7 || index == 8 || index == 13 || index == 14) {
        headerTable9_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2DCDB' }
        };
      }
      else if (index == 1 || (index >= 17 && index <= 20) || (index >= 23 && index <= 30) || (index >= 35 && index <= 38) || index == 41 || index == 42) {
        headerTable9_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E4DFEC' }
        };
      }
      else if (index == 9 || index == 10) {
        headerTable9_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2F2F2' }
        };
      }
      else if (index == 11) {
        headerTable9_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DAEEF3' }
        };
      }
      else if (index == 12) {
        headerTable9_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FDE9D9' }
        };
      }
      else {
        headerTable9_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
      }

      if (index >= 25 && index <= 34) {
        if (index >= 25 && index <= 30) {
          headerTable9_2Row.getCell(index + 1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E4DFEC' }
          };
        }
        else {
          headerTable9_2Row.getCell(index + 1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EBF1DE' }
          };
        }

        headerTable9_2Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        headerTable9_2Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      }
    });

    let headerTable9_3Row = worksheet3.addRow([null, null, null, null, null, 'Day', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', null, 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', null, null, 'VND', 'VND']);
    headerTable9_3Row.height = 40;
    headerTable9_3Row.font = { name: 'Times New Roman', size: 15, bold: true };
    headerTable9_3Row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    for (var i = 1; i <= 43; i++) {
      headerTable9_3Row.getCell(i).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }

    /* data table 9 */
    let dataTable9 = result.listDataBaoCao3Bang2.map((item, index) => {
      let row = [];

      row.push(item.col1);
      row.push(item.col2);
      row.push(item.col3);
      row.push(item.col4);
      row.push(item.col5);
      row.push(item.col6);
      row.push(item.col7);
      row.push(item.col8);
      row.push(item.col9);
      row.push(item.col10);
      row.push(item.col11);
      row.push(item.col12);
      row.push(item.col13);
      row.push(item.col14);
      row.push(item.col15);
      row.push(item.col16);
      row.push(item.col17);
      row.push(item.col18);
      row.push(item.col19);
      row.push(item.col20);
      row.push(item.col21);
      row.push(item.col22);
      row.push(item.col23);
      row.push(item.col24);
      row.push(item.col25);
      row.push(item.col26);
      row.push(item.col27);
      row.push(item.col28);
      row.push(item.col29);
      row.push(item.col30);
      row.push(item.col31);
      row.push(item.col32);
      row.push(item.col33);
      row.push(item.col34);
      row.push(item.col35);
      row.push(item.col36);
      row.push(item.col37);
      row.push(item.col38);
      row.push(item.col39);
      row.push(item.col40);
      row.push(item.col41);
      row.push(item.col42);
      row.push(item.col43);

      return row;
    });

    dataTable9.forEach((el, index) => {
      let row = worksheet3.addRow(el);
      row.height = 30;
      row.font = { name: 'Times New Roman', size: 15 };

      for (let i = 0; i < el.length; i++) {
        row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

        if (i == 0) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
        else if (i == 1 || i == 2 || i == 3) {
          row.getCell(i + 1).font = { name: 'Times New Roman', size: 20, bold: true };
        }

        if (i >= 3) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        }

        //Tính theo công thức
        if (i == 32) {
          row.getCell(i + 1).value = { formula: `=Z${row.number}+AB${row.number}+AD${row.number}`, date1904: false };
        }
        else if (i == 33) {
          row.getCell(i + 1).value = { formula: `=AA${row.number}+AC${row.number}+AE${row.number}+AF${row.number}`, date1904: false };
        }
        else if (i == 34) {
          row.getCell(i + 1).value = { formula: `=AH${row.number}+AG${row.number}`, date1904: false };
        }
      }
    });

    let empty2 = [];
    for (let i = 0; i <= 42; i++) {
      empty2.push('');
    }
    let empty2Row = worksheet3.addRow(empty2);
    empty2Row.height = 30;
    empty2Row.font = { name: 'Times New Roman', size: 15 };
    for (let i = 0; i < empty2.length; i++) {
      empty2Row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }

    let dataTable9Sum = [];
    for (let i = 0; i <= 42; i++) {
      if (i == 1) dataTable9Sum.push('TOTAL');
      else dataTable9Sum.push('');
    }

    let dataTable9SumRow = worksheet3.addRow(dataTable9Sum);
    dataTable9SumRow.height = 35;
    dataTable9SumRow.font = { name: 'Times New Roman', size: 16, bold: true, color: { argb: 'C00000' } };

    for (let i = 0; i < dataTable9Sum.length; i++) {
      dataTable9SumRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      dataTable9SumRow.getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FDE9D9' }
      };

      if (i == 1) {
        dataTable9SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }
      else if (i > 1) {
        dataTable9SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable9SumRow.getCell(i + 1).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
      }

      //Tính theo công thức
      if (i > 2) {
        dataTable9SumRow.getCell(i + 1).value = { formula: `=SUM(${this.getHeaderColumn(dataTable9SumRow.getCell(i + 1).$col$row)}27:${this.getHeaderColumn(dataTable9SumRow.getCell(i + 1).$col$row)}36)`, date1904: false };
      }
    }

    worksheet3.addRow([]);
    let row39 = worksheet3.addRow(['', 'SUMMARY BY GRADE - 3D']);
    row39.font = { name: 'Times New Roman', size: 30, bold: true };
    row39.height = 47;

    /* header table 10 */
    let headerTable10_1 = headerTable9_1;
    let headerTable10_1Row = worksheet3.addRow(headerTable10_1);
    let headerTable10_2Row = worksheet3.addRow([]);

    headerTable10_1Row.height = 50;
    headerTable10_1Row.font = { name: 'Times New Roman', size: 15, bold: true };
    headerTable10_2Row.height = 140;
    headerTable10_2Row.font = { name: 'Times New Roman', size: 15, bold: true };

    for (var i = 0; i <= 24; i++) {
      worksheet3.mergeCells(`${excelColumn[i]}40:${excelColumn[i]}41`);
    }
    for (var i = 25; i <= 29; i += 2) {
      worksheet3.mergeCells(`${excelColumn[i]}40:${excelColumn[i + 1]}40`);
    }
    worksheet3.mergeCells(`${excelColumn[32]}40:${excelColumn[34]}40`);
    for (var i = 35; i <= 42; i++) {
      worksheet3.mergeCells(`${excelColumn[i]}40:${excelColumn[i]}41`);
    }

    headerTable10_2Row.getCell(26).value = 'Company';
    headerTable10_2Row.getCell(27).value = 'Employee';
    headerTable10_2Row.getCell(28).value = 'Company';
    headerTable10_2Row.getCell(29).value = 'Employee';
    headerTable10_2Row.getCell(30).value = 'Company';
    headerTable10_2Row.getCell(31).value = 'Employee';
    headerTable10_2Row.getCell(32).value = 'Employee';
    headerTable10_2Row.getCell(33).value = 'Company';
    headerTable10_2Row.getCell(34).value = 'Employee';
    headerTable10_2Row.getCell(35).value = 'TOTAL';

    headerTable10_1.forEach((item, index) => {
      headerTable10_1Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerTable10_1Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

      if (index == 6 || index == 7 || index == 8 || index == 13 || index == 14) {
        headerTable10_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2DCDB' }
        };
      }
      else if (index == 1 || (index >= 17 && index <= 20) || (index >= 23 && index <= 30) || (index >= 35 && index <= 38) || index == 41 || index == 42) {
        headerTable10_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E4DFEC' }
        };
      }
      else if (index == 9 || index == 10) {
        headerTable10_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2F2F2' }
        };
      }
      else if (index == 11) {
        headerTable10_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DAEEF3' }
        };
      }
      else if (index == 12) {
        headerTable10_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FDE9D9' }
        };
      }
      else {
        headerTable10_1Row.getCell(index + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EBF1DE' }
        };
      }

      if (index >= 25 && index <= 34) {
        if (index >= 25 && index <= 30) {
          headerTable10_2Row.getCell(index + 1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E4DFEC' }
          };
        }
        else {
          headerTable10_2Row.getCell(index + 1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EBF1DE' }
          };
        }

        headerTable10_2Row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        headerTable10_2Row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      }
    });

    let headerTable10_3Row = worksheet3.addRow([null, null, null, null, null, 'Day', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', null, 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', 'VND', null, null, 'VND', 'VND']);
    headerTable10_3Row.height = 40;
    headerTable10_3Row.font = { name: 'Times New Roman', size: 15, bold: true };
    headerTable10_3Row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    for (var i = 1; i <= 43; i++) {
      headerTable10_3Row.getCell(i).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }

    /* data table 9 */
    let dataTable10 = result.listDataBaoCao3Bang3.map((item, index) => {
      let row = [];

      row.push(item.col1);
      row.push(item.col2);
      row.push(item.col3);
      row.push(item.col4);
      row.push(item.col5);
      row.push(item.col6);
      row.push(item.col7);
      row.push(item.col8);
      row.push(item.col9);
      row.push(item.col10);
      row.push(item.col11);
      row.push(item.col12);
      row.push(item.col13);
      row.push(item.col14);
      row.push(item.col15);
      row.push(item.col16);
      row.push(item.col17);
      row.push(item.col18);
      row.push(item.col19);
      row.push(item.col20);
      row.push(item.col21);
      row.push(item.col22);
      row.push(item.col23);
      row.push(item.col24);
      row.push(item.col25);
      row.push(item.col26);
      row.push(item.col27);
      row.push(item.col28);
      row.push(item.col29);
      row.push(item.col30);
      row.push(item.col31);
      row.push(item.col32);
      row.push(item.col33);
      row.push(item.col34);
      row.push(item.col35);
      row.push(item.col36);
      row.push(item.col37);
      row.push(item.col38);
      row.push(item.col39);
      row.push(item.col40);
      row.push(item.col41);
      row.push(item.col42);
      row.push(item.col43);

      return row;
    });

    dataTable10.forEach((el, index) => {
      let row = worksheet3.addRow(el);
      row.height = 30;
      row.font = { name: 'Times New Roman', size: 15 };

      for (let i = 0; i < el.length; i++) {
        row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

        if (i == 0) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
        else if (i == 1 || i == 2 || i == 3) {
          row.getCell(i + 1).font = { name: 'Times New Roman', size: 20, bold: true };
        }

        if (i >= 3) {
          row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          row.getCell(i + 1).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        }

        //Tính theo công thức
        if (i == 32) {
          row.getCell(i + 1).value = { formula: `=Z${row.number}+AB${row.number}+AD${row.number}`, date1904: false };
        }
        else if (i == 33) {
          row.getCell(i + 1).value = { formula: `=AA${row.number}+AC${row.number}+AE${row.number}+AF${row.number}`, date1904: false };
        }
        else if (i == 34) {
          row.getCell(i + 1).value = { formula: `=AH${row.number}+AG${row.number}`, date1904: false };
        }
      }
    });

    let empty3 = [];
    for (let i = 0; i <= 42; i++) {
      empty3.push('');
    }
    let empty3Row = worksheet3.addRow(empty3);
    empty3Row.height = 30;
    empty3Row.font = { name: 'Times New Roman', size: 15 };
    for (let i = 0; i < empty3.length; i++) {
      empty3Row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }

    let dataTable10Sum = [];
    for (let i = 0; i <= 42; i++) {
      if (i == 1) dataTable10Sum.push('TOTAL');
      else dataTable10Sum.push('');
    }

    let dataTable10SumRow = worksheet3.addRow(dataTable10Sum);
    dataTable10SumRow.height = 35;
    dataTable10SumRow.font = { name: 'Times New Roman', size: 16, bold: true, color: { argb: 'C00000' } };

    for (let i = 0; i < dataTable10Sum.length; i++) {
      dataTable10SumRow.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      dataTable10SumRow.getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FDE9D9' }
      };

      if (i == 1) {
        dataTable10SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }
      else if (i > 1) {
        dataTable10SumRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        dataTable10SumRow.getCell(i + 1).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
      }

      //Tính theo công thức
      if (i > 2) {
        dataTable10SumRow.getCell(i + 1).value = { formula: `=SUM(${this.getHeaderColumn(dataTable10SumRow.getCell(i + 1).$col$row)}43:${this.getHeaderColumn(dataTable10SumRow.getCell(i + 1).$col$row)}46)`, date1904: false };
      }
    }

    worksheet3.addRow(['']);

    let labelSheet3 = worksheet3.addRow(['', 'PREPARED BY:']);
    labelSheet3.font = { name: 'Times New Roman', family: 4, size: 20, bold: true };
    labelSheet3.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet3.addRow(['']);
    worksheet3.addRow(['']);
    worksheet3.addRow(['']);
    worksheet3.addRow(['']);
    worksheet3.addRow(['']);
    worksheet3.addRow(['']);

    let nameSheet3 = worksheet3.addRow(['', 'NGUYEN THI TRANG']);
    nameSheet3.font = { name: 'Times New Roman', family: 4, size: 20, bold: true };
    nameSheet3.alignment = { vertical: 'middle', horizontal: 'left' };

    /*---------------End: Sheet 3---------------*/

  }

  async exportLoaiBaoCao() {
    if (this.baoCaoNumber == null) {
      this.showMessage("error", "Chọn loại báo cáo!");
      return;
    }

    let workbook = new Workbook();

    let listBaoCao = this.baoCaoNumber.map(x => x.value);
    debugger
    // Due date contract
    if (listBaoCao.indexOf(1) > -1) {
      await this.xuatBaoCaoLuongCoBan(workbook);
    }
    // Meal Allowance + Trợ cấp chuyên cần
    if (listBaoCao.indexOf(2) > -1) {
      await this.xuatBaoCaoTroCapCoDinh(workbook);
    }
    // Báo cáo tổng hợp
    if (listBaoCao.indexOf(0) > -1) {
      await this.xuatBaoCao(workbook);
    }
    // Allowances
    if (listBaoCao.indexOf(5) > -1) {
      await this.exportExcelBaoCaoAllowances(workbook);
    }
    //Timesheet
    if (listBaoCao.indexOf(3) > -1) {
      await this.exportExcelWithTimeSheet(3, workbook);
    }
    //Nghỉ đột xuất
    if (listBaoCao.indexOf(521) > -1) {
      await this.exportExcelWithTimeSheet(521, workbook);
    }
    // đi muộn về sớm
    if (listBaoCao.indexOf(4) > -1) {
      await this.exportExcelWithTimeSheet(4, workbook);
    }
    // OT
    if (listBaoCao.indexOf(9) > -1) {
      await this.exportExcelBaoCao(9, workbook);
    }
    // OT
    if (listBaoCao.indexOf(10) > -1) {
      await this.exportExcelBaoCao(10, workbook);
    }
    //Tổng hợp OT
    if (listBaoCao.indexOf(91) > -1) {
      await this.exportExcelBaoCaoOT(91, workbook);
    }
    this.exportToExel(workbook, "Báo cáo");
    this.baoCaoNumber = [];
  }

  async xuatBaoCaoLuongCoBan(workbook) {
    this.loading = true
    let result: any = await this.salaryService.exportExcelKyLuongMealAllowance(1, this.kyLuongId);
    this.loading = false
    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }
    let title = 'Due date contract';
    let worksheet = workbook.addWorksheet(title);

    /* header table */
    let headerBaoCao1 = result.listHeader[0]

    let headerRow1 = worksheet.addRow(headerBaoCao1);

    headerRow1.height = 70;
    headerRow1.font = { name: 'Times New Roman', size: 11, bold: true };

    headerBaoCao1.forEach((item, index) => {
      headerRow1.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      headerRow1.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow1.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8DB4E2' }
      };
    });

    let data: Array<any> = [];
    var server = result.data;

    for (let i = 0; i < server.length; i++) {
      let row: Array<any> = [];
      let item = server[i];
      row[0] = i + 1;
      row[1] = item.maNhanVien;
      row[2] = item.hoTen;
      row[3] = item.hoTenTiengAnh;
      row[4] = item.luongThuViec;
      row[5] = item.luongHopDong;
      row[6] = '-';
      data.push(row);
    }

    let rowTotal = [];
    rowTotal[0] = 'TOTAL';
    rowTotal[1] = '';
    rowTotal[2] = '';
    rowTotal[3] = '';
    rowTotal[4] = '';
    rowTotal[5] = '';
    rowTotal[6] = '';

    data.push(rowTotal);

    let rowAverage = [];
    rowAverage[0] = 'AVERAGE';
    rowAverage[1] = '';
    rowAverage[2] = '';
    rowAverage[3] = '';
    rowAverage[4] = '';
    rowAverage[5] = '';
    rowAverage[6] = '';

    data.push(rowAverage);

    console.log(data)
    data.forEach((el, index, array) => {
      let row = worksheet.addRow(el);
      row.font = { name: 'Times New Roman', size: 11 };

      row.getCell(1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      row.getCell(1).numFmt = '#,##0';

      row.getCell(2).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      row.getCell(2).numFmt = '[$-en-US]mmm/yy;@';

      row.getCell(3).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      row.getCell(3).numFmt = '[$-en-US]mmm/yy;@';

      row.getCell(4).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      row.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      row.getCell(4).numFmt = '[$-en-US]mmm/yy;@';

      row.getCell(5).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      row.getCell(5).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
      row.getCell(5).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';

      row.getCell(6).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      row.getCell(6).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
      row.getCell(6).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';

      row.getCell(7).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      row.getCell(7).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
      row.getCell(7).value = { formula: `=+F${row.number}-E${row.number}`, date1904: false };
      row.getCell(7).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';

      if (index + 3 > data.length) {
        row.font = { name: 'Times New Roman', size: 11, bold: true };
      }

      if (index + 2 == data.length) {
        row.getCell(5).value = { formula: `=SUM(E2:E${data.length - 1})`, date1904: false };
        row.getCell(6).value = { formula: `=SUM(F2:F${data.length - 1})`, date1904: false };
        row.getCell(7).value = { formula: `=SUM(G2:G${data.length - 1})`, date1904: false };
      }
      if (index + 1 == data.length) {
        row.getCell(5).value = { formula: `=+E${data.length}/${data.length - 2}`, date1904: false };
        row.getCell(6).value = { formula: `=+F${data.length}/${data.length - 2}`, date1904: false };
        row.getCell(7).value = '';
      }
    });

    worksheet.mergeCells(`A${data.length}:D${data.length}`);
    worksheet.mergeCells(`A${data.length + 1}:D${data.length + 1}`);

    /* fix with for column */
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;

  }

  async xuatBaoCaoTroCapCoDinh(workbook) {
    this.loading = true
    let result: any = await this.salaryService.exportExcelKyLuongMealAllowance(2, this.kyLuongId);
    this.loading = false
    if (result.statusCode != 200) {
      this.showMessage("error", result.messageCode);
      return;
    }

    let title = 'Meal Allowance';

    let worksheet2 = workbook.addWorksheet(title);
    let titleTable2Row = worksheet2.addRow([``]);
    worksheet2.mergeCells(`A1:L1`)

    /* title table 2 */
    titleTable2Row = worksheet2.addRow([`${result.listTitle[0][0]}`]);
    titleTable2Row.font = { name: 'Times New Roman', family: 4, size: 13, bold: true };
    titleTable2Row.height = 40;
    titleTable2Row.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet2.mergeCells(`A2:L2`)

    titleTable2Row = worksheet2.addRow([`${result.listTitle[0][1]}`]);
    titleTable2Row.font = { name: 'Times New Roman', family: 4, size: 13, bold: true };
    titleTable2Row.height = 40;
    titleTable2Row.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet2.mergeCells(`A3:L3`)
    titleTable2Row = worksheet2.addRow([``]);
    worksheet2.mergeCells(`A4:L4`)

    /* header table */
    let dataHeaderT2Row1 = result.listHeader[1][0]

    let headerT2Row1 = worksheet2.addRow(dataHeaderT2Row1);
    headerT2Row1.height = 50;
    headerT2Row1.font = { name: 'Times New Roman', size: 11, bold: true };

    let dataHeaderT2Row2 = result.listHeader[1][1]

    let serverHeader = worksheet2.addRow(dataHeaderT2Row2);
    serverHeader.height = 15;

    dataHeaderT2Row2.forEach((item, index) => {
      serverHeader.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      serverHeader.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      serverHeader.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8DB4E2' }
      };
      if (index == 5) {
        serverHeader.font = { name: 'Times New Roman', size: 11, bold: true };
        serverHeader.getCell(6).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      }
    });

    dataHeaderT2Row1.forEach((item, index) => {
      headerT2Row1.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      headerT2Row1.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerT2Row1.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8DB4E2' }
      };

      if (index == 5) {
        headerT2Row1.getCell(9).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        headerT2Row1.getCell(11).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        headerT2Row1.getCell(12).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        headerT2Row1.getCell(13).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      }

      if (item.length >= 30) {
        worksheet2.getColumn(index + 1).width = 22;
      } else if (item.length <= 30) {
        worksheet2.getColumn(index + 1).width = 15;
      }
    });

    worksheet2.mergeCells(`A5:A6`)
    worksheet2.mergeCells(`B5:B6`)
    worksheet2.mergeCells(`C5:C6`)
    worksheet2.mergeCells(`D5:D6`)
    worksheet2.mergeCells(`E5:E6`)
    worksheet2.mergeCells(`G5:G6`)
    worksheet2.mergeCells(`K5:K6`)
    worksheet2.mergeCells(`L5:L6`)

    let data2: Array<any> = [];

    var server2 = result.data1

    for (let i = 0; i < server2.length; i++) {
      let row: Array<any> = [];
      let item = server2[i];
      row[0] = i + 1;
      row[1] = item.code;
      row[2] = item.maPhong;
      row[3] = item.name;
      row[4] = item.duocTraTienAn;
      row[5] = item.soTienAnTB;
      row[6] = item.soNgayLamViec;
      row[7] = item.soTienAnDuocTra;
      row[8] = item.soTienAnThieu;
      row[9] = item.soTienAnThua;
      row[10] = item.sumTienAnDuocTra;
      row[11] = item.ghiChu;

      data2.push(row);
    }

    let totalRow = [];
    totalRow[0] = '-';
    totalRow[1] = '';
    totalRow[2] = '';
    totalRow[3] = '';
    totalRow[4] = '';
    totalRow[5] = '';
    totalRow[6] = '';
    totalRow[7] = '';
    totalRow[8] = '';
    totalRow[9] = '';
    totalRow[10] = '';
    totalRow[11] = '';

    data2.push(totalRow);

    data2.forEach((el, index, array) => {
      let row = worksheet2.addRow(el);
      row.font = { name: 'Times New Roman', size: 11 };

      el.forEach((element, index) => {
        row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      });

      row.getCell(2).numFmt = '[$-en-US]mmm/yy;@';
      row.getCell(4).numFmt = '[$-en-US]mmm/yy;@';
      row.getCell(5).numFmt = '[$-en-US]mmm/yy;@';
      row.getCell(6).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(6).value = { formula: `=+$F$6/$H$6`, date1904: false };
      row.getCell(7).numFmt = '0.00';
      row.getCell(8).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(8).value = { formula: `=+IF(E${row.number}="Yes",G${row.number}*F${row.number},0)`, date1904: false };
      row.getCell(9).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(10).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(11).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(11).value = { formula: `=H${row.number}+I${row.number}-J${row.number}`, date1904: false };
      row.getCell(12).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';

      if (index == data2.length - 1) {
        row.font = { name: 'Times New Roman', size: 11, bold: true };
        row.getCell(6).value = { formula: `=SUM(F7:F${data2.length + 5})`, date1904: false };
        row.getCell(7).value = { formula: `=SUM(G7:G${data2.length + 5})`, date1904: false };
        row.getCell(8).value = { formula: `=SUM(H7:H${data2.length + 5})`, date1904: false };
        row.getCell(9).value = { formula: `=SUM(I7:I${data2.length + 5})`, date1904: false };
        row.getCell(10).value = { formula: `=SUM(J7:J${data2.length + 5})`, date1904: false };
        row.getCell(11).value = { formula: `=SUM(K7:K${data2.length + 5})`, date1904: false };
        row.getCell(12).value = { formula: `=SUM(L7:L${data2.length + 5})`, date1904: false };
      }
    });

    let signature = worksheet2.addRow([]);
    signature = worksheet2.addRow([]);

    signature = worksheet2.addRow([`PREPARED BY:`]);
    signature.font = { name: 'Times New Roman', family: 4, size: 14, bold: true };
    signature.height = 40;

    signature = worksheet2.addRow([`NGUYEN THI TRANG`]);
    signature.font = { name: 'Times New Roman', family: 4, size: 14, bold: true };
    signature.height = 40;

    // SHEET 3
    let title3 = 'Trợ cấp chuyên cần';

    let worksheet3 = workbook.addWorksheet(title3);

    /* title table 3 */
    let titleData3 = result.listTitle[1][0]
    //
    let titleTable3Row = worksheet3.addRow([titleData3]);
    titleTable3Row.font = { name: 'Times New Roman', family: 4, size: 13, bold: true };
    titleTable3Row.height = 40;
    titleTable3Row.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet3.mergeCells(`A1:P1`)

    /* header table */
    let dataHeaderT3Row1 = result.listHeader[2][0]

    let headerT3Row1 = worksheet3.addRow(dataHeaderT3Row1);
    // headerRow1.height = 50;
    headerT3Row1.font = { name: 'Times New Roman', size: 11, bold: true };


    let dataHeaderT3Row2 = result.listHeader[2][1]

    let headerT3Row2 = worksheet3.addRow(dataHeaderT3Row2);
    // headerRow2.height = 15;
    headerT3Row2.font = { name: 'Times New Roman', size: 11, bold: true };


    let dataHeaderT3Row3 = result.listHeader[2][2]

    let headerT3Row3 = worksheet3.addRow(dataHeaderT3Row3);
    // headerRow2.height = 15;
    headerT3Row3.font = { name: 'Times New Roman', size: 11, bold: true };

    dataHeaderT3Row3.forEach((item, index) => {
      headerT3Row3.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      headerT3Row3.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerT3Row3.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8DB4E2' }
      };
      if (index == 10) {
        headerT3Row3.getCell(11).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      }
      if (index == 14) {
        headerT3Row3.getCell(15).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      }
      if (item.length > 0) {
        headerT3Row3.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
      }
    });

    dataHeaderT3Row2.forEach((item, index) => {
      headerT3Row2.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      headerT3Row2.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerT3Row2.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8DB4E2' }
      };
    });

    dataHeaderT3Row1.forEach((item, index) => {
      headerT3Row1.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      headerT3Row1.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerT3Row1.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8DB4E2' }
      };

      if (item.length >= 30) {
        worksheet3.getColumn(index + 1).width = 22;
      } else if (item.length <= 30) {
        worksheet3.getColumn(index + 1).width = 15;
      }
    });

    //MERGER Header
    worksheet3.mergeCells(`A2:A4`)
    worksheet3.mergeCells(`B2:B4`)
    worksheet3.mergeCells(`C2:C4`)
    worksheet3.mergeCells(`D2:D4`)
    worksheet3.mergeCells(`E2:E4`)
    worksheet3.mergeCells(`F2:F4`)
    worksheet3.mergeCells(`G2:K2`)
    worksheet3.mergeCells(`L2:O2`)
    worksheet3.mergeCells(`P2:P4`)

    worksheet3.mergeCells(`G3:G4`)
    worksheet3.mergeCells(`H3:H4`)
    worksheet3.mergeCells(`I3:I4`)
    worksheet3.mergeCells(`J3:J4`)
    worksheet3.mergeCells(`L3:L4`)
    worksheet3.mergeCells(`M3:M4`)
    worksheet3.mergeCells(`N3:N4`)

    let data3: Array<any> = [];

    var server3 = result.data2

    for (let i = 0; i < server3.length; i++) {
      let row: Array<any> = [];
      let item = server3[i];

      row[0] = i + 1;
      row[1] = item.maNV;
      row[2] = item.maPhong;
      row[3] = item.name;
      row[4] = item.typeOfContact === 'HĐĐT' ? 'HĐĐT' : 'HĐLĐ';
      row[5] = item.chuyenCan;
      row[6] = item.ngayNghiDotXuat;
      row[7] = item.ngayNghi;
      row[8] = item.ngayLamViec;
      row[9] = item.troCapTheoNgayLam;
      row[10] = item.troCapChuyenCan;
      row[11] = item.soLanDMVS;
      row[12] = item.soNgayLamViec;
      row[13] = item.troCapDMVS;
      row[14] = item.troCapChuyenCanNgayCong;
      row[15] = item.ghiChu;

      data3.push(row);
    }

    let _totalRow = [];
    _totalRow[0] = '-';
    _totalRow[1] = '';
    _totalRow[2] = '';
    _totalRow[3] = '';
    _totalRow[4] = '';
    _totalRow[5] = '';
    _totalRow[6] = '';
    _totalRow[7] = '';
    _totalRow[8] = '';
    _totalRow[9] = '';
    _totalRow[11] = '';
    _totalRow[10] = '';
    _totalRow[12] = '';
    _totalRow[13] = '';
    _totalRow[14] = '';
    _totalRow[15] = '';

    data3.push(_totalRow);

    data3.forEach((el, index, array) => {
      let row = worksheet3.addRow(el);
      row.font = { name: 'Times New Roman', size: 11 };

      el.forEach((element, index) => {
        row.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        row.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      });

      //format data
      row.getCell(2).numFmt = '[$-en-US]mmm/yy;@';
      row.getCell(4).numFmt = '[$-en-US]mmm/yy;@';
      row.getCell(5).numFmt = '[$-en-US]mmm/yy;@';
      row.getCell(6).numFmt = '[$-en-US]mmm/yy;@';
      row.getCell(7).numFmt = '0.00';
      row.getCell(8).numFmt = '0.00';
      row.getCell(9).numFmt = '0.00';
      row.getCell(10).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(10).value = { formula: `=+IF(AND(E${row.number}="HĐLĐ",F${row.number}="Yes"),($K$4/20)*I${row.number},0)`, date1904: false };
      row.getCell(11).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(11).value = { formula: `=IF(AND(AND($E${row.number}="HĐLĐ",$F${row.number}="Yes"),OR(G${row.number}>3.5,H${row.number}>5)),J${row.number}*0%,IF(AND(AND($E${row.number}="HĐLĐ",$F${row.number}="Yes"),OR(G${row.number}>=1.5,H${row.number}>=4)),J${row.number}*50%,IF(AND(AND($E${row.number}="HĐLĐ",$F${row.number}="Yes"),OR(G${row.number}>=0,H${row.number}>=0)),J${row.number}*100%,0)))`, date1904: false };
      row.getCell(12).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(13).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(14).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(14).value = { formula: `=+IF(F${row.number}="Yes",$O$4/20*M${row.number},0)`, date1904: false };
      row.getCell(15).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
      row.getCell(15).value = { formula: `=+IF(L${row.number}<=5,N${row.number}-(L${row.number}*20000),IF(AND(L${row.number}>5,L${row.number}<=8),N${row.number}*50%,IF(L${row.number}>8,0,0)))`, date1904: false };
      row.getCell(16).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';

      if (index + 1 == data3.length) {
        row.font = { name: 'Times New Roman', size: 11, bold: true };
        row.getCell(7).value = { formula: `=SUM(G5:G${data3.length + 3})`, date1904: false };
        row.getCell(8).value = { formula: `=SUM(H5:H${data3.length + 3})`, date1904: false };
        row.getCell(9).value = { formula: `=SUM(I5:I${data3.length + 3})`, date1904: false };
        row.getCell(10).value = { formula: `=SUM(J5:J${data3.length + 3})`, date1904: false };
        row.getCell(11).value = { formula: `=SUM(K5:K${data3.length + 3})`, date1904: false };
        row.getCell(12).value = { formula: `=SUM(L5:L${data3.length + 3})`, date1904: false };
        row.getCell(13).value = { formula: `=SUM(M5:M${data3.length + 3})`, date1904: false };
        row.getCell(14).value = { formula: `=SUM(N5:N${data3.length + 3})`, date1904: false };
        row.getCell(15).value = { formula: `=SUM(O5:O${data3.length + 3})`, date1904: false };
        row.getCell(16).value = { formula: `=SUM(P5:P${data3.length + 3})`, date1904: false };
      }
    });

    let signature3 = worksheet3.addRow([]);
    signature3 = worksheet3.addRow([]);

    signature3 = worksheet3.addRow([`PREPARED BY:`]);
    signature3.font = { name: 'Times New Roman', family: 4, size: 14, bold: true };

    signature3 = worksheet3.addRow([`NGUYEN THI TRANG`]);
    signature3.font = { name: 'Times New Roman', family: 4, size: 14, bold: true };

    /* fix with for column */
    worksheet3.getColumn(1).width = 8;
    worksheet3.getColumn(2).width = 10;
    worksheet3.getColumn(3).width = 10;
    worksheet3.getColumn(4).width = 20;
    worksheet3.getColumn(5).width = 15;
    worksheet3.getColumn(6).width = 10;

    worksheet3.getColumn(7).width = 10;
    worksheet3.getColumn(8).width = 10;
    worksheet3.getColumn(9).width = 10;
    worksheet3.getColumn(10).width = 10;
    worksheet3.getColumn(11).width = 15;

    worksheet3.getColumn(12).width = 10;
    worksheet3.getColumn(13).width = 10;
    worksheet3.getColumn(14).width = 10;
    worksheet3.getColumn(15).width = 15;
    worksheet3.getColumn(16).width = 15;

  }

  exportToExel(workbook: Workbook, fileName: string) {
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs.saveAs(blob, fileName);
    })
  }

  getHeaderColumn(colrow: string) {
    return colrow.slice(1, colrow.lastIndexOf('$'));
  }

  async capNhatBangLuong() {
    this.loading = true;
    this.awaitResult = true;
    let result: any = await this.salaryService.capNhatBangLuong(this.kyLuongId);

    if (result.statusCode != 200) {
      this.loading = false;
      this.awaitResult = false;
      this.showMessage("error", result.messageCode);
      return;
    }

    await this.getData();
    this.showMessage("success", result.messageCode);
  }

  back() {
    this.router.navigate(['/salary/ky-luong-list']);
  }

  showMessage(severity: string, detail: string) {
    let msg = { severity: severity, summary: "Thông báo:", detail: detail };
    this.messageService.add(msg);
  }

  async exportExcelBaoCaoAllowances(workBook: Workbook) {
    this.loading = true;
    this.awaitResult = true;
    let result: any = await this.salaryService.getDataBaoCaoAllowances(this.kyLuongId);
    console.log(result)
    let tongSoCotDong = result.tongSoCotDong;
    this.loading = false;
    this.awaitResult = false;
    let title = 'Allowances';

    let worksheet = workBook.addWorksheet(title);

    //Cột hàng 1
    let dataHeaderRow1: Array<string> = result.listHeader1;
    let headerRow1 = worksheet.addRow(dataHeaderRow1);
    headerRow1.font = { name: 'Time New Roman', size: 10, bold: true };
    headerRow1.height = 35;
    worksheet.mergeCells(`J${1}:O${1}`);
    worksheet.mergeCells(`P${1}:U${1}`);
    // merge by (start row, start column, end row, end column)
    worksheet.mergeCells(1, 32, 1, 32 + tongSoCotDong - 1); //worksheet.mergeCells(`AF${1}:AK${1}`);

    dataHeaderRow1.forEach((item, index) => {
      this.setWidthColExportBaoCao(item, worksheet, index, headerRow1, dataHeaderRow1, true)
    });

    //Cột hàng 2
    let dataHeaderRow2: Array<string> = result.listHeader2;
    let headerRow2 = worksheet.addRow(dataHeaderRow2);
    headerRow2.font = { name: 'Time New Roman', size: 10, bold: true };
    headerRow2.height = 45;

    dataHeaderRow2.forEach((item, index) => {
      //merge header column row1 vs row2
      if (item == "") {
        // merge by (start row, start column, end row, end column)
        // merge 2 dòng
        worksheet.mergeCells(1, index + 1, 2, index + 1);
      }
      this.setWidthColExportBaoCao(item, worksheet, index, headerRow2, dataHeaderRow2, false)
    });

    //Lấy data
    let dataExportExcel = [];
    result.listData.forEach(row => {
      let dataRow = {};
      row.forEach(item => {
        //Nếu dữ liệu là kiểu số => convert sang kiểu số
        if (item.valueType == 1) {
          dataRow[item.columnKey] = parseFloat(item.columnValue);
        }
        //Nếu dữ liệu là kiểu ký tự => giữ nguyên
        else {
          dataRow[item.columnKey] = item.columnValue;
        }
      });
      dataExportExcel = [...dataExportExcel, dataRow];
    });

    let data = dataExportExcel.map((item, index) => {
      let row = [];
      Object.keys(item).forEach(key => {
        row.push(item[key]);
      });
      return row;
    });

    let excelColumn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];

    data.forEach((el, index, array) => {
      let row = worksheet.addRow(el);
      //Chỉnh bordor và thuộc tính của từng cột của dòng
      dataHeaderRow1.forEach((col, colIndex) => {
        row.font = { name: 'Times New Roman', size: 11 };
        row.getCell(colIndex + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        row.getCell(colIndex + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        for (let i = 0; i < el.length; i++) {
          if (i >= 15 && i != 17 && i != el.length - 1) {
            row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
            row.getCell(i + 1).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
          }

          if (i == tongSoCotDong + 30) {
            row.getCell(i + 1).value = { formula: `=SUM(${excelColumn[i - tongSoCotDong + 1]}${row.number}:${excelColumn[i - 1]}${row.number})`, date1904: false };
          }

          if (i == el.length - 2) {
            row.getCell(i + 1).value = { formula: `=U${row.number}+O${row.number}`, date1904: false };
          }
        }
      });
    });

  }

  async exportExcelBaoCao(value, workBook) {
    this.loading = true;
    this.awaitResult = true;
    debugger
    let result: any = await this.salaryService.getDataExportOT(this.kyLuongId, value);
    this.loading = false;
    this.awaitResult = false;
    let title = this.listBaoCao.find(x => x.value == value).name;

    let worksheet = workBook.addWorksheet(title);
    //Cột hàng 1
    let dataHeaderRow1: Array<string> = result.listDataHeader[0].map(e => e.columnValue);
    let headerRow1 = worksheet.addRow(dataHeaderRow1);
    headerRow1.font = { name: 'Time New Roman', size: 10, bold: true };
    // this.mergeHearExportBaoCao(value, worksheet);
    dataHeaderRow1.forEach((item, index) => {
      this.setWidthColExportBaoCao(item, worksheet, index, headerRow1, dataHeaderRow1, true)
    });

    if (value == 10) {
      headerRow1.height = 60;
    } else {
      headerRow1.height = 40;
    }

    //Cột hàng 2
    let dataHeaderRow2: Array<string> = result.listDataHeader[1].map(e => e.columnValue);
    let headerRow2 = worksheet.addRow(dataHeaderRow2);
    headerRow2.font = { name: 'Time New Roman', size: 10, bold: true };
    dataHeaderRow2.forEach((item, index) => {
      this.setWidthColExportBaoCao(item, worksheet, index, headerRow2, dataHeaderRow2, false)
    });
    if (value == 10) {
      headerRow2.height = 85;
    } else {
      headerRow2.height = 40;
    }

    this.mergeHearExportBaoCao(value, worksheet);
    //Nếu báo cáo thuộc loại: 3 => có 3 headerrow
    if (value == 3 || value == 521) {
      //Cột hàng 3
      let dataHeaderRow3: Array<string> = result.listDataHeader[2].map(e => e.columnValue);
      let headerRow3 = worksheet.addRow(dataHeaderRow3);
      headerRow3.font = { name: 'Time New Roman', size: 10, bold: true };
      dataHeaderRow3.forEach((item, index) => {
        this.setWidthColExportBaoCao(item, worksheet, index, headerRow3, dataHeaderRow3, false)
      });
      headerRow3.height = 27;
    }
    if (value == 10) {
      this.countOTHERALLOWANCE = 0
      this.countOTHERBONUS = 0
      let dataHeaderFull = result.listDataHeader[0]

      dataHeaderFull.forEach((item, index) => {
        if (item.columnKey.includes('indexCTCDHeader1_') || item.columnKey.includes('indexCTCDSumHeader1_')
        ) {
          this.countOTHERALLOWANCE += 1
        }
        else if (item.columnKey.includes('index_ctkHeader1') || item.columnKey.includes('indexCTKSumHeader1_')
        ) {
          this.countOTHERBONUS += 1
        }
        this.setWidthColExportBaoCao(item.columnValue, worksheet, index, headerRow2, dataHeaderRow2, false)
      });

      //merge cot động
      // merge by start row, start column, end row, end column

      worksheet.mergeCells(1, 40, 1, 40 + this.countOTHERALLOWANCE - 1);

      worksheet.mergeCells(1, 40 + this.countOTHERALLOWANCE, 1, 40 + this.countOTHERALLOWANCE + this.countOTHERBONUS - 1);

      this.soLuongColDong = 40 + this.countOTHERALLOWANCE + this.countOTHERBONUS

    } else {
      dataHeaderRow2.forEach((item, index) => {
        //merge header column row1 vs row2
        if (item == "") {
          // merge 2 dòng
          worksheet.mergeCells(1, index + 1, 2, index + 1);
        }
        this.setWidthColExportBaoCao(item, worksheet, index, headerRow2, dataHeaderRow2, false)
      });
    }

    //Lấy data
    let dataExportExcel = [];
    result.listData.forEach(row => {
      let dataRow = {};
      row.forEach(item => {
        dataRow[item.columnKey] = item.columnValue;
      });
      dataExportExcel = [...dataExportExcel, dataRow];
    });

    let data = dataExportExcel.map((item, index) => {
      let row = [];
      Object.keys(item).forEach(key => {
        row.push(item[key]);
      });
      return row;
    });
    if (value == 10) {
      this.setBorderTungDong10(data, worksheet, dataHeaderRow1);
    } else {
      this.setBorderTungDong(data, worksheet, dataHeaderRow1);
    }

  }

  async exportExcelBaoCaoOT(value, workBook) {
    this.loading = true;
    this.awaitResult = true;
    debugger
    let result: any = await this.salaryService.getDataExportOT(this.kyLuongId, 9);
    this.loading = false;
    this.awaitResult = false;
    let title = this.listBaoCao.find(x => x.value == value).name;

    let worksheet = workBook.addWorksheet(title);
    //Cột hàng 1
    let dataHeaderRow1: Array<string> = result.listDataHeader[2].map(e => e.columnValue);
    let headerRow1 = worksheet.addRow(dataHeaderRow1);
    headerRow1.font = { name: 'Time New Roman', size: 10, bold: true };
    // this.mergeHearExportBaoCao(value, worksheet);
    dataHeaderRow1.forEach((item, index) => {
      this.setWidthColExportBaoCao(item, worksheet, index, headerRow1, dataHeaderRow1, true)
    });
    headerRow1.height = 40;

    //Tính số cột ngày động
    debugger
    let dataFull = result.listDataHeader[2]
    var soCotNgay = 0
    var soCotTongLanOT = 0
    var soCottongGioOT = 0
    dataFull.forEach(e => {
      if (e.columnKey.includes('index_s') || e.columnKey.includes('index_c')) {
        soCotNgay += 1
      } else if (e.columnKey.includes('tongLanOT')) {
        soCotTongLanOT += 1
      } else if (e.columnKey.includes('tongGioOT')) {
        soCottongGioOT += 1
      }
    })
    //Gộp cột động
    //cột ngày
    for (let i = 0; i < soCotNgay; i += 2) {
      worksheet.mergeCells(1, 5 + i, 1, 5 + i + 1);
    }
    //cột số lần OT
    worksheet.mergeCells(1, 5 + soCotNgay, 1, 5 + soCotNgay + soCotTongLanOT - 1);
    //cột số giờ OT
    for (let i = 0; i < soCottongGioOT; i += 3) {
      worksheet.mergeCells(1, 5 + soCotNgay + soCotTongLanOT + i, 1, 5 + soCotNgay + soCotTongLanOT + i + 2);
    }
    //add format

    //Cột hàng 2
    let dataHeaderRow2: Array<string> = result.listDataHeader[3].map(e => e.columnValue);
    let headerRow2 = worksheet.addRow(dataHeaderRow2);
    headerRow2.font = { name: 'Time New Roman', size: 10, bold: true };
    dataHeaderRow2.forEach((item, index) => {
      this.setWidthColExportBaoCao(item, worksheet, index, headerRow2, dataHeaderRow2, false)
    });

    headerRow2.height = 40;
    this.mergeHearExportBaoCao(value, worksheet);

    dataHeaderRow2.forEach((item, index) => {
      //merge header column row1 vs row2
      if (item == "") {
        // merge by start row, start column, end row, end column
        worksheet.mergeCells(1, index + 1, 2, index + 1);
      }
      this.setWidthColExportBaoCao(item, worksheet, index, headerRow2, dataHeaderRow2, false)
    });

    //Lấy data
    let dataExportExcel = [];
    result.listData.forEach((row, index) => {
      let dataRow = {};
      if (index == 1) {
        row.forEach(item => {
          dataRow[item.columnKey] = item.columnValue;
        });
        dataExportExcel = [...dataExportExcel, dataRow];
      }
    });

    let data = dataExportExcel.map((item, index) => {
      let row = [];
      Object.keys(item).forEach(key => {
        row.push(item[key]);
      });
      return row;
    });
    if (value == 10) {
      // this.setBorderTungDong10(data, worksheet, dataHeaderRow1);
    } else {
      this.setBorderTungDong(data, worksheet, dataHeaderRow1);
    }

  }

  //merge header
  mergeHearExportBaoCao(value, worksheet) {
    if (value == 9) { //OT
      worksheet.mergeCells(`H${1}:K${1}`);
      worksheet.mergeCells(`L${1}:O${1}`);
      worksheet.mergeCells(`P${1}:S${1}`);

      worksheet.mergeCells(`T${1}:W${1}`);
      worksheet.mergeCells(`X${1}:AA${1}`);
      worksheet.mergeCells(`AB${1}:AE${1}`);

      worksheet.mergeCells(`AF${1}:AI${1}`);
      worksheet.mergeCells(`AJ${1}:AL${1}`);
      worksheet.mergeCells(`AQ${1}:AS${1}`);

      worksheet.mergeCells(`AT${1}:AV${1}`);
      worksheet.mergeCells(`AW${1}:AY${1}`);
      worksheet.mergeCells(`AZ${1}:BB${1}`);
    }
    if (value == 5) { //Allowances
      worksheet.mergeCells(`J${1}:O${1}`);
      worksheet.mergeCells(`P${1}:U${1}`);
      worksheet.mergeCells(`AF${1}:AK${1}`);
    }
    if (value == 10) { //Payroll
      worksheet.mergeCells(`A1:A2`);
      worksheet.mergeCells(`B1:B2`);
      worksheet.mergeCells(`C1:C2`);
      worksheet.mergeCells(`D1:D2`);
      worksheet.mergeCells(`E1:E2`);
      worksheet.mergeCells(`F1:F2`);
      worksheet.mergeCells(`G1:G2`);
      worksheet.mergeCells(`H1:H2`);
      worksheet.mergeCells(`I1:I2`);
      worksheet.mergeCells(`J1:J2`);
      worksheet.mergeCells(`K1:K2`);
      worksheet.mergeCells(`L1:L2`);
      worksheet.mergeCells(`M1:M2`);
      worksheet.mergeCells(`N1:N2`);
      worksheet.mergeCells(`O1:O2`);
      worksheet.mergeCells(`P1:P2`);
      worksheet.mergeCells(`Q1:Q2`);
      worksheet.mergeCells(`R1:R2`);

      worksheet.mergeCells(`S1:S2`);
      worksheet.mergeCells(`T1:T2`);
      worksheet.mergeCells(`U1:U2`);
      worksheet.mergeCells(`V1:V2`);
      worksheet.mergeCells(`W1:W2`);
      worksheet.mergeCells(`X1:X2`);
      worksheet.mergeCells(`Y1:Y2`);
      worksheet.mergeCells(`Z1:Z2`);
      worksheet.mergeCells(`AA1:AA2`);
      worksheet.mergeCells(`AB1:AB2`);
      worksheet.mergeCells(`AC1:AC2`);
      worksheet.mergeCells(`AD1:AD2`);
      worksheet.mergeCells(`AE1:AE2`);
      worksheet.mergeCells(`AF1:AF2`);
      worksheet.mergeCells(`AH1:AH2`);
      worksheet.mergeCells(`AG1:AG2`);
      worksheet.mergeCells(`AI1:AI2`);
      worksheet.mergeCells(`AJ1:AJ2`);
      worksheet.mergeCells(`AK1:AM1`);
    }
  }

  //Chỉnh border của header
  setWidthColExportBaoCao(item, worksheet, index, headerRow1, dataHeaderRow1, isHeader1) {
    if (index + 1 < dataHeaderRow1.length + 1) {
      headerRow1.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      headerRow1.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow1.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8DB4E2' }
      };
    }
    if (isHeader1) {
      worksheet.getColumn(index + 1).width = 15;
      // chỉnh độ rộng cột theo độ dài ký tự
      if (item.length >= 14) {
        worksheet.getColumn(index + 1).width = 15;
      } else if (item.length >= 30) {
        worksheet.getColumn(index + 1).width = 22;
      } else if (item.length >= 60) {
        worksheet.getColumn(index + 1).width = 27;
      } else if (item.length >= 80) {
        worksheet.getColumn(index + 1).width = 30;
      }
    }
  }

  //Chỉnh bordor và thuộc tính của từng cột của dòng
  setBorderTungDong(data, worksheet, dataHeaderRow1) {
    data.forEach((el, index, array) => {
      let row = worksheet.addRow(el);
      //Chỉnh bordor và thuộc tính của từng cột của dòng
      dataHeaderRow1.forEach((col, colIndex) => {
        row.font = { name: 'Times New Roman', size: 11 };
        row.getCell(colIndex + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        row.getCell(colIndex + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      })
    });
  }

  async exportExcelWithTimeSheet(value, workbook) {
    this.loading = true;
    this.awaitResult = true;
    let result: any = await this.salaryService.getDataExportOT(this.kyLuongId, value);
    this.loading = false;
    this.awaitResult = false;

    let soCotCungBatDau = 0;
    if (value == 3) soCotCungBatDau = 5;
    if (value == 521) soCotCungBatDau = 4;
    if (value == 4) soCotCungBatDau = 7;

    //Đi muộn về sớm
    if (result.listData.length > 0) {
      let title = this.listBaoCao.find(x => x.value == value).name;
      let worksheet = workbook.addWorksheet(title);

      /* title */
      let titleRow = worksheet.addRow([title]);
      titleRow.font = { family: 4, size: 16, bold: true };
      titleRow.height = 25;
      worksheet.mergeCells(`A${titleRow.number}:T${titleRow.number}`)
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.addRow([]);
      worksheet.addRow([]);

      this.setBorderHeaderBaoCaoCoTimeSheet(result, soCotCungBatDau, worksheet);

      debugger
      //Lấy data
      let dataExportExcel = [];
      result.listData.forEach(row => {
        let dataRow = {};
        row.forEach(item => {
          dataRow[item.columnKey] = item.columnValue;
        });
        dataExportExcel = [...dataExportExcel, dataRow];
      });

      let data = dataExportExcel.map((item, index) => {
        let row = [];
        Object.keys(item).forEach(key => {
          row.push(item[key]);
        });
        return row;
      });


      data.forEach((el, index) => {
        let row = worksheet.addRow(el);

        for (let i = 0; i < el.length; i++) {
          row.getCell(i + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

          if (i == 0 || i == 1 || i > 6) {
            row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

            //highlight đỏ giờ đi sớm về muộn
            if (i > 6) {
              let indexGio = i - 6;
              let code = el[1];

              //Lấy ngày
              let indexNgay = 0;
              if (indexGio % 4 == 0) {
                indexNgay = indexGio / 4;
              }
              else {
                indexNgay = Math.floor(indexGio / 4) + 1;
              }
            }
          }
          else if (i == 2) {
            row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
          }
          else {
            row.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          }
        }

        if (index == data.length - 2 && value == 521) {
          worksheet.mergeCells(`A${6 + data.length - 2}:D${6 + data.length - 2}`);
          row.font = { name: 'Times New Roman', size: 11, bold: true, color: { argb: 'FF0000' } };
        }
        if (index == data.length - 3 && value == 521) {
          worksheet.mergeCells(`A${6 + data.length - 3}:D${6 + data.length - 3}`);
          row.font = { name: 'Times New Roman', size: 11, bold: true, color: { argb: 'FF0000' } };
        }

        if (index == data.length - 1) {
          if (value == 3) worksheet.mergeCells(`A${6 + data.length - 1}:E${6 + data.length - 1}`);
          if (value == 521) worksheet.mergeCells(`A${6 + data.length - 1}:D${6 + data.length - 1}`);
          if (value == 4) worksheet.mergeCells(`A${6 + data.length - 1}:G${6 + data.length - 1}`);
          row.font = { name: 'Times New Roman', size: 11, bold: true, color: { argb: 'FF0000' } };
        }
      });

      /* set width */
      worksheet.getColumn(1).width = 5;
      worksheet.getColumn(2).width = 10;
      worksheet.getColumn(3).width = 25;
      worksheet.getColumn(4).width = 15;
      worksheet.getColumn(5).width = 15;
      if (value == 4) {
        worksheet.getColumn(5).width = 20;
        worksheet.getColumn(6).width = 15;
        worksheet.getColumn(7).width = 15;
      }

    }
  }

  setBorderHeaderBaoCaoCoTimeSheet(result, soCotCungBatDau, worksheet) {
    /* header */
    let header1 = [];
    result.listDataHeader[0].forEach(item => {
      if (item.columnKey.includes('index_ngay')) {
        for (let i = 1; i <= 2; i++) {
          if (i == 1) {
            header1.push(item.columnValue);
          }
          else {
            header1.push('');
          }
        }
      }
      else {
        header1.push(item.columnValue);
      }
    });

    let header2 = [];
    for (let i = 0; i < soCotCungBatDau; i++) {
      header2.push("");
    }
    result.listDataHeader[1].forEach(item => {
      for (let i = 1; i <= 1; i++) {
        if (i == 1) {
          header2.push(item.columnValue);
        }
        else {
          header2.push('');
        }
      }
    });

    let headerRow1 = worksheet.addRow(header1);
    let headerRow2 = worksheet.addRow(header2);

    headerRow1.height = 20;
    headerRow1.font = { size: 10, bold: true };

    let isEnđynamicCol = false;
    for (let i = 1; i <= header1.length; i++) {
      if (i <= soCotCungBatDau) {
        headerRow1.getCell(i).worksheet.mergeCells(
          `${headerRow1.getCell(i).$col$row}:${headerRow2.getCell(i).$col$row}`
        );
      }
      else {
        if (header1[i - 1] == 'Ngày lv thực tế' || header1[i - 1] == "Tổng số ngày nghỉ đột xuất" || header1[i - 1] == "Số phút đi muộn trong tháng") isEnđynamicCol = true;
        if (header1[i - 1] != '' && !isEnđynamicCol) {
          headerRow1.getCell(i).worksheet.mergeCells(
            `${headerRow1.getCell(i).$col$row}:${headerRow1.getCell(i + 1).$col$row}`
          );
        }
        if (isEnđynamicCol) {
          worksheet.getColumn(i).width = 15;
          headerRow1.getCell(i).worksheet.mergeCells(
            `${headerRow1.getCell(i).$col$row}:${headerRow2.getCell(i).$col$row}`
          );
        }
      }
    }

    headerRow2.height = 20;
    headerRow2.font = { size: 10, bold: true };

    header1.forEach((item, index) => {
      headerRow1.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow1.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      headerRow1.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8DB4E2' }
      };
    });

    header2.forEach((item, index) => {
      headerRow2.getCell(index + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow2.getCell(index + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      headerRow2.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8DB4E2' }
      };
    });
  }

  getNgay(data: string) {
    let result = '';
    let index = data.indexOf('-');

    if (index != -1) {
      result = data.slice(0, index).trim();
    }
    else {
      result = data;
    }

    return result;
  }

  //Chỉnh bordor và thuộc tính của từng cột của dòng
  setBorderTungDong10(data, worksheet, dataHeaderRow1) {
    //merge cột sau các cột động
    worksheet.mergeCells(1, this.soLuongColDong, 2, this.soLuongColDong);

    worksheet.mergeCells(1, this.soLuongColDong + 1, 2, this.soLuongColDong + 1);

    worksheet.mergeCells(1, this.soLuongColDong + 2, 2, this.soLuongColDong + 2);

    worksheet.mergeCells(1, this.soLuongColDong + 3, 2, this.soLuongColDong + 3);

    worksheet.mergeCells(1, this.soLuongColDong + 4, 2, this.soLuongColDong + 4);

    worksheet.mergeCells(1, this.soLuongColDong + 5, 1, this.soLuongColDong + 5 + 7);

    worksheet.mergeCells(1, this.soLuongColDong + 13, 1, this.soLuongColDong + 13 + 3);

    worksheet.mergeCells(1, this.soLuongColDong + 17, 2, this.soLuongColDong + 17);

    worksheet.mergeCells(1, this.soLuongColDong + 18, 2, this.soLuongColDong + 18);

    worksheet.mergeCells(1, this.soLuongColDong + 19, 2, this.soLuongColDong + 19);

    worksheet.mergeCells(1, this.soLuongColDong + 20, 2, this.soLuongColDong + 20);

    worksheet.mergeCells(1, this.soLuongColDong + 21, 2, this.soLuongColDong + 21);

    worksheet.mergeCells(1, this.soLuongColDong + 22, 2, this.soLuongColDong + 22 + 2);

    worksheet.mergeCells(1, this.soLuongColDong + 25, 2, this.soLuongColDong + 25);

    worksheet.mergeCells(1, this.soLuongColDong + 26, 2, this.soLuongColDong + 26);

    worksheet.mergeCells(1, this.soLuongColDong + 27, 2, this.soLuongColDong + 27);

    worksheet.mergeCells(1, this.soLuongColDong + 28, 1, this.soLuongColDong + 28 + 2);

    worksheet.mergeCells(1, this.soLuongColDong + 31, 1, this.soLuongColDong + 31 + 2);

    worksheet.mergeCells(1, this.soLuongColDong + 34, 1, this.soLuongColDong + 34 + 2);

    worksheet.mergeCells(1, this.soLuongColDong + 37, 2, this.soLuongColDong + 37);

    worksheet.mergeCells(1, this.soLuongColDong + 38, 1, this.soLuongColDong + 38 + 2);

    worksheet.mergeCells(1, this.soLuongColDong + 41, 1, this.soLuongColDong + 41 + 2);

    worksheet.mergeCells(1, this.soLuongColDong + 44, 1, this.soLuongColDong + 44 + 2);

    worksheet.mergeCells(1, this.soLuongColDong + 47, 2, this.soLuongColDong + 47);

    worksheet.mergeCells(1, this.soLuongColDong + 48, 1, this.soLuongColDong + 48 + 2);

    worksheet.mergeCells(1, this.soLuongColDong + 51, 1, this.soLuongColDong + 51 + 3);

    worksheet.mergeCells(1, this.soLuongColDong + 55, 1, this.soLuongColDong + 55 + 3);

    worksheet.mergeCells(1, this.soLuongColDong + 59, 2, this.soLuongColDong + 59);

    worksheet.mergeCells(1, this.soLuongColDong + 60, 2, this.soLuongColDong + 60);

    worksheet.mergeCells(1, this.soLuongColDong + 61, 2, this.soLuongColDong + 61);

    worksheet.mergeCells(1, this.soLuongColDong + 62, 2, this.soLuongColDong + 62);

    worksheet.mergeCells(1, this.soLuongColDong + 63, 2, this.soLuongColDong + 63);

    worksheet.mergeCells(1, this.soLuongColDong + 64, 2, this.soLuongColDong + 64);

    data.forEach((el, index, array) => {

      let row = worksheet.addRow(el);
      //Chỉnh bordor và thuộc tính của từng cột của dònG

      dataHeaderRow1.forEach((col, colIndex) => {
        row.font = { name: 'Times New Roman', size: 11 };
        row.getCell(colIndex + 1).border = { left: { style: "thin" }, top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        row.getCell(colIndex + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        //them format cho cac cot tinh
        row.getCell(2).numFmt = '[$-en-US]mmm/yy;@';
        row.getCell(4).numFmt = '0.00';
        row.getCell(7).numFmt = '[$-en-US]mmm/yy;@';
        row.getCell(10).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        row.getCell(11).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        row.getCell(12).numFmt = 'dd/mm/yy';
        row.getCell(13).numFmt = 'dd/mm/yy';
        row.getCell(14).numFmt = 'dd/mm/yy';
        row.getCell(15).numFmt = 'dd/mm/yy';

        for (let i = 21; i <= 30; i++) {

          row.getCell(i).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
        }

        row.getCell(31).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        row.getCell(32).numFmt = '0.0%';

        for (let i = 33; i <= 39; i++) {
          row.getCell(i).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        }

        //them format cot dong
        for (let i = 40; i <= this.soLuongColDong; i++) {
          row.getCell(i).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        }

        for (let i = this.soLuongColDong; i <= this.soLuongColDong + 20; i++) {
          row.getCell(i).numFmt = '_(* #,##0.0_);_(* (#,##0.0);_(* "-"??_);_(@_)';
        }

        row.getCell(this.soLuongColDong + 21).numFmt = '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)';
        row.getCell(this.soLuongColDong + 22).numFmt = '#,##0';
        row.getCell(this.soLuongColDong + 23).numFmt = '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)';

        for (let i = this.soLuongColDong + 24; i <= this.soLuongColDong + 24 + 37; i++) {
          row.getCell(i).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        }

        row.getCell(this.soLuongColDong + 24 + 37 + 1).numFmt = '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)';
        row.getCell(this.soLuongColDong + 24 + 37 + 2).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';
        row.getCell(this.soLuongColDong + 24 + 37 + 3).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)';

        //them cong thuc
        let excelColumn1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let excelColumn2 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let excelColumn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        debugger
        excelColumn1.forEach((e, index) => {
          if (index < 4) {
            excelColumn2.forEach((ee, i) => {
              let mer = e + ee
              excelColumn.push(mer)
            })
          }
        })

        // công thức cho cột tĩnh
        row.getCell(11).value = { formula: `AG${row.number}*J${row.number}/12`, date1904: false };
        row.getCell(30).value = { formula: `=U${row.number}+W${row.number}+X${row.number}+Y${row.number}-AB${row.number}`, date1904: false };
        row.getCell(31).value = { formula: `=+AG${row.number}*85%`, date1904: false };
        row.getCell(32).value = { formula: `=(AG${row.number}-AE${row.number})/AE${row.number}`, date1904: false };
        row.getCell(34).value = { formula: `=AG${row.number}-AE${row.number}`, date1904: false };
        // row.getCell(36).value = { formula: `=IF(V${row.number}=0,AG${row.number}/$AD$7*AD${row.number},AE${row.number}/$AD$7*V${row.number}+AG${row.number}/$AD$7*(AD${row.number}-V${row.number}))`, date1904: false };
        row.getCell(39).value = { formula: `=SUM(AK${row.number}:AL${row.number})`, date1904: false };

        //công thức cho cột động
        let bienTam = ''
        if (this.countOTHERALLOWANCE > 1) {
          row.getCell(39 + this.countOTHERALLOWANCE).value = {
            formula: `=SUM(${excelColumn[39]}${row.number}:${excelColumn[39 + this.countOTHERALLOWANCE - 2]}${row.number})`, date1904: false
          };
        } else {
          row.getCell(39 + this.countOTHERALLOWANCE).value = 0
        }
        if (this.countOTHERBONUS > 1) {
          row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS).value = {
            formula: `=SUM(${excelColumn[39 + this.countOTHERALLOWANCE]}${row.number}:${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS - 2]}${row.number})`, date1904: false
          };
        } else {
          row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS).value = 0
        }

        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 1).value = {
          formula: `=${excelColumn[39 + this.countOTHERALLOWANCE - 2 + 1]}${row.number}+AM${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS - 1]}${row.number}`, date1904: false
        };

        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 4).value = {
          formula: `=${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 1 - 1]}${row.number}+AJ${row.number}+AI${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 1 - 1 + 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 1 - 1 + 2]}${row.number}`, date1904: false
        };

        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 5).value = {
          formula: `=IF(${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 4 - 1]}${row.number}-AL${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 1 - 1 + 1]}${row.number}>0,${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 4 - 1]}${row.number}-AL${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 1 - 1 + 1]}${row.number},0)`, date1904: false
        };

        //OTHER DEDUCTION BEFORE TAX (TAX EXAMPTION)
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 6).value = {
          formula: `=+SUMIFS(GTGC!$E:$E,GTGC!$B:$B,B${row.number})`, date1904: false
        };

        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 7).value = {
          formula: `=IF(${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 6 - 1]}${row.number}>=1,1,0)`, date1904: false
        };

        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 8).value = {
          formula: `=IF(${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 6 - 1]}${row.number}>=1,12-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 7 - 1]}${row.number}+1,0)`, date1904: false
        };

        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 9).value = {
          formula: `=IF(${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 5 - 1]}${row.number}>0,${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 6 - 1]}${row.number}*$BH$7,0)`, date1904: false
        };

        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 10).value = {
          formula: `=IF(S${row.number}="HĐLĐ",$BI$7,0)`, date1904: false
        };

        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 11).value = {
          formula: `=${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 9 - 1]}${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 10 - 1]}${row.number}`, date1904: false
        };
        //Cột 62 chưa có công thức

        // cột 68
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 18).value = {
          formula: `=IF(${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 5 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 11 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 12 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 13 - 1]}${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 14 - 1]}${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 17 - 1]}${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 15 - 1]}${row.number}>0,${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 5 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 11 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 12 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 13 - 1]}${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 14 - 1]}${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 17 - 1]}${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 15 - 1]}${row.number},0)`, date1904: false
        };

        // cột 69
        bienTam = `${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 18 - 1]}${row.number}`
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 19).value = {
          formula: `=IF(${bienTam}>0,IF(${bienTam}<=0,0,IF(AND(${bienTam}>0,${bienTam}<=5000000),${bienTam}*0.05,IF(AND(${bienTam}>5000000,${bienTam}<=10000000),${bienTam}*0.1-250000,IF(AND(${bienTam}>10000000,${bienTam}<=18000000),${bienTam}*0.15-750000,IF(AND(${bienTam}>18000000,${bienTam}<=32000000),${bienTam}*0.2-1650000,IF(AND(${bienTam}>32000000,${bienTam}<=52000000),${bienTam}*0.25-3250000,IF(AND(${bienTam}>52000000,${bienTam}<=80000000),${bienTam}*0.3-5850000,${bienTam}*0.35-9850000))))))),IF(${bienTam}>2000000,${bienTam}*10%,0))`, date1904: false
        };

        // cột 70
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 20).value = {
          formula: `=${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 18 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 16]}${row.number}`, date1904: false
        };

        // cột 71
        bienTam = `${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 20 - 1]}${row.number}`
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 21).value = {
          formula: `=IF(${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 10 - 1]}${row.number}>0,IF(${bienTam}<=0,0,IF(AND(${bienTam}>0,${bienTam}<=5000000),${bienTam}*0.05,IF(AND(${bienTam}>5000000,${bienTam}<=10000000),${bienTam}*0.1-250000,IF(AND(${bienTam}>10000000,${bienTam}<=18000000),${bienTam}*0.15-750000,IF(AND(${bienTam}>18000000,${bienTam}<=32000000),${bienTam}*0.2-1650000,IF(AND(${bienTam}>32000000,${bienTam}<=52000000),${bienTam}*0.25-3250000,IF(AND(${bienTam}>52000000,${bienTam}<=80000000),${bienTam}*0.3-5850000,${bienTam}*0.35-9850000))))))),IF(${bienTam}>2000000,${bienTam}*10%,0))`, date1904: false
        };

        // cột 72
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 22).value = {
          formula: `=${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 19 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 21 - 1]}${row.number}`, date1904: false
        };

        //cột 76
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 26).value = {
          formula: `=${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 21 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 23 - 1]}${row.number}- ${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 25 - 1]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 24 - 1]}${row.number}`, date1904: false
        };

        // cột 77: =IF(S9="HĐLĐ",IF((+Z9+AA9+AB9)<=14,IF(AG9>$BZ$7*20,$BZ$7*20,AG9),0),0)
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 27).value = {
          formula: `=IF(S${row.number}="HĐLĐ",IF((+Z${row.number}+AA${row.number}+AB${row.number})<=14,IF(AG${row.number}>$BZ$7*20,$BZ$7*20,AG${row.number}),0),0)`
        };

        // cột 78: =IF(S8="HĐLĐ",IF((Z8+AA8+AB8)<=14,IF(AG8>$CA$7*20,$CA$7*20,AG8)),0)
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 28).value = {

        };

        // cột 80: =IF(S8="HĐLĐ",IF((Z8+AA8+AB8)<=14,IF(AG8>$CA$7*20,$CA$7*20,AG8)),0)
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 30).value = {

        };

        // cột 81: =IF(S8="HĐLĐ",IF((Z8+AA8+AB8)<=14,IF(AG8>$CA$7*20,$CA$7*20,AG8)),0)
        row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 31).value = {

        };






        //=IF(S8="HĐLĐ",IF((+Z8+AA8+AB8)<=14,IF(AG8>$BZ$7*20,$BZ$7*20,AG8),0),0)
        //=IF(BC8-AL8-BA8>0,BC8-AL8-BA8,0)
        // row.getCell(39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 4).value = { formula: `=${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 1]}${row.number} +AJ${row.number}+AI${row.number}+${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 2]}${row.number}-${excelColumn[39 + this.countOTHERALLOWANCE + this.countOTHERBONUS + 3]}${row.number}`, date1904: false };

        // row.getCell(39).value = { formula: `=SUM(AK${row.number}:AL${row.number})`, date1904: false };

        // row.getCell(39).value = { formula: `=SUM(AK${row.number}:AL${row.number})`, date1904: false };

      })
    });

  }

}
