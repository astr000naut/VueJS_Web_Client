<template>
  <div class="page__wrapper" v-show="isLoadingPage">
    <BaseLoader />
  </div>
  <div class="page__wrapper" v-show="dialog.isDisplay">
    <BaseDialog
      :title="lang.dialog.deleteConfirmation.title"
      :message="dialog.message"
      :close-on-click="dialogCloseOnClick"
      :no-on-click="dialogCloseOnClick"
      :yes-on-click="dialog.action"
    />
  </div>
  <BaseToastbox
    class="toastbox__position"
    :toast-list="toastList"
    :remove-toast="removeToast"
  />
  <router-view
    name="EmployeeForm"
    @update-emplist="employeeOnUpdate"
  ></router-view>
  <div class="pcontent">
    <div class="pcontent__heading">
      <div class="pcontent__title">{{ lang.employeeList.title }}</div>
      <BaseButton
        :bname="lang.button.addEmployee"
        class="btn--primary"
        @click="btnAddOnClick"
      />
    </div>
    <div class="pcontent__container">
      <div class="pcontent__searchbar">
        <div class="searchbar__right">
          <BaseTextfield
            :pholder="lang.textfield.searchBar.pholder"
            class="txtfield--search mw-300"
            noti=""
            v-model:text="cache.empSearchPattern"
            :realTimeSearch="true"
            :doSearch="doSearchEmployee"
          />
          <BaseButton class="mi mi-36 mi-refresh" @click="loadEmployeeData" />
          <div class="button__hoverbox">
            <div class="hover__arrow"></div>
            <div class="hover__text">{{ lang.button.reload }}</div>
          </div>
        </div>
        <div class="searchbar__left" v-show="selectedEmpIds.length > 1">
          <div class="left__info">
            Đã chọn: <strong>{{ selectedEmpIds.length }}</strong>
          </div>
          <div class="left__cancel" @click="cancelSelectOnClick">
            {{ lang.button.cancelSelect }}
          </div>
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
        :have-data-after-call-api="haveDataAfterCallApi"
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
// #region import
import EmployeeTable from "@/components/views/employee-management/EmployeeTable.vue";
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { useRouter } from "vue-router";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseToastbox from "@/components/base/BaseToastbox.vue";
import $api from "@/js/api";
import { Employee } from "@/js/model/employee";
import $error from "@/assets/resources/error";
import $message from "@/assets/resources/message";
const lang = inject("lang");
// #endregion

// #region init
const router = useRouter();
const $emitter = inject("$emitter");
const rowList = ref([]);
const isLoadingData = ref(true);
const isLoadingPage = ref(false);
const $axios = inject("$axios");
const tableKey = ref(0);
const haveDataAfterCallApi = ref(true);
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
// #endregion

// #region hook
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
// #endregion

// #region function
/**
 * Tìm kiếm nhân viên khi nhập vào ô tìm kiếm
 * Author: Dũng (26/05/2023)
 */
async function doSearchEmployee() {
  pagingData.value.pageNumber = 1;
  await loadEmployeeData();
}
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
 * Hiển thị cảnh báo xóa nhân viên
 * @param {String} empCode mã nhân viên
 *
 * Author: Dũng (08/05/2023)
 */
function showDeleteOneConfirmDialog(empCode) {
  dialog.value.message = $message.employeeDeleteConfirm(empCode);
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
  dialog.value.message = $message.employeeMultipleDeleteConfirm(
    selectedEmpIds.value.length
  );
  dialog.value.isDisplay = true;
  dialog.value.action = async () => {
    dialog.value.isDisplay = false;
    await deleteBatchEmployee();
  };
}

/**
 * Quản lý lỗi trả về từ api
 * Author: Dũng (08/05/2023)
 */
function handleApiErrorResponse(error) {
  if (error.code == "ERR_NETWORK") {
    pushToast({
      type: "fail",
      message: $error.serverDisconnected,
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

    const index = selectedEmpIds.value.indexOf(cache.value.empDeleteId);
    if (index > -1) {
      selectedEmpIds.value.splice(index, 1);
      selectedAmountInPage.value -= 1;
    }

    // Update pagingData
    pagingData.value.curAmount -= 1;
    pagingData.value.totalRecord -= 1;
    if (pagingData.value.curAmount == 0) {
      if (pagingData.value.pageNumber > 1) --pagingData.value.pageNumber;
      await loadEmployeeData();
    }
    isLoadingPage.value = false;
    // NEED REFACTOR
    pushToast({
      type: "success",
      message: $message.employeeDeleted,
      timeToLive: 1500,
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
    // Load lại từ trang 1
    pagingData.value.pageNumber = 1;
    await loadEmployeeData();

    isLoadingPage.value = false;
    pushToast({
      type: "success",
      message: $message.employeeMultipeDeleted(deletedSucess),
      timeToLive: 1500,
    });
  } catch (error) {
    isLoadingPage.value = false;
    handleApiErrorResponse(error);
  }
}

// #endregion

// #region handle event
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
    haveDataAfterCallApi.value = pagingData.value.totalRecord != 0;
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
      if (pagingData.value.curAmount > 50) {
        await loadEmployeeData();
      }
      pushToast({
        type: "success",
        message: $message.employeeCreated,
        timeToLive: 1500,
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
        message: $message.employeeUpdated,
        timeToLive: 1500,
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

// #endregion
</script>

<style
  scoped
  lang="css"
  src="../../../css/components/views/employee-management/employee-list.css"
></style>
