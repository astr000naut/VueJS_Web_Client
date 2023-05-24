import employeeApi from "./employee";
import departmentApi from "./department";
const baseUrl = "https://localhost:44381/api/v1";
const $api = {
  employee: employeeApi(baseUrl),
  department: departmentApi(baseUrl),
};
export default $api;
