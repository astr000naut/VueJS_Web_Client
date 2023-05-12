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
  constructor(empFromApi) {
    this.address = empFromApi.Address ?? "";
    this.dateOfBirth = empFromApi.DateOfBirth
      ? $formatter.changeFormat(empFromApi.DateOfBirth)
      : "";
    this.departmentCode = empFromApi.DepartmentCode ?? "";
    this.departmentId = empFromApi.DepartmentId ?? "";
    this.departmentName = empFromApi.DepartmentName ?? "";
    this.email = empFromApi.Email ?? "";
    this.employeeCode = empFromApi.EmployeeCode ?? "";
    this.employeeId = empFromApi.EmployeeId ?? "";
    this.fullName = empFromApi.FullName ?? "";
    this.gender = empFromApi.Gender ?? -1;
    this.genderName = empFromApi.GenderName ?? "";
    this.identityDate = empFromApi.identityDate
      ? $formatter.changeFormat(empFromApi.IdentityDate)
      : "";
    this.identityNumber = empFromApi.IdentityNumber ?? "";
    this.identityPlace = empFromApi.IdentityPlace ?? "";
    this.phoneNumber = empFromApi.PhoneNumber ?? "";
    this.landlineNumber = empFromApi.LandlineNumber ?? "";
    this.positionName = empFromApi.PositionName ?? "";
    this.positionId = empFromApi.PositionId ?? "";
    this.positionCode = empFromApi.PositionCode ?? "";
    this.bankAccount = empFromApi.BankAccount ?? "";
    this.bankName = empFromApi.BankName ?? "";
    this.bankBranch = empFromApi.BankBranch ?? "";
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
