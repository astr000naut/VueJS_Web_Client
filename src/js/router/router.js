import EmployeeList from "../../components/views/employee-management/EmployeeList";
import UnderDevelopment from "../../components/views/under-development/UnderDevelopment";
import EmployeeForm from "../../components/views/employee-management/EmployeeForm";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/employee",
    components: {
      default: EmployeeList,
    },
    children: [
      {
        path: "create",
        components: {
          default: EmployeeList,
          EmployeeForm: EmployeeForm,
        },
      },
      {
        path: ":id",
        components: {
          default: EmployeeList,
          EmployeeForm: UnderDevelopment,
        },
      },
    ],
  },
  { path: "/under-development", component: UnderDevelopment },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
