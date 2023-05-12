export class Department {
  departmentCode;
  departmentId;
  departmentName;

  /**
   * Hàm khởi tạo cho Department
   *
   * Author: Dũng (12/05/2023)
   */
  constructor(departmentFromApi) {
    this.departmentCode = departmentFromApi.DepartmentCode;
    this.departmentId = departmentFromApi.DepartmentId;
    this.departmentName = departmentFromApi.DepartmentName;
  }

  /**
   * Trả về Object với định dạng là Body của request
   *
   * Author: Dũng (12/05/2023)
   */
  convertToApiFormat() {
    let obj = {};
    return obj;
  }
}
