const $message = {
  employeeDeleteConfirm: (code) => `Bạn có muốn xóa nhân viên <${code}>`,
  employeeDeleted: "Nhân viên đã bị xóa khỏi hệ thống",
  employeeMultipleDeleteConfirm: (amount) =>
    `Bạn có chắc chắn muốn xóa ${amount} Nhân viên`,
  employeeMultipeDeleted: (amount) => `Xóa thành công ${amount} nhân viên`,
  employeeCreated: "Thêm mới nhân viên thành công",
  employeeUpdated: "Sửa thông tin nhân viên thành công",
};
export default $message;
