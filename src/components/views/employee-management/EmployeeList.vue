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
    @update-emplist="employeeOnUpdate"
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
            <div class="option__item" @click="showBatchDeleteConfirmDialog">
              Xóa
            </div>
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
          <BaseButton class="mi mi-36 mi-refresh" @click="loadEmployeeData" />
          <div class="button__hoverbox">
            <div class="hover__arrow"></div>
            <div class="hover__text">Tải lại dữ liệu</div>
          </div>
        </div>
      </div>
      <EmployeeTable
        :is-loading-data="isLoadingData"
        :row-list="rowList"
        :key="tableKey"
        :delete-employee-function="deleteEmployeeOnClick"
        :selected-emp-ids="selectedEmpIds"
        v-model:pagingData="pagingData"
        :paging-next-page="pagingNextPage"
        :paging-prev-page="pagingPrevPage"
        @update-paging-data="pagingDataOnUpdate"
        @update-row-status="rowStatusOnUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import EmployeeTable from "@/components/views/employee-management/EmployeeTable.vue";
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { useRouter } from "vue-router";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseToastbox from "@/components/base/BaseToastbox.vue";
import $api from "@/js/api";
import { Employee } from "@/js/model/employee";

const router = useRouter();
const $emitter = inject("$emitter");
const rowList = ref([]);
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
 * Tạo toast message mới và đẩy vào toastList
 * @param {Object} toast object thông báo
 *
 * Author: Dũng (10/05/2023)
 */
function pushToast(toast) {
  if (toastList.value.length > 5) toastList.value.splice(0, 1);
  toastList.value.push({
    id: toastId,
    type: toast.type,
    message: toast.message,
  });
  if (toast.timeToLive) {
    setToastTimeToLive(toastId, toast.timeToLive);
  }
  ++toastId;
  if (toastId > 99999) toastId = 0;
}

/**
 * Xóa một toast
 * @param {Number} id id của toast
 *
 * Author: Dũng (10/05/2023)
 */
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

/**
 * Set thời gian hiển thị của toast message
 * @param {Number} id id của toast
 * @param {Number} timeToLive thời gian hiển thị theo ms
 *
 * Author: Dũng (10/05/2023)
 */
function setToastTimeToLive(id, timeToLive) {
  setTimeout(() => {
    removeToast(id);
  }, timeToLive);
}

/**
 * Sự kiện mouseLeave của menu thực hiện hàng loạt
 *
 * Author: Dũng (10/05/2023)
 */
function batchMenuOnMouseLeave() {
  batchOperator.value.showMenu = false;
}

/**
 * Sự kiện click vào nút thực hiện hàng loạt
 *
 * Author: Dũng (10/05/2023)
 */
function batchBtnOnClick() {
  batchOperator.value.showMenu = !batchOperator.value.showMenu;
}

/**
 * Sự kiện khi cập nhật trạng thái của nhân viên (select, active, toggleAll)
 * @param {Object} data object thông báo
 *
 * Author: Dũng (10/05/2023)
 */
