import EmployeeList from "../../components/views/employee-management/EmployeeList";
import UnderDevelopment from "../../components/views/under-development/UnderDevelopment";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/employee", component: EmployeeList },
  { path: "/under-development", component: UnderDevelopment },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
