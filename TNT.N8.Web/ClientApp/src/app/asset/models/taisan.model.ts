export class TaiSanModel {
  taiSanId: number;
  maTaiSan: string;
  tenTaiSan: string;
  phanLoaiTaiSanId: string;
  khuVucTaiSanId: string;
  phanLoaiTaiSan: string;
  moTa: string;
  maCode: string;
  ngayVaoSo: Date;
  ngayMua: Date;
  hienTrangTaiSan: number;
  hienTrangTaiSanString: string;
  donViTinhId: string;
  soLuong: number;
  namSX: number;
  nuocSXId: string;
  hangSXId: string;
  model: string;
  soHieu: string;
  soSerial: string;
  thoiHanBaoHanh: number;
  baoDuongDinhKy: number;
  thongTinNoiMua: string;
  thongTinNoiBaoHanh: string;
  maNV: string;
  hoVaTen: string;
  phongBan: string;
  viTriLamViec: string;
  thoiDiemBDTinhKhauHao: Date;
  giaTriNguyenGia: number;
  giaTriTinhKhauHao: number;
  phuongPhapTinhKhauHao: number;
  tiLeKhauHao: number;
  thoiGianKhauHao: number;
  nguoiSuDungId: string;
  createdById: string;
  createdDate: Date;
  updatedById: string;
  updatedDate: Date;

  viTriVanPhongId: string;
  mucDichId: string;
  viTriTs: string;

  expenseUnit: string;

  tiLeKhauHaoTheoThang: number;
  giaTriKhauHaoTheoThang: number;
  tiLeKhauHaoTheoNam: number;
  giaTriKhauHaoTheoNam: number;
  giaTriKhauHaoLuyKe: number;
  giaTriConLai: number;
  thoiGianTinhKhauHaoDen: Date;
  userConfirm: boolean;

  constructor() {
    this.taiSanId = 0;
    this.maNV = '';
    this.hoVaTen = '';
    this.viTriLamViec = '';
    this.maTaiSan = '';
    this.tenTaiSan = '';
    this.moTa = '';
    this.maCode = '';
    this.ngayVaoSo = new Date();
    this.ngayMua = new Date();
    this.hienTrangTaiSan = 0;
    this.hienTrangTaiSanString = '';
    this.donViTinhId = '00000000-0000-0000-0000-000000000000';
    this.phanLoaiTaiSanId = '00000000-0000-0000-0000-000000000000';
    this.phanLoaiTaiSan = '';
    this.soLuong = 0;
    this.namSX = 0;
    this.hangSXId = '00000000-0000-0000-0000-000000000000';
    this.khuVucTaiSanId = '00000000-0000-0000-0000-000000000000';
    this.nuocSXId = '00000000-0000-0000-0000-000000000000';
    this.model = '';
    this.soHieu = '';
    this.soSerial = '';
    this.thoiHanBaoHanh = 0;
    this.thongTinNoiMua = '';
    this.thongTinNoiBaoHanh = '';
    this.thoiDiemBDTinhKhauHao = new Date();
    this.createdById = '00000000-0000-0000-0000-000000000000';
    this.tiLeKhauHao = 0;
    this.giaTriNguyenGia = 0;
    this.giaTriTinhKhauHao = 0;
    this.phuongPhapTinhKhauHao = 0;
    this.tiLeKhauHao = 0;
    this.thoiGianKhauHao = 0;
    this.createdDate = new Date();
    this.updatedById = null;
    this.updatedDate = null;

    this.userConfirm = false;

    this.viTriVanPhongId = '00000000-0000-0000-0000-000000000000';
    this.mucDichId = '00000000-0000-0000-0000-000000000000';
    this.expenseUnit = '';
    this.viTriTs = '';
  }
}