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
  constructor() {
    this.address = "";
    this.dateOfBirth = "";
    this.departmentCode = "";
    this.departmentId = "";
    this.departmentName = "";
    this.email = "";
    this.employeeCode = "";
    this.employeeId = "";
    this.fullName = "";
    this.gender = -1;
    this.genderName = "";
    this.identityDate = "";
    this.identityNumber = "";
    this.identityPlace = "";
    this.phoneNumber = "";
    this.landlineNumber = "";
    this.positionName = "";
    this.positionId = "";
    this.positionCode = "";
    this.bankAccount = "";
    this.bankName = "";
    this.bankBranch = "";
  }

  /**
   * Gán dữ liệu từ object emp (do API trả về)
   * @param {Object} emp object em do API trả về
   *
   * Author: Dũng (11/05/2023)
   */
  syncWithDataFromApi(emp) {
    this.address = emp.Address ?? "";
    this.dateOfBirth = $formatter.changeFormat(emp.DateOfBirth);
    this.departmentCode = emp.DepartmentCode ?? "";
    this.departmentId = emp.DepartmentId ?? "";
    this.departmentName = emp.DepartmentName ?? "";
    this.email = emp.Email ?? "";
    this.employeeCode = emp.EmployeeCode ?? "";
    this.employeeId = emp.EmployeeId ?? "";
    this.fullName = emp.FullName ?? "";
    this.gender = emp.Gender ?? -1;
    this.genderName = emp.GenderName ?? "";
    this.identityDate = $formatter.changeFormat(emp.IdentityDate);
    this.identityNumber = emp.IdentityNumber ?? "";
    this.identityPlace = emp.IdentityPlace ?? "";
    this.phoneNumber = emp.PhoneNumber ?? "";
    this.landlineNumber = emp.LandlineNumber ?? "";
    this.positionName = emp.PositionName ?? "";
    this.positionId = emp.PositionId ?? "";
    this.positionCode = emp.PositionCode ?? "";
    this.bankAccount = emp.BankAccount ?? "";
    this.bankName = emp.BankName ?? "";
    this.bankBranch = emp.BankBranch ?? "";
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
