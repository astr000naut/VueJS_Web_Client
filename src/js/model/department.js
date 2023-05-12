export class Department {
  departmentCode;
  departmentId;
  departmentName;

  /**
   * Hàm khởi tạo cho Department
   *
   * Author: Dũng (12/05/2023)
   */
  constructor() {
    this.departmentCode = "";
    this.departmentId = "";
    this.departmentName = "";
  }

  /**
   * Gán dữ liệu từ object department (do API trả về)
   * @param {Object} department object department do API trả về
   *
   * Author: Dũng (12/05/2023)
   */
  syncWithDataFromApi(department) {
    this.departmentCode = department.DepartmentCode;
    this.departmentId = department.DepartmentId;
    this.departmentName = department.DepartmentName;
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
