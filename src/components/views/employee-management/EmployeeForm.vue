<template>
  <div class="wrapper wrapper--dark1 wrapper--form">
    <div class="form__wrapper" v-show="formNoti.showNotibox">
      <BaseNotibox
        :type="formNoti.notiboxType"
        :message="formNoti.notiboxMessage"
        :yes-on-click="formNotiboxYesBtnOnClick"
      />
    </div>
    <div class="form__wrapper" v-show="formDialog.isShow">
      <BaseDialog
        title="Lưu lại thay đổi"
        message="Dữ liệu đã bị thay đổi. Bạn có muốn cất không ?"
        :close-on-click="formDialogCloseBtnOnClick"
        :no-on-click="formDialogNoBtnOnClick"
        :yes-on-click="formDialogYesBtnOnClick"
      />
    </div>
    <div class="form__loader" v-show="form.isLoading">
      <BaseLoader />
    </div>
    <div class="form">
      <div class="form__header">
        <div class="header__left">
          <div class="header__title">
            {{
              form.type == $enum.form.infoType
                ? "Sửa thông tin nhân viên"
                : "Thêm mới nhân viên"
            }}
          </div>
          <div class="header__option1">
            <div
              class="checkbox mi mi-18"
              :class="[form.checkbox1 ? 'mi-checkbox-checked' : '']"
              @click="form.checkbox1 = !form.checkbox1"
            ></div>
            <div class="checkbox__label">Là khách hàng</div>
          </div>
          <div class="header__option2">
            <div
              class="checkbox mi mi-18"
              :class="[form.checkbox2 ? 'mi-checkbox-checked' : '']"
              @click="form.checkbox2 = !form.checkbox2"
            ></div>
            <div class="checkbox__label">Là nhà cung cấp</div>
          </div>
        </div>
        <div class="header__right">
          <BaseButton bname="" class="mi-36 btn--help" />
          <BaseButton
            bname=""
            class="mi-36 btn--close"
            @click="btnCloseOnClick"
          />
        </div>
      </div>
      <div class="form__body">
        <div class="form__upper">
          <div class="fu__left">
            <div class="fu__left__top">
              <div class="fu__index">
                <BaseTextfield
                  pholder=""
                  autoFillMessage="Shift + F8 để tự tạo mã"
                  label="Mã"
                  :isrequired="true"
                  :autoFill="generateEmpCode"
                  v-model:text="employee.employeeCode"
                  v-model:noti="formNoti.empCode"
                  @keydown.shift.tab.prevent="empCodeTextfieldOnShiftTab"
                  ref="empCodeRef"
                />
              </div>
              <div class="fu__name">
                <BaseTextfield
                  pholder=""
                  label="Tên"
                  :isrequired="true"
                  v-model:text="employee.employeeFullName"
                  v-model:noti="formNoti.empFullName"
                  ref="empFullNameRef"
                />
              </div>
            </div>
            <div class="fu__left__mid">
              <div class="fu__unit">
                <BaseCombobox
                  label="Đơn vị"
                  :isrequired="true"
                  :option-list="departmentList"
                  :add-new-item="addNewDepartment"
                  v-model:text="employee.departmentName"
                  v-model:noti="formNoti.empDepartmentName"
                  v-model:selectedItemId="employee.departmentId"
                  ref="empDepartmentNameRef"
                />
              </div>
            </div>
            <div class="fu__left__bot">
              <div class="fu__position">
                <BaseTextfield
                  pholder=""
                  label="Chức danh"
                  v-model:text="employee.positionName"
                  noti=""
                />
              </div>
            </div>
          </div>
          <div class="fu__right">
            <div class="fu__right__top">
              <div class="fu__dob">
                <BaseDatepicker
                  label="Ngày sinh"
                  v-model:inputText="employee.dateOfBirth"
                />
              </div>
              <div class="fu__gender">
                <BaseRadiogroup
                  label="Giới tính"
                  :options="[
                    { text: 'Nam', value: 0 },
                    { text: 'Nữ', value: 1 },
                    { text: 'Khác', value: 2 },
                  ]"
                  v-model:radioValue="employee.gender"
                />
              </div>
            </div>
            <div class="fu__right__mid">
              <div class="fu__cmnd">
                <BaseTextfield
                  pholder=""
                  label="Số CMND"
                  v-model:text="employee.identityNumber"
                  v-model:noti="formNoti.empIdentityNumber"
                  tooltip="Số chứng minh nhân dân"
                  ref="empIdentitiNumberRef"
                />
              </div>
              <div class="fu__cmnddate">
                <BaseDatepicker
                  label="Ngày cấp"
                  v-model:inputText="employee.identityDate"
                />
              </div>
            </div>
            <div class="fu__right__bot">
              <div class="fu__cmndpos">
                <BaseTextfield
                  pholder=""
                  label="Nơi cấp"
                  noti=""
                  v-model:text="employee.identityPlace"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="form__lower">
          <div class="fl__top">
            <div class="fl__address">
              <BaseTextfield
                pholder=""
                label="Địa chỉ"
                noti=""
                v-model:text="employee.address"
              />
            </div>
          </div>
          <div class="fl__mid">
            <div class="fl__phone">
              <BaseTextfield
                pholder=""
                label="ĐT di động"
                tooltip="Số điện thoại di động"
                noti=""
                v-model:text="employee.phoneNumber"
              />
            </div>
            <div class="fl__homephone">
              <BaseTextfield
                pholder=""
                label="ĐT cố định"
                tooltip="Số điện thoại cố định"
                noti=""
                v-model:text="employee.landlineNumber"
              />
            </div>
            <div class="fl__email">
              <BaseTextfield
                pholder=""
                label="Email"
                noti=""
                v-model:text="employee.email"
              />
            </div>
          </div>
          <div class="fl__bot">
            <div class="fl__bankacc">
              <BaseTextfield
                pholder=""
                label="Tài khoản ngân hàng"
                noti=""
                v-model:text="employee.bankAccount"
              />
            </div>
            <div class="fl__bankname">
              <BaseTextfield
                pholder=""
                label="Tên ngân hàng"
                noti=""
                v-model:text="employee.bankName"
                ref="empBankNameRef"
              />
            </div>
            <div class="fl__bankarea">
              <BaseTextfield
                pholder=""
                label="Chi nhánh"
                v-model:text="employee.bankBranch"
                ref="bankBranchInputRef"
                noti=""
                @keydown.tab.prevent="bankAreaInputOnTabKeyDown"
                @keydown.shift.tab.prevent="bankAreaInputOnShiftTabKeyDown"
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="form__footer">
        <div class="footer__left">
          <BaseButton
            ref="cancelBtnRef"
            bname="Hủy"
            class="btn--secondary"
            @keydown.tab.prevent="cancelBtnOnTabKeydown"
            @keydown.shift.tab.prevent="cancelBtnOnShiftTabKeydown"
            @click="cancelBtnOnClick"
          />
        </div>
        <div class="footer__right">
          <BaseButton
            bname="Cất"
            class="btn--secondary"
            ref="saveBtnRef"
            @click="btnSaveOnClick"
            @keydown.shift.tab.prevent="saveBtnOnShiftTabKeydown"
          />
          <BaseButton
            bname="Cất và Thêm"
            class="btn--primary"
            ref="saveAndAddBtnRef"
            @keydown.tab.prevent="saveAndAddBtnOnTabKeydown"
            @keydown.shift.tab.prevent="saveAndAddBtnOnShiftTabKeydown"
            @click="btnSaveAndAddOnClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseCombobox from "@/components/base/BaseCombobox.vue";
