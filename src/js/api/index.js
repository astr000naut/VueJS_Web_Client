import employeeApi from "./employee";
import departmentApi from "./department";
const baseUrl = "";
const api = {
  employee: employeeApi(baseUrl),
  department: departmentApi(baseUrl),
};
console.log(api.employee.index);
export default api;
