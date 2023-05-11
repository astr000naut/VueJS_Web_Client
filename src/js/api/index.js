import employeeApi from "./employee";
import departmentApi from "./department";
const baseUrl = "https://cukcuk.manhnv.net/api/v1";
const $api = {
  employee: employeeApi(baseUrl),
  department: departmentApi(baseUrl),
};
export default $api;