import BaseDatepicker from "@/components/base/BaseDatepicker.vue";
import BaseRadiogroup from "@/components/base/BaseRadiogroup.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseNotibox from "@/components/base/BaseNotibox.vue";
import $enum from "@/js/common/enum";
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Employee } from "../../../js/model/employee";
const $axios = inject("$axios");
import $api from "../../../js/api/index";
import { Department } from "@/js/model/department";
import $formatter from "../../../js/common/formater";

const emits = defineEmits(["updateEmplist"]);
const router = useRouter();
const route = useRoute();
const form = ref({
  type: "",
  empId: "",
  isLoading: false,
  checkbox1: false,
  checkbox2: false,
});
const employee = ref({});
const formNoti = ref({
  showNotibox: false,
  notiboxType: "",
  notiboxMessage: "",
  empCode: "",
  empFullName: "",
  empDepartmentName: "",
  empIdentityNumber: "",
});
const empCodeRef = ref(null);
const formDialog = ref({
  isShow: false,
});
const cancelBtnRef = ref(null);
const saveBtnRef = ref(null);
const saveAndAddBtnRef = ref(null);
const bankBranchInputRef = ref(null);
const empFullNameRef = ref(null);
const empDepartmentNameRef = ref(null);
const empIdentitiNumberRef = ref(null);
const empBankNameRef = ref(null);
const departmentList = ref([]);
resetFormState();

