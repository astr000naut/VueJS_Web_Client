import GeneralPage from "../../components/views/general/GeneralPage";
import EmployeeList from "../../components/views/employee-management/EmployeeList";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: EmployeeList },
  { path: "/general", component: GeneralPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
