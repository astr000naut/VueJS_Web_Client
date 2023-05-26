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
        <div class="searchbar__left" v-show="selectedEmpIds.length > 1">
          <div class="left__info">
            Đã chọn: <strong>{{ selectedEmpIds.length }}</strong>
          </div>
          <div class="left__cancel" @click="cancelSelectOnClick">Bỏ chọn</div>
          <BaseButton
            bname="Xóa hàng loạt"
            class="btn--secondary"
            @click="showBatchDeleteConfirmDialog"
          />
        </div>
      </div>
      <EmployeeTable
        :is-loading-data="isLoadingData"
        :row-list="rowList"
        :key="tableKey"
        :delete-employee-function="deleteEmployeeOnClick"
        :selected-emp-ids="selectedEmpIds"
        :selected-amount-in-page="selectedAmountInPage"
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
const selectedEmpIds = ref([]);
const selectedAmountInPage = ref(0);
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
 * Sự kiện khi cập nhật trạng thái của nhân viên (select, active, toggleAll)
 * @param {Object} data object thông báo
 *
 * Author: Dũng (10/05/2023)
 */
function rowStatusOnUpdate(data) {
  const { type, rowIndex } = data;
  if (type == "toggleAllPage") {
    // Nếu không có employee nào đang được chọn
    if (selectedAmountInPage.value == 0) {
      // Chọn tất cả
      selectedAmountInPage.value = rowList.value.length;
      for (const row of rowList.value) {
        row.selected = true;
        row.active = true;
        selectedEmpIds.value.push(row.emp.employeeId);
      }
    } else {
      // Nếu có ít nhất một employee đang được chọn
      // Hủy chọn tất cả
      selectedAmountInPage.value = 0;
      for (const row of rowList.value) {
        row.selected = false;
        row.active = false;
        const index = selectedEmpIds.value.indexOf(row.emp.employeeId);
        if (index > -1) selectedEmpIds.value.splice(index, 1);
      }
    }
    return;
  }

  if (type == "selected") {
    // Đổi trạng thái selected của row
    rowList.value[rowIndex].selected = !rowList.value[rowIndex].selected;

    // Nếu selected true thì thêm vào selectedEmpIds và bật active
    if (rowList.value[rowIndex].selected) {
      ++selectedAmountInPage.value;
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
      --selectedAmountInPage.value;
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
 * Sự kiện click vào nút bỏ chọn
 *
 * Author: Dũng (25/05/2023)
 */
function cancelSelectOnClick() {
  for (const row of rowList.value) {
    selectedAmountInPage.value = 0;
    row.selected = false;
    row.active = false;
    selectedEmpIds.value = [];
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

function handleApiErrorResponse(error) {
  if (error.code == "ERR_NETWORK") {
    pushToast({
      type: "fail",
      message:
        "Xảy ra lỗi khi kết nối tới server, vui lòng liên hệ nhân viên hỗ trợ",
    });
  } else {
    pushToast({
      type: "fail",
      message: error.response.data.UserMessage,
    });
  }
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
    isLoadingPage.value = false;
    handleApiErrorResponse(error);
  }
}

/**
 * Gọi API xóa hàng loạt nhân viên
 * Author: Dũng (08/05/2023)
 */
async function deleteBatchEmployee() {
  try {
    let deletedSucess = 0;
    let idList = [];
    let batchAmount = 0;
    isLoadingPage.value = true;

    while (selectedEmpIds.value.length) {
      batchAmount = Math.min(20, selectedEmpIds.value.length);
      idList = [];
      for (let i = 0; i < batchAmount; ++i)
        idList.push(selectedEmpIds.value[i]);
      await $axios.post($api.employee.deleteMultiple, idList);
      deletedSucess += batchAmount;
      selectedEmpIds.value.splice(0, batchAmount);
    }
    await loadEmployeeData();

    isLoadingPage.value = false;
    pushToast({
      type: "success",
      message: `Xóa thành công ${deletedSucess} nhân viên`,
      timeToLive: 3000,
    });
  } catch (error) {
    isLoadingPage.value = false;
    handleApiErrorResponse(error);
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
    selectedAmountInPage.value = 0;
    isLoadingData.value = true;
    await new Promise((resolve) => setTimeout(resolve, 800));
    const response = await $axios.get($api.employee.filter, {
      params: {
        skip: pagingData.value.pageSize * (pagingData.value.pageNumber - 1),
        take: pagingData.value.pageSize,
        keySearch: cache.value.empSearchPattern,
      },
    });
    rowList.value = [];
    // console.log(response.data);
    if (response.data.filteredList) {
      for (const emp of response.data.filteredList) {
        const empConverted = new Employee(emp);
        const isSelected = selectedEmpIds.value.includes(
          empConverted.employeeId
        );
        if (isSelected) ++selectedAmountInPage.value;
        rowList.value.push({
          active: isSelected,
          selected: isSelected,
          emp: empConverted,
        });
      }
    }
    // console.log(1);
    // console.log(rowList.value);
    pagingData.value.curAmount = response.data.filteredList.length ?? 0;
    pagingData.value.totalRecord = response.data.totalRecord ?? 0;
    isLoadingData.value = false;
  } catch (error) {
    console.log("LOAD FAILED");
    console.log(error);
    isLoadingData.value = false;
    handleApiErrorResponse(error);
  }
}

/**
 * Sự kiện cập nhật mảng rowList
 * @param {String} type kiểu update (thêm hay sửa)
 * @param {Object} data dữ liệu của employee mới
 * Author: Dũng (08/05/2023)
 */
async function employeeOnUpdate(type, data) {
  // console.log("Employee list updated");
  // console.log(type);
  // console.log(data);
  switch (type) {
    case "create":
      pagingData.value.totalRecord += 1;
      pagingData.value.curAmount += 1;
      rowList.value.unshift({
        active: false,
        selected: false,
        emp: data,
      });
      pushToast({
        type: "success",
        message: "Thêm mới nhân viên thành công.",
        timeToLive: 3000,
      });
      break;
    case "edit":
      for (const row of rowList.value) {
        if (row.emp.employeeId == data.employeeId) {
          row.emp = data;
          break;
        }
      }
      pushToast({
        type: "success",
        message: "Sửa thông tin nhân viên thành công.",
        timeToLive: 3000,
      });
      break;
    default:
      break;
  }
  // await loadEmployeeData();
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
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.searchbar__left {
  position: relative;
  display: flex;
  align-items: center;
  column-gap: 24px;
}

.left__info {
  font-weight: 500;
}

.left__cancel {
  font-weight: 500;
  cursor: pointer;
  color: red;
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