onMounted(async () => {
  try {
    form.value.isLoading = true;
    await getDataFromApi();
    form.value.isLoading = false;
    empCodeRef.value.refInput.focus();
  } catch (error) {
    console.log(error);
    form.value.isLoading = false;
    handleResponseStatusCode(error.response.status, error);
  }
});

/**
 * Sự kiện click vào btn yes khi đóng dialog
 *
 * Author: Dũng (27/05/2023)
 */
async function formDialogYesBtnOnClick() {
  formDialog.value.isShow = false;
  await btnSaveOnClick();
}

/**
 * Quản lý các mã HTTP Code trả về sau khi gọi API
 * @param {code}
 * Author: Dũng (08/05/2023)
 */
function handleResponseStatusCode(code, error) {
  if (code == 400) {
    formNoti.value.notiboxType = "alert";
    formNoti.value.notiboxMessage =
      "Dữ liệu nhập vào không hợp lệ, vui lòng kiểm tra lại";
    formNoti.value.showNotibox = true;
  } else {
    formNoti.value.notiboxType = "alert";
    formNoti.value.notiboxMessage = error.response.data.UserMessage;
    formNoti.value.showNotibox = true;
  }
}

/**
 * Reset giá trị employee và trạng thái form
 *
 * Author: Dũng (08/05/2023)
 */
function resetFormState() {
  form.value = {
    type: route.params.id ? $enum.form.infoType : $enum.form.createType,
    empId: route.params.id ?? "",
    isLoading: false,
    checkbox1: false,
    checkbox2: false,
  };
  employee.value = new Employee({});
}
/**
 * Lấy mã nhân viên mới
 *
 * Author: Dux(11/05/2023)
 */
