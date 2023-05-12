import $formatter from "../common/formater";
export class Employee {
  address;
  dateOfBirth;
  departmentCode;
  departmentId;
  departmentName;
  email;
  employeeCode;
  employeeId;
  fullName;
  gender;
  genderName;
  identityDate;
  identityNumber;
  identityPlace;
  phoneNumber;
  landlineNumber;
  positionName;
  positionId;
  positionCode;
  bankAccount;
  bankName;
  bankBranch;

  /**
   * Hàm khởi tạo cho Employee
   *
   * Author: Dũng (11/05/2023)
   */
  constructor(e) {
    this.address = e.Address ?? "";
    this.dateOfBirth = e.DateOfBirth
      ? $formatter.changeFormat(e.DateOfBirth)
      : "";
    this.departmentCode = e.DepartmentCode ?? "";
    this.departmentId = e.DepartmentId ?? "";
    this.departmentName = e.DepartmentName ?? "";
    this.email = e.Email ?? "";
    this.employeeCode = e.EmployeeCode ?? "";
    this.employeeId = e.EmployeeId ?? "";
    this.fullName = e.FullName ?? "";
    this.gender = e.Gender ?? -1;
    this.genderName = e.GenderName ?? "";
    this.identityDate = e.identityDate
      ? $formatter.changeFormat(e.IdentityDate)
      : "";
    this.identityNumber = e.IdentityNumber ?? "";
    this.identityPlace = e.IdentityPlace ?? "";
    this.phoneNumber = e.PhoneNumber ?? "";
    this.landlineNumber = e.LandlineNumber ?? "";
    this.positionName = e.PositionName ?? "";
    this.positionId = e.PositionId ?? "";
    this.positionCode = e.PositionCode ?? "";
    this.bankAccount = e.BankAccount ?? "";
    this.bankName = e.BankName ?? "";
    this.bankBranch = e.BankBranch ?? "";
  }

  /**
   * Trả về Object với định dạng là Body của request
   * @param {Boolean} isEditApi là api sửa thông tin nhân viên hay không
   *
   * Author: Dũng (11/05/2023)
   */
  convertToApiFormat(isEditApi) {
    let obj = {
      employeeCode: this.employeeCode,
      fullName: this.fullName,
      departmentId: this.departmentId,
      departmentName: this.departmentName,
      positionName: this.positionName,
      dateOfBirth: $formatter.formatDateToApiDate(this.dateOfBirth),
      gender: this.gender,
      identityNumber: this.identityNumber,
      identityDate: $formatter.formatDateToApiDate(this.identityDate),
      identityPlace: this.identityPlace,
      address: this.address,
      phoneNumber: this.phoneNumber,
      email: this.email,
    };
    // Nếu là api sửa thông tin nhân viên thì thêm trường employeeId
    if (isEditApi) {
      obj["employeeId"] = this.employeeId;
    }
    return obj;
  }
}
