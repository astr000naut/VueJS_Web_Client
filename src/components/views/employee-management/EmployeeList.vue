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
      :yes-on-click="dialog.action"
    />
  </div>
  <router-view
    name="EmployeeForm"
    @update-emplist="empListOnUpdate"
  ></router-view>
  <div class="pcontent">
    <BaseToastbox
      class="toastbox__position"
      :toast-list="toastList"
      :remove-toast="removeToast"
    />
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
        <div class="searchbar__left">
          <BaseButton
            bname="Thực hiện hàng loạt"
            class="btn--secondary"
            @click="batchBtnOnClick"
            v-show="selectedEmpIds.length > 1"
          />
          <div
            class="left__option"
            v-show="batchOperator.showMenu"
            @mouseleave="batchMenuOnMouseLeave"
          >
            <div class="option__item" @click="batchDeleteBtnOnClick">Xóa</div>
            <div class="option__item">Gộp</div>
          </div>
        </div>
        <div class="searchbar__right">
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
      </div>
      <EmployeeTable
        :is-loading-data="isLoadingData"
        :emp-list="empList"
        :key="tableKey"
        :delete-employee-function="deleteEmployeeOnClick"
        :selected-emp-ids="selectedEmpIds"
        v-model:pagingData="pagingData"
        :paging-next-page="pagingNextPage"
        :paging-prev-page="pagingPrevPage"
        @update-paging-data="pagingDataOnUpdate"
        @update-emp-status="empStatusOnUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import EmployeeTable from "@/components/views/employee-management/EmployeeTable.vue";
// import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseToastbox from "@/components/base/BaseToastbox.vue";
import $enum from "@/js/common/enum";

// const router = useRouter();
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
  action: null,
});
const cache = ref({
  empDeleteId: "",
  empDeleteIndex: "",
  empSearchPattern: "",
});
const batchOperator = ref({
  showMenu: false,
});
const selectedEmpIds = ref([]);

const toastList = ref([]);
var toastId = 0;

function pushToast(toast) {
  toastList.value.push({
    id: toast.id,
    type: toast.type,
    title: toast.title,
    message: toast.message,
  });
  if (toast.timeToLive != -1) {
    setToastTimeToLive(toast.id, toast.timeToLive);
  }
}

function removeToast(id) {
  let i = 0;
  while (i < toastList.value.length) {
    if (toastList.value[i].id == id) {
      toastList.value.splice(i, 1);
      break;
    }
    ++i;
  }
}

function setToastTimeToLive(id, timeToLive) {
  setTimeout(() => {
    let i = 0;
    while (i < toastList.value.length) {
      if (toastList.value[i].id == id) {
        toastList.value.splice(i, 1);
        break;
      }
      ++i;
    }
  }, timeToLive);
}

function batchDeleteBtnOnClick() {
  showBatchDeleteConfirmDialog();
}

function batchMenuOnMouseLeave() {
  batchOperator.value.showMenu = false;
}

function batchBtnOnClick() {
  batchOperator.value.showMenu = !batchOperator.value.showMenu;
}

function empStatusOnUpdate(data) {
  const { type, empIndex } = data;
  if (type == "toggleAll") {
    if (selectedEmpIds.value.length == 0) {
      for (const emp of empList.value) {
        emp.selected = true;
        emp.active = true;
        selectedEmpIds.value.push(emp.EmployeeId);
      }
    } else {
      for (const emp of empList.value) {
        emp.selected = false;
        emp.active = false;
        selectedEmpIds.value = [];
      }
    }
  }

  if (type == "selected") {
    // Toggle selected class
    empList.value[empIndex].selected = !empList.value[empIndex].selected;

    // Nếu selected true thì thêm vào selectedEmpIds và bật active
    if (empList.value[empIndex].selected) {
      selectedEmpIds.value.push(empList.value[empIndex].EmployeeId);
      empList.value[empIndex].active = true;
      for (const emp of empList.value) {
        if (
          emp.EmployeeId != empList.value[empIndex].EmployeeId &&
          !emp.selected
        )
          emp.active = false;
      }
    } else {
      // Xóa khỏi selectedEmpIds và tắt active
      selectedEmpIds.value.splice(
        selectedEmpIds.value.indexOf(empList.value[empIndex].EmployeeId),
        1
      );
      empList.value[empIndex].active = false;
    }
  }
  if (data.type == "active") {
    if (!empList.value[empIndex].selected) {
      empList.value[empIndex].active = !empList.value[empIndex].active;
    }
    if (empList.value[empIndex].active) {
      for (const emp of empList.value) {
        if (
          emp.EmployeeId != empList.value[empIndex].EmployeeId &&
          !emp.selected
        )
          emp.active = false;
      }
    }
  }
}

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
function showDeleteOneConfirmDialog(empCode) {
  dialog.value.message = `Bạn có muốn xóa Nhân viên <${empCode}>`;
  dialog.value.action = deleteEmployee;
  dialog.value.isDisplay = true;
}

/**
 * Hiển thị cảnh báo xóa hàng loạt
 *
 * Author: Dũng (08/05/2023)
 */
function showBatchDeleteConfirmDialog() {
  dialog.value.message = `Bạn có chắc chắn muốn xóa ${selectedEmpIds.value.length} Nhân viên`;
  dialog.value.action = deleteBatchEmployee;
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
 * Gọi API xóa hàng loạt nhân viên
 * Author: Dũng (08/05/2023)
 */
async function deleteBatchEmployee() {
  try {
    dialog.value.isDisplay = false;
    isLoadingPage.value = true;
    for (const id of selectedEmpIds.value) {
      await $axios.delete($enum.api.employees.one(id));
    }
    selectedEmpIds.value = [];
    await loadEmployeeData();
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
  showDeleteOneConfirmDialog(empCode);
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
  setTimeout(() => {
    pushToast({
      id: toastId++,
      type: "success",
      title: "Thành công!",
      message: "Nhân viên đã bị xóa",
      timeToLive: 3000,
    });
  }, 200);
  // router.replace("/employee/create");
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
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.searchbar__left {
  position: relative;
}

.left__option {
  position: absolute;
  width: 110px;
  padding: 4px;
  top: 38px;
  right: 0;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  border-radius: 4px;
  z-index: 5;
  background-color: #fff;
  border: 1px solid var(--clr-t-border);
}
.option__item {
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  padding-left: 10px;
}

.option__item:hover {
  background-color: #e6e6e68b;
  color: var(--clr-lg500);
  cursor: pointer;
}

.searchbar__right {
  display: flex;
  column-gap: 24px;
}
.button__hoverbox {
  display: none;
  z-index: 20;
  position: absolute;
  top: -24px;
  right: -22px;
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
  right: 34%;
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

.toastbox__position {
  position: absolute;
  top: 14px;
  left: 25vw;
  z-index: 20;
}
</style>
