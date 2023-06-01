const $error = {
  // Validation error
  fieldCannotEmpty: (name) => `${name} không được để trống`,
  fieldTooLong: (name, limit) => `${name} không quá ${limit} ký tự`,
  fieldWrongFormat: (name) => `Sai định dạng ${name}`,
  fieldNotValid: (name) => `${name} không hợp lệ`,

  employeeCodeHasExist: "Mã nhân viên đã tồn tại",

  departmentNotInList: "Vui lòng chọn Đơn vị có trong danh mục",

  // API response
  invalidInput: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại",
  serverDisconnected:
    "Xảy ra lỗi khi kết nối tới server, vui lòng liên hệ nhân viên hỗ trợ",
};
export default $error;