function rowStatusOnUpdate(data) {
  const { type, rowIndex } = data;
  if (type == "toggleAll") {
    // Nếu không có employee nào đang được chọn
    if (selectedEmpIds.value.length == 0) {
      // Chọn tất cả
      for (const row of rowList.value) {
        row.selected = true;
        row.active = true;
        selectedEmpIds.value.push(row.emp.employeeId);
      }
    } else {
      // Nếu có ít nhất một employee đang được chọn
      // Hủy chọn tất cả
      for (const row of rowList.value) {
        row.selected = false;
        row.active = false;
        selectedEmpIds.value = [];
      }
    }
    return;
  }

  if (type == "selected") {
    // Đổi trạng thái selected của row
    rowList.value[rowIndex].selected = !rowList.value[rowIndex].selected;

    // Nếu selected true thì thêm vào selectedEmpIds và bật active
    if (rowList.value[rowIndex].selected) {
      selectedEmpIds.value.push(rowList.value[rowIndex].emp.employeeId);
      rowList.value[rowIndex].active = true;
      // Tắt active của những ô khác mà không được selected
      for (const row of rowList.value) {
        if (
          row.emp.employeeId != rowList.value[rowIndex].emp.employeeId &&
          !row.selected
        )
          row.active = false;
      }
    } else {
      // Nếu seleted của employee này false
      // Xóa khỏi selectedEmpIds và tắt active
      selectedEmpIds.value.splice(
        selectedEmpIds.value.indexOf(rowList.value[rowIndex].emp.employeeId),
        1
      );
      rowList.value[rowIndex].active = false;
    }
    return;
  }

  if (data.type == "active") {
    // Nếu row này đang không được select thì cập nhật trạng thái active
    if (!rowList.value[rowIndex].selected) {
      rowList.value[rowIndex].active = !rowList.value[rowIndex].active;
    }
    // Nếu row này được bật active
    if (rowList.value[rowIndex].active) {
      // Tắt những row khác đang active mà không selected
      for (const row of rowList.value) {
        if (
          !row.selected &&
          row.emp.employeeId != rowList.value[rowIndex].emp.employeeId
        )
          row.active = false;
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
  dialog.value.action = async () => {
    dialog.value.isDisplay = false;
    await deleteEmployee();
  };
  dialog.value.isDisplay = true;
}

/**
 * Hiển thị cảnh báo xóa hàng loạt
 *
 * Author: Dũng (08/05/2023)
 */
function showBatchDeleteConfirmDialog() {
  dialog.value.message = `Bạn có chắc chắn muốn xóa ${selectedEmpIds.value.length} Nhân viên`;
  dialog.value.isDisplay = true;
  dialog.value.action = async () => {
    dialog.value.isDisplay = false;
    await deleteBatchEmployee();
  };
}

/**
 * Gọi API xóa nhân viên
 * Author: Dũng (08/05/2023)
 */
async function deleteEmployee() {
  try {
    isLoadingPage.value = true;
    await $axios.delete($api.employee.one(cache.value.empDeleteId));
    rowList.value.splice(cache.value.empDeleteIndex, 1);
    // Update pagingData
    pagingData.value.curAmount -= 1;
    pagingData.value.totalRecord -= 1;
    isLoadingPage.value = false;
    // NEED REFACTOR
    pushToast({
      type: "success",
      message: "Nhân viên đã bị xóa khỏi hệ thống.",
      timeToLive: 3000,
    });
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
    isLoadingPage.value = true;
    const promiseList = [];
    for (const id of selectedEmpIds.value) {
      promiseList.push($axios.delete($api.employee.one(id)));
    }
    await Promise.all(promiseList);
    selectedEmpIds.value = [];
    await loadEmployeeData();
    isLoadingPage.value = false;
    pushToast({
      type: "success",
      message: "Xóa hàng loạt thành công.",
      timeToLive: 3000,
    });
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
  for (let index in rowList.value) {
    if (rowList.value[index].emp.employeeId == empId) {
      cache.value.empDeleteIndex = index;
      empCode = rowList.value[index].emp.employeeCode;
      break;
    }
  }
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
    const response = await $axios.get($api.employee.filter, {
      params: {
        skip: pagingData.value.pageSize * (pagingData.value.pageNumber - 1),
        take: pagingData.value.pageSize,
        keySearch: cache.value.empSearchPattern,
      },
    });
    rowList.value = [];
    console.log(response.data);
    if (response.data.filteredList) {
      for (const emp of response.data.filteredList) {
        rowList.value.push({
          active: false,
          selected: false,
          emp: new Employee(emp),
        });
      }
    }
    pagingData.value.curAmount = response.data.filteredList.length ?? 0;
    pagingData.value.totalRecord = response.data.totalRecord ?? 0;
    isLoadingData.value = false;
  } catch (error) {
    console.log("LOAD FAILED");
    pushToast({
      type: "fail",
      message: "Không thể tải dữ liệu. Vui lòng kiểm tra lại kết nối Internet.",
    });
    console.log(error);
  }
}

/**
 * Sự kiện cập nhật mảng rowList
 * @param {String} type kiểu update (thêm hay sửa)
 * @param {Object} data dữ liệu của employee mới
 * Author: Dũng (08/05/2023)
 */
async function employeeOnUpdate(type, data) {
  console.log("Employee list updated");
  console.log(data);
  switch (type) {
    case "create":
      pagingData.value.totalRecord += 1;
      pushToast({
        type: "success",
        message: "Thêm mới nhân viên thành công.",
        timeToLive: 3000,
      });
      break;
    case "edit":
      pushToast({
        type: "success",
        message: "Sửa thông tin nhân viên thành công.",
        timeToLive: 3000,
      });
      break;
    default:
      break;
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
