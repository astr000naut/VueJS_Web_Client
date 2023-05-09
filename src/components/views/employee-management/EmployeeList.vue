<template>
  <div class="page__wrapper" v-show="isLoadingPage">
    <BaseLoader />
  </div>
  <div class="page__wrapper" v-show="dialog.isDisplay">
    <BaseDialog
      title="Xác nhận xóa nhân viên"
      :message="dialog.message"
      :close-on-click="dialogCloseOnClick"
      :no-on-click="dialogCloseOnClick"
      :yes-on-click="deleteEmployee"
    />
  </div>
  <router-view
    name="EmployeeForm"
    @update-emplist="empListOnUpdate"
  ></router-view>
  <div class="pcontent">
    <BaseToast class="toast__position" v-show="false" />
    <div class="pcontent__heading">
      <div class="pcontent__title">Nhân viên</div>
      <BaseButton
        bname="Thêm mới nhân viên"
        class="btn--primary"
        @click="btnAddOnClick"
      />
    </div>
    <div class="pcontent__container">
      <div class="pcontent__searchbar">
        <BaseTextfield
          pholder="Tìm kiếm nhân viên"
          class="txtfield--search mw-300"
          noti=""
          v-model:text="cache.empSearchPattern"
          :realTimeSearch="true"
          :doSearch="loadEmployeeData"
        />
        <BaseButton class="mi mi-36 mi-refresh" @click="btnRefreshOnClick" />
        <div class="button__hoverbox">
          <div class="hover__arrow"></div>
          <div class="hover__text">Tải lại dữ liệu</div>
        </div>
      </div>
      <EmployeeTable
        :is-loading-data="isLoadingData"
        :emp-list="empList"
        :key="tableKey"
        :delete-employee-function="deleteEmployeeOnClick"
        v-model:pagingData="pagingData"
        :paging-next-page="pagingNextPage"
        :paging-prev-page="pagingPrevPage"
        @update-paging-data="pagingDataOnUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import EmployeeTable from "@/components/views/employee-management/EmployeeTable.vue";
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseToast from "@/components/base/BaseToast.vue";
import $enum from "@/js/common/enum";

const router = useRouter();
const $emitter = inject("$emitter");
const empList = ref([]);
const isLoadingData = ref(true);
const isLoadingPage = ref(false);
const $axios = inject("$axios");
const tableKey = ref(0);
const pagingData = ref({
  totalRecord: 0,
  curAmount: 0,
  pageSize: 20,
  pageNumber: 1,
});
const dialog = ref({
  isDisplay: false,
  message: "",
});
const cache = ref({
  empDeleteId: "",
  empDeleteIndex: "",
  empSearchPattern: "",
});
/**
 * Sự kiện click vào nút đóng dialog
 *
 * Author: Dũng (08/05/2023)
 */
function dialogCloseOnClick() {
  dialog.value.isDisplay = false;
}

/**
 * Hiển thị cảnh báo xóa nhân viên
 * @param {String} empCode mã nhân viên
 *
 * Author: Dũng (08/05/2023)
 */
function showDeleteConfirmDialog(empCode) {
  dialog.value.message = `Bạn có muốn xóa Nhân viên <${empCode}>`;
  dialog.value.isDisplay = true;
}

/**
 * Gọi API xóa nhân viên
 * Author: Dũng (08/05/2023)
 */