async function generateEmpCode() {
  try {
    form.value.isLoading = true;
    await fetchNewEmployeeCode();
    form.value.isLoading = false;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Kiểm tra mã empCode đã tồn tại chưa
 * @param {String} empCode mã nhân viên cần check
 * @param {String} empId id của nhân viên (chỉ cần nếu form là form sửa)
 * Author: Dux(09/05/2023)
 */
async function isEmpCodeExist(empCode, empId) {
  const response = await $axios.get($api.employee.checkCodeExist, {
    params: {
      id: empId,
      code: empCode,
    },
  });
  return response;
}

/**
 * Gọi Api lấy danh sách department
 *
 * Author:  Dux (08/05/2023)
 */
async function getDepartmentList() {
  const departmentApiResponse = await $axios.get($api.department.filter, {
    skip: 0,
  });
  departmentList.value = [];
  // console.log(departmentApiResponse);
  for (const department of departmentApiResponse.data.filteredList) {
    departmentList.value.push(new Department(department));
  }
}

/**
 * Gọi API lấy mã nhân viên mới
 *
 * Author: Dũng (08/05/2023)
 */
async function fetchNewEmployeeCode() {
  const response = await $axios.get($api.employee.newCode);
  employee.value.employeeCode = response.data;
}

/**
 * Cập nhật Department name cho employee
 *
 * Author: Dũng (11/05/2023)
 */
function updateDepartmentInfo() {
  for (const department of departmentList.value) {
    if (department.departmentId == employee.value.departmentId) {
      employee.value.departmentName = department.departmentName;
      employee.value.departmentCode = department.departmentCode;
    }
  }
}

/**
 * Gọi API khởi tạo dữ liệu cho form
 *
 * Author: Dũng (08/05/2023)
 */
async function getDataFromApi() {
  // Fetch Department List
  await getDepartmentList();
  if (form.value.type == $enum.form.createType) {
    // Fetch new employee code
    await fetchNewEmployeeCode();
  } else {
    // Fetch employee information
    await getEmployee(form.value.empId);
    updateDepartmentInfo();
  }
}

/**
 * Validate các thông tin có trong form
 *
 * Author: Dũng (08/05/2023)
 */
async function validateData() {
  // Giá trị text lỗi của ô bị lỗi đầu tiên
  let firstMessage = "";

  // Validate mã nhân viên
  // Mã trống
  if (employee.value.employeeCode.trim() == "") {
    employee.value.employeeCode = "";
    formNoti.value.empCode = "Mã không được để trống";
    if (firstMessage == "") {
      firstMessage = formNoti.value.empCode;
    }
  } else {
    // Mã quá dài
    if (employee.value.employeeCode.length > 50) {
      formNoti.value.empCode = `Mã nhân viên không quá 50 kí tự`;
      if (firstMessage == "") {
        firstMessage = formNoti.value.empCode;
      }
    } else {
      // Kiểm tra trùng mã
      const isCodeExist = await isEmpCodeExist(
        employee.value.employeeCode,
        form.value.empId
      ).data;
      if (isCodeExist) {
        formNoti.value.empCode = `Mã nhân viên <${employee.value.employeeCode}>đã tồn tại trong hệ thống, vui lòng kiểm tra lại.`;
        if (firstMessage == "") {
          firstMessage = formNoti.value.empCode;
        }
      }
    }
  }
  // Kiểm tra tên nhân viên
  // Tên bị trống
  if (employee.value.employeeFullName.trim() == "") {
    formNoti.value.empFullName = "Tên không được để trống";
    if (firstMessage == "") {
      firstMessage = formNoti.value.empFullName;
    }
  } else {
    // Tên quá dài
    if (employee.value.employeeFullName.length > 100) {
      formNoti.value.empFullName = `Tên nhân viên không quá 100 kí tự`;
      if (firstMessage == "") {
        firstMessage = formNoti.value.empFullName;
      }
    }
  }
  // Kiểm tra thông tin đơn vị
  if (employee.value.departmentName.trim() == "") {
    formNoti.value.empDepartmentName = "Đơn vị không được để trống";
    if (firstMessage == "") {
      firstMessage = formNoti.value.empDepartmentName;
    }
  } else {
    // Đơn vị không có trong danh mục
    let isDepartmentInDepartmentList = false;
    for (let i = 0; i < departmentList.value.length; ++i) {
      if (departmentList.value[i].departmentId == employee.value.departmentId) {
        isDepartmentInDepartmentList = true;
        break;
      }
    }
    if (!isDepartmentInDepartmentList) {
      formNoti.value.empDepartmentName =
        "Vui lòng chọn Đơn vị có trong danh mục";
      if (firstMessage == "") {
        firstMessage = formNoti.value.empDepartmentName;
      }
    }
  }

  // Kiểm tra thông tin chức danh
  if (employee.value.positionName.length > 255) {
    if (firstMessage == "") {
      firstMessage = "Độ dài Chức danh không quá 255 kí tự";
    }
  }

  // Kiểm tra thông tin CMND
  if (!/^$|^\d{9}$|^\d{12}$/.test(employee.value.identityNumber)) {
    formNoti.value.empIdentityNumber = "Số CMND không đúng định dạng";
    if (firstMessage == "") {
      firstMessage = formNoti.value.empIdentityNumber;
    }
  }

  // Kiểm tra ngày sinh
  // Định dạng
  if (
    employee.value.dateOfBirth.length > 0 &&
    !$formatter.isValidDate(employee.value.dateOfBirth)
  ) {
    if (firstMessage == "") {
      firstMessage = "Sai định dạng ngày sinh";
    }
  }
  // Ngày sinh ở tương lai
  if (
    employee.value.dateOfBirth.length > 0 &&
    !$formatter.isPastDate(employee.value.dateOfBirth)
  ) {
    if (firstMessage == "") {
      firstMessage = "Ngày sinh không hợp lệ";
    }
  }

  // Kiểm tra ngày cấp CMND
  if (
    employee.value.identityDate.length > 0 &&
    !$formatter.isValidDate(employee.value.identityDate)
  ) {
    if (firstMessage == "") {
      firstMessage = "Sai định dạng Ngày cấp CMND";
    }
  }
  // Ngày cấp ở tương lai
  if (
    employee.value.identityDate.length > 0 &&
    !$formatter.isPastDate(employee.value.identityDate)
  ) {
    if (firstMessage == "") {
      firstMessage = "Ngày cấp CMND không hợp lệ";
    }
  }

  // Kiểm tra số điện thoại di động
  if (!/^$|^\+?\d{0,50}$/.test(employee.value.phoneNumber)) {
    if (firstMessage == "") {
      firstMessage = "Sai định dạng Số điện thoại di động";
    }
  }

  // Kiểm tra số điện thoại cố định
  if (!/^$|^\+?\d{0,50}$/.test(employee.value.landlineNumber)) {
    if (firstMessage == "") {
      firstMessage = "Sai định dạng Số điện thoại cố định";
    }
  }
  // Kiểm tra Email
  // Email đúng định dạng
  if (!/^$|^\w+@\w+\..*\w$/.test(employee.value.email)) {
    if (firstMessage == "") {
      firstMessage = "Sai định dạng Email";
    }
  }

  // Email quá dài
  if (employee.value.email.length > 50) {
    if (firstMessage == "") {
      firstMessage = "Địa chỉ Email dài quá 50 kí tự";
    }
  }

  // Kiểm tra số tài khoản ngân hàng
  if (!/^$|^\d{0,50}$/.test(employee.value.bankAccount)) {
    if (firstMessage == "") {
      firstMessage = "Sai định dạng Số tài khoản ngân hàng";
    }
  }

  // Kiểm tra tên ngân hàng
  if (employee.value.bankName.length > 255) {
    if (firstMessage == "") {
      firstMessage = "Tên ngân hàng không được dài quá 255 kí tự";
    }
  }

  // Kiểm tra chi nhánh ngân hàng
  if (employee.value.bankBranch.length > 255) {
    if (firstMessage == "") {
      firstMessage = "Chi nhánh không được dài quá 255 kí tự";
    }
  }

  if (firstMessage != "") {
    // Update notibox value
    formNoti.value.notiboxType = "alert";
    formNoti.value.notiboxMessage = firstMessage;
  } else {
    formNoti.value.notiboxMessage = "";
  }
}

/**
 * Gọi API tạo mới Department
 * @param {String} name tên Department
 *
 * Author: Dũng (08/05/2023)
 */
async function addNewDepartment(name) {
  form.value.isLoading = true;
  try {
    console.log(name);
    const response = await $axios.post($api.department.index, {
      departmentCode: "",
      departmentName: name,
      description: "",
    });
    console.log(response);
    await getDepartmentList();
    form.value.isLoading = false;
  } catch (error) {
    console.log(error);
    form.value.isLoading = false;
    handleResponseStatusCode(error.response.status, error);
  }
}

/**
 * Gọi API tạo mới nhân viên
 *
 * Author: Dũng (08/05/2023)
 */
async function callCreateEmployeeApi() {
  const requestBody = employee.value.convertToApiFormat();
  // console.log(requestBody);
  const response = await $axios.post($api.employee.index, requestBody);
  return response.data;
}

/**
 * Gọi API sửa nhân viên
 *
 * Author: Dũng (08/05/2023)
 */
async function callEditEmployeeApi() {
  const requestBody = employee.value.convertToApiFormat();
  // console.log(requestBody);
  await $axios.put($api.employee.one(form.value.empId), requestBody);
}

/**
 * Sự kiện click vào nút cất
 * @param {Boolean} goBackToEmployeeList có quay lại trang employee sau khi click không
 *
 * Author: Dũng (08/05/2023)
 */
async function btnSaveOnClick() {
  try {
    form.value.isLoading = true;
    await validateData();
    // check null ?
    if (formNoti.value.notiboxMessage.length) {
      form.value.isLoading = false;
      // show notibox
      formNoti.value.showNotibox = true;
    } else {
      if (form.value.type == $enum.form.createType) {
        // create employee
        const newEmployeeId = await callCreateEmployeeApi();
        employee.value.employeeId = newEmployeeId;
        emits("updateEmplist", "create", employee.value);
      } else {
        // edit employee
        await callEditEmployeeApi();
        emits("updateEmplist", "edit", employee.value);
      }
      form.value.isLoading = false;
      router.replace("/employee");
    }
  } catch (error) {
    console.log(error);
    form.value.isLoading = false;
    handleResponseStatusCode(error.response.status, error);
  }
}

/**
 * Sự kiện click vào nút cất và thêm
 *
 * Author: Dũng (08/05/2023)
 */
async function btnSaveAndAddOnClick() {
  try {
    form.value.isLoading = true;
    await validateData();
    if (formNoti.value.notiboxMessage != "") {
      form.value.isLoading = false;
      // show notibox
      formNoti.value.showNotibox = true;
    } else {
      if (form.value.type == $enum.form.createType) {
        // create employee
        const newEmployeeId = await callCreateEmployeeApi();
        employee.value.employeeId = newEmployeeId;
        emits("updateEmplist", "create", employee.value);
      } else {
        // edit employee
        await callEditEmployeeApi();
        emits("updateEmplist", "edit", employee.value);
      }
      form.value.isLoading = false;
      // Reset anything
      await router.replace("/employee/create");
      resetFormState();
      await fetchNewEmployeeCode();
      empCodeRef.value.refInput.focus();
    }
  } catch (error) {
    console.log(error);
    form.value.isLoading = false;
    handleResponseStatusCode(error.response.status, error);
  }
}

/**
 * Focus vào ô lỗi đầu tiên
 *
 * Author: Dũng (08/05/2023)
 */
function focusOnFirstErrorInput() {
  if (formNoti.value.empCode != "") {
    empCodeRef.value.refInput.focus();
    return;
  }
  if (formNoti.value.empFullName != "") {
    empFullNameRef.value.refInput.focus();
    return;
  }
  if (formNoti.value.empDepartmentName != "") {
    empDepartmentNameRef.value.refInput.focus();
    return;
  }
  if (formNoti.value.empIdentityNumber != "") {
    empIdentitiNumberRef.value.refInput.focus();
    return;
  }
}
/**
 * Sự kiện click vào nút có trong notibox
 * Author: Dũng (08/05/2023)
 */
function formNotiboxYesBtnOnClick() {
  formNoti.value.showNotibox = false;
  focusOnFirstErrorInput();
}
/**
 * Sự kiện click vào nút đóng dialog
 * Author: Dũng (08/05/2023)
 */
function formDialogCloseBtnOnClick() {
  formDialog.value.isShow = false;
}

/**
 * Sự kiện click vào nút không trong notibox
 * Author: Dũng (08/05/2023)
 */
function formDialogNoBtnOnClick() {
  formDialog.value.isShow = false;
  router.replace("/employee");
}
/**
 * Sự kiện click vào nút hủy trong notibox
 * Author: Dũng (08/05/2023)
 */
function cancelBtnOnClick() {
  router.replace("/employee");
}
/**
 * Sự kiện shift tab của nút hủy
 * Author: Dũng (08/05/2023)
 */
function cancelBtnOnShiftTabKeydown() {
  saveAndAddBtnRef.value.refBtn.focus();
}
/**
 * Sự kiện tab của nút hủy
 * Author: Dũng (08/05/2023)
 */
function cancelBtnOnTabKeydown() {
  empCodeRef.value.refInput.focus();
}
/**
 * Sự kiện tab của ô chi nhánh
 * Author: Dũng (08/05/2023)
 */
function bankAreaInputOnTabKeyDown() {
  saveBtnRef.value.refBtn.focus();
}
/**
 * Sự kiện shift tab của nút cất
 * Author: Dũng (08/05/2023)
 */
function saveBtnOnShiftTabKeydown() {
  bankBranchInputRef.value.refInput.focus();
}
/**
 * Sự kiện shift tab của ô chi nhánh
 * Author: Dũng (08/05/2023)
 */
function bankAreaInputOnShiftTabKeyDown() {
  empBankNameRef.value.refInput.focus();
}
/**
 * Sự kiện shift tab của nút cất và thêm
 * Author: Dũng (08/05/2023)
 */
function saveAndAddBtnOnShiftTabKeydown() {
  saveBtnRef.value.refBtn.focus();
}
/**
 * Sự kiện shift tab của ô mã nhân viên
 * Author: Dũng (08/05/2023)
 */
function empCodeTextfieldOnShiftTab() {
  cancelBtnRef.value.refBtn.focus();
}
/**
 * Sự kiện tab của nút cất và thêm
 * Author: Dũng (08/05/2023)
 */
function saveAndAddBtnOnTabKeydown() {
  cancelBtnRef.value.refBtn.focus();
}

/**
 * Gọi API lấy thông tin nhân viên
 * @param {String} empId Id nhân viên
 *
 * Author: Dũng (08/05/2023)
 */
async function getEmployee(empId) {
  const response = await $axios.get($api.employee.one(empId));
  const empFromApi = response.data;
  employee.value = new Employee(empFromApi);
}
/**
 * Sự kiện click vào nút đóng form
 * Author: Dũng (08/05/2023)
 */
function btnCloseOnClick() {
  formDialog.value.isShow = true;
}
</script>

<style scoped>
.form {
  width: 1000px;
  background-color: #fff;
  border-radius: var(--border-radius);
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 32px;
  transform: translate(-50%, -50%);
  max-height: 100vh;
  max-width: 100vw;
  overflow: auto;
  user-select: none;
}

.form::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: transparent;
}

.form::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.form::-webkit-scrollbar-thumb {
  background-color: var(--clr-t-border);
}

/* Form heading */
.form__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__left {
  display: flex;
  align-items: center;
  column-gap: 24px;
}
/* Header left */
.header__title {
  font-size: 20px;
  line-height: 26px;
  font-weight: 700;
}

.header__option1,
.header__option2 {
  display: flex;
  column-gap: 5px;
  align-items: center;
}

.header__option1 .checkbox,
.header__option2 .checkbox {
  border: 1px solid var(--clr-t-border);
  border-radius: var(--border-radius);
}

/* Header right */

.header__right {
  display: flex;
  column-gap: 8px;
}

/* Form body */

.form__body {
  /* background-color: lightcoral; */
  position: relative;
  margin-top: 32px;
  width: 100%;
}

/* Body upper */
.form__upper {
  display: flex;
  justify-content: space-between;
  column-gap: 32px;
}
/* Upper left */
.fu__left {
  /* background-color: red; */
  flex: 1;
}
.fu__left__top {
  display: flex;
  column-gap: 12px;
}
.fu__index {
  flex: 2;
}

.fu__name {
  flex: 3;
}

.fu__left__mid {
  margin-top: 24px;
}

.fu__left__bot {
  margin-top: 24px;
}

/* Upper right */
.fu__right {
  /* background-color: green; */
  flex: 1;
}

.fu__right__top {
  display: flex;
  column-gap: 12px;
}

.fu__right__mid {
  margin-top: 24px;
  display: flex;
  column-gap: 12px;
}

.fu__cmnd {
  flex: 2;
}
.fu__cmnddate {
  flex: 1;
}
.fu__right__bot {
  margin-top: 24px;
}

/* Body lower */

.form__lower {
  margin-top: 32px;
  /* background-color: rgb(123, 123, 58); */
}
.fl__mid {
  margin-top: 24px;
  display: flex;
  /* background-color: yellow; */
  column-gap: 12px;
}

.fl__bot {
  margin-top: 24px;
  display: flex;
  /* background-color: green; */
  column-gap: 12px;
}

.fl__mid .txtfield__textbox input {
  width: 240px;
}

.fl__bot .txtfield__textbox input {
  width: 240px;
}

/* Form footer */

.form__footer {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
}

.footer__right {
  display: flex;
  column-gap: 12px;
}

hr {
  margin-top: 32px;
  border: 1px solid var(--clr-t-border);
}

.form__loader {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #c7c7c71a;
  z-index: 10;
}

.form__wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #88888893;
  z-index: 12;
}
</style>