async function deleteEmployee() {
  try {
    dialog.value.isDisplay = false;
    isLoadingPage.value = true;
    await $axios.delete($enum.api.employees.one(cache.value.empDeleteId));
    empList.value.splice(cache.value.empDeleteIndex, 1);
    // Update pagingData
    pagingData.value.curAmount -= 1;
    pagingData.value.totalRecord -= 1;
    isLoadingPage.value = false;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Sự kiện click vào nút xóa nhân viên
 * @param {String} empId Id nhân viên
 *
 * Author: Dũng (08/05/2023)
 */
function deleteEmployeeOnClick(empId) {
  let empCode = "";
  cache.value.empDeleteId = empId;
  for (let index in empList.value) {
    if (empList.value[index].EmployeeId == empId) {
      cache.value.empDeleteIndex = index;
      break;
    }
  }
  empCode = empList.value[cache.value.empDeleteIndex].EmployeeCode;
  showDeleteConfirmDialog(empCode);
}

/**
 * Sự kiện cập nhật trạng thái của object pagingData
 * @param {Object} newData giá trị mới
 *
 * Author: Dũng (08/05/2023)
 */
async function pagingDataOnUpdate(newData) {
  pagingData.value = newData;
  await loadEmployeeData();
}

/**
 * Chuyển sang trang paging kế tiếp
 *
 * Author: Dũng (08/05/2023)
 */
async function pagingNextPage() {
  pagingData.value.pageNumber += 1;
  await loadEmployeeData();
  // console.log("n next");
}

/**
 * Chuyển sang trang paging trước đó
 *
 * Author: Dũng (08/05/2023)
 */
async function pagingPrevPage() {
  pagingData.value.pageNumber -= 1;
  await loadEmployeeData();
  // console.log("p prev");
}

/**
 * Gọi API lấy dữ liệu nhân viên theo filter
 * Author: Dũng (08/05/2023)
 */
async function loadEmployeeData() {
  try {
    isLoadingData.value = true;
    const response = await $axios.get($enum.api.employees.filter, {
      params: {
        pageSize: pagingData.value.pageSize,
        pageNumber: pagingData.value.pageNumber,
        employeeFilter: cache.value.empSearchPattern,
      },
    });
    if (response.data.Data) {
      empList.value = response.data.Data;
      // pagingData.value.pageNumber = response.data.CurrentPage;
      pagingData.value.curAmount = response.data.CurrentPageRecords;
      pagingData.value.totalRecord = response.data.TotalRecord;
    } else {
      empList.value = [];
      pagingData.value.curAmount = 0;
      pagingData.value.totalRecord = 0;
    }
    isLoadingData.value = false;
    // console.log(pagingData.value);
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await loadEmployeeData();
  $emitter.on("rerenderTable", () => {
    tableKey.value += 1;
    if (tableKey.value > 100) {
      tableKey.value = 0;
    }
  });
});

onBeforeUnmount(() => {
  $emitter.off("rerenderTable");
});

/**
 * Sự kiện cập nhật mảng empList
 * @param {String} type kiểu update (thêm hay sửa)
 * @param {Object} data dữ liệu của employee mới
 * Author: Dũng (08/05/2023)
 */
async function empListOnUpdate(type, data) {
  console.log(type);
  console.log(data);
  // empList.value.unshift(data);
  // await loadData();
  if (type == "create") {
    pagingData.value.totalRecord += 1;
  }
  await loadEmployeeData();
}
/**
 * Sự kiện click vào nút thêm
 * Author: Dũng (08/05/2023)
 */
function btnAddOnClick() {
  router.replace("/employee/create");
}
/**
 * Sự kiện click vào nút refresh
 * Author: Dũng (08/05/2023)
 */
async function btnRefreshOnClick() {
  // await loadData();
  await loadEmployeeData();
}
</script>

<style scoped>
.pcontent {
  flex: 1;
  height: calc(100vh - 56px);
  min-width: 800px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Heading */

.pcontent__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.pcontent__title {
  flex-shrink: 0;
  font-size: var(--fs-head1);
  font-weight: 700;
  line-height: var(--lh-head1);
}

/* Container */

.pcontent__container {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 200px;
  overflow: hidden;
  margin-top: 24px;
  background-color: #fff;
  padding: 24px 24px 12px 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Search bar */
.pcontent__searchbar {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  column-gap: 24px;
  overflow: hidden;
  align-items: center;
}
.button__hoverbox {
  display: none;
  z-index: 20;
  position: absolute;
  top: 0px;
  right: 0px;
}

.hover__text {
  padding: 4px 8px;
  background-color: #393a3d;
  color: #fff;
  border-radius: 4px;
}
.hover__arrow {
  width: 10px;
  height: 10px;
  background-color: #393a3d;
  position: absolute;
  bottom: -9px;
  right: 42%;
  transform: translateY(-50%) rotate(45deg);
}

.mi-refresh:hover + .button__hoverbox {
  display: block;
}

.page__wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000045;
  z-index: 99;
}

.toast__position {
  position: absolute;
  top: 10px;
  left: 30vw;
  z-index: 20;
}
</style>
