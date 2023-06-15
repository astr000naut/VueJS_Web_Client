<template>
  <div class="wrapper wrapper--dark1 wrapper--form">
    <div class="form__wrapper" v-show="formNoti.showNotibox">
      <BaseNotibox
        :type="formNoti.notiboxType"
        :message="formNoti.notiboxMessage"
        :yes-on-click="formNotiboxYesBtnOnClick"
        ref="notiRef"
      />
    </div>
    <div class="form__wrapper" v-show="formDialog.isShow">
      <BaseDialog
        :title="lang.dialog.savingChanges.title"
        :message="lang.dialog.savingChanges.message"
        :close-on-click="formDialogCloseBtnOnClick"
        :no-on-click="formDialogNoBtnOnClick"
        :yes-on-click="formDialogYesBtnOnClick"
        ref="dialogRef"
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
                ? lang.form.title.edit
                : lang.form.title.add
            }}
          </div>
          <div class="header__option1">
            <div
              class="checkbox mi mi-18"
              :class="[form.checkbox1 ? 'mi-checkbox-checked' : '']"
              @click="form.checkbox1 = !form.checkbox1"
            ></div>
            <div class="checkbox__label">
              {{ lang.checkboxLabel.isCustomer }}
            </div>
          </div>
          <div class="header__option2">
            <div
              class="checkbox mi mi-18"
              :class="[form.checkbox2 ? 'mi-checkbox-checked' : '']"
              @click="form.checkbox2 = !form.checkbox2"
            ></div>
            <div class="checkbox__label">
              {{ lang.checkboxLabel.isProvider }}
            </div>
          </div>
        </div>
        <div class="header__right">
          <BaseButton
            bname=""
            class="mi-36 btn--help"
            @mouseenter="formTooltip.help = true"
            @mouseleave="formTooltip.help = false"
          />
          <BaseButton
            bname=""
            class="mi-36 btn--close"
            @click="btnCloseOnClick"
            @mouseenter="formTooltip.close = true"
            @mouseleave="formTooltip.close = false"
          />
          <div
            class="btn__tooltip btn__tooltip--help"
            v-show="formTooltip.help"
          >
            {{ lang.tooltip.help }}
          </div>
          <div
            class="btn__tooltip btn__tooltip--close"
            v-show="formTooltip.close"
          >
            {{ lang.tooltip.closeForm }}
          </div>
        </div>
      </div>
      <div class="form__body">
        <div class="form__upper">
          <div class="fu__left">
            <div class="fu__left__top">
              <div class="fu__index">
                <BaseTextfield
                  pholder=""
                  :autoFillMessage="lang.textfield.empCode.autofillMessage"
                  :label="lang.textfield.empCode.label"
                  :isrequired="true"
                  :autoFill="generateEmpCode"
                  v-model:text="employee.employeeCode"
                  v-model:noti="formNoti.employeeCode"
                  @keydown.shift.tab.prevent="empCodeTextfieldOnShiftTab"
                  ref="employeeCodeRef"
                />
              </div>
              <div class="fu__name">
                <BaseTextfield
                  pholder=""
                  :label="lang.textfield.empName.label"
                  :isrequired="true"
                  v-model:text="employee.employeeFullName"
                  v-model:noti="formNoti.employeeFullName"
                  ref="employeeFullNameRef"
                />
              </div>
            </div>
            <div class="fu__left__mid">
              <div class="fu__unit">
                <BaseCombobox
                  :label="lang.combobox.empDepart.label"
                  :isrequired="true"
                  :option-list="departmentList"
                  v-model:text="employee.departmentName"
                  v-model:noti="formNoti.departmentName"
                  v-model:selectedItemId="employee.departmentId"
                  ref="departmentNameRef"
                />
              </div>
            </div>
            <div class="fu__left__bot">
              <div class="fu__position">
                <BaseTextfield
                  pholder=""
                  :label="lang.textfield.empPos.label"
                  v-model:text="employee.positionName"
                  v-model:noti="formNoti.positionName"
                  ref="positionNameRef"
                />
              </div>
            </div>
          </div>
          <div class="fu__right">
            <div class="fu__right__top">
              <div class="fu__dob">
                <BaseDatepicker
                  :label="lang.datepicker.empDob.label"
                  v-model:inputText="employee.dateOfBirth"
                  v-model:noti="formNoti.dateOfBirth"
                  ref="dateOfBirthRef"
                />
              </div>
              <div class="fu__gender">
                <BaseRadiogroup
                  :label="lang.radioGroup.empGender.label"
                  :options="[
                    { text: lang.radioGroup.empGender.male, value: 0 },
                    { text: lang.radioGroup.empGender.female, value: 1 },
                    { text: lang.radioGroup.empGender.other, value: 2 },
                  ]"
                  v-model:radioValue="employee.gender"
                />
              </div>
            </div>
            <div class="fu__right__mid">
              <div class="fu__cmnd">
                <BaseTextfield
                  pholder=""
                  :label="lang.textfield.empIdentity.label"
                  v-model:text="employee.identityNumber"
                  v-model:noti="formNoti.identityNumber"
                  :tooltip="lang.textfield.empIdentity.tooltip"
                  ref="identityNumberRef"
                />
              </div>
              <div class="fu__cmnddate">
                <BaseDatepicker
                  :label="lang.datepicker.empIdentityDate.label"
                  v-model:inputText="employee.identityDate"
                  v-model:noti="formNoti.identityDate"
                  ref="identityDateRef"
                />
              </div>
            </div>
            <div class="fu__right__bot">
              <div class="fu__cmndpos">
                <BaseTextfield
                  pholder=""
                  :label="lang.textfield.empIdentityPlace.label"
                  v-model:text="employee.identityPlace"
                  v-model:noti="formNoti.identityPlace"
                  ref="identityPlaceRef"
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
                :label="lang.textfield.empAddress.label"
                v-model:text="employee.address"
                v-model:noti="formNoti.address"
                ref="addressRef"
              />
            </div>
          </div>
          <div class="fl__mid">
            <div class="fl__phone">
              <BaseTextfield
                pholder=""
                :label="lang.textfield.empPhone.label"
                :tooltip="lang.textfield.empPhone.tooltip"
                v-model:text="employee.phoneNumber"
                v-model:noti="formNoti.phoneNumber"
                ref="phoneNumberRef"
              />
            </div>
            <div class="fl__homephone">
              <BaseTextfield
                pholder=""
                :label="lang.textfield.empLandline.label"
                :tooltip="lang.textfield.empLandline.tooltip"
                v-model:text="employee.landlineNumber"
                v-model:noti="formNoti.landlineNumber"
                ref="landlineNumberRef"
              />
            </div>
            <div class="fl__email">
              <BaseTextfield
                pholder=""
                :label="lang.textfield.empEmail.label"
                v-model:text="employee.email"
                v-model:noti="formNoti.email"
                ref="emailRef"
              />
            </div>
          </div>
          <div class="fl__bot">
            <div class="fl__bankacc">
              <BaseTextfield
                pholder=""
                :label="lang.textfield.empBankAcc.label"
                v-model:text="employee.bankAccount"
                v-model:noti="formNoti.bankAccount"
                ref="bankAccountRef"
              />
            </div>
            <div class="fl__bankname">
              <BaseTextfield
                pholder=""
                :label="lang.textfield.empBankName.label"
                v-model:text="employee.bankName"
                v-model:noti="formNoti.bankName"
                ref="bankNameRef"
              />
            </div>
            <div class="fl__bankarea">
              <BaseTextfield
                pholder=""
                :label="lang.textfield.empBankBranch.label"
                v-model:text="employee.bankBranch"
                v-model:noti="formNoti.bankBranch"
                ref="bankBranchRef"
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
            :bname="lang.button.cancel"
            class="btn--secondary"
            @keydown.tab.prevent="cancelBtnOnTabKeydown"
            @keydown.shift.tab.prevent="cancelBtnOnShiftTabKeydown"
            @click="cancelBtnOnClick"
          />
        </div>
        <div class="footer__right">
          <BaseButton
            :bname="lang.button.save"
            class="btn--secondary"
            ref="saveBtnRef"
            @click="btnSaveOnClick"
            @keydown.shift.tab.prevent="saveBtnOnShiftTabKeydown"
            @mouseenter="formTooltip.save = true"
            @mouseleave="formTooltip.save = false"
          />
          <BaseButton
            :bname="lang.button.saveAndAdd"
            class="btn--primary"
            ref="saveAndAddBtnRef"
            @keydown.tab.prevent="saveAndAddBtnOnTabKeydown"
            @keydown.shift.tab.prevent="saveAndAddBtnOnShiftTabKeydown"
            @click="btnSaveAndAddOnClick"
            @mouseenter="formTooltip.saveAndAdd = true"
            @mouseleave="formTooltip.saveAndAdd = false"
          />
          <div
            class="btn__tooltip btn__tooltip--save"
            v-show="formTooltip.save"
          >
            {{ lang.tooltip.save }}
          </div>
          <div
            class="btn__tooltip btn__tooltip--saveandadd"
            v-show="formTooltip.saveAndAdd"
          >
            {{ lang.tooltip.saveAndAdd }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// #region import
import BaseCombobox from "@/components/base/BaseCombobox.vue";
import BaseDatepicker from "@/components/base/BaseDatepicker.vue";
import BaseRadiogroup from "@/components/base/BaseRadiogroup.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseNotibox from "@/components/base/BaseNotibox.vue";
import $enum from "@/js/common/enum";
import { ref, inject, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Employee } from "../../../js/model/employee";
const $axios = inject("$axios");
import $api from "../../../js/api/index";
import { Department } from "@/js/model/department";
import $formatter from "../../../js/common/formater";
import $error from "../../../js/resources/error";
const lang = inject("$lang");
var _ = require("lodash");
import { onKeyStroke, useMagicKeys, whenever } from "@vueuse/core";
// #endregion

// #region init
const emits = defineEmits(["updateEmplist", "update:metadata"]);
const props = defineProps({
  metadata: Object,
});
const router = useRouter();
const route = useRoute();
var oldEmployee = null;
const form = ref({
  type: "",
  empId: "",
  isLoading: false,
  checkbox1: false,
  checkbox2: false,
});
const employee = ref({});
var firstErrorRef = null;
const formNoti = ref({
  showNotibox: false,
  notiboxType: "",
  notiboxMessage: "",

  employeeCode: "",
  employeeFullName: "",
  positionName: "",
  dateOfBirth: "",
  departmentName: "",
  identityNumber: "",
  identityDate: "",
  identityPlace: "",
  address: "",
  phoneNumber: "",
  landlineNumber: "",
  email: "",
  bankAccount: "",
  bankName: "",
  bankBranch: "",
});

const formDialog = ref({
  isShow: false,
});
const formTooltip = ref({
  help: false,
  close: false,
  save: false,
  saveAndAdd: false,
});
const employeeCodeRef = ref(null);
const employeeFullNameRef = ref(null);
const departmentNameRef = ref(null);
const positionNameRef = ref(null);
const dateOfBirthRef = ref(null);
const identityNumberRef = ref(null);
const identityDateRef = ref(null);
const identityPlaceRef = ref(null);
const addressRef = ref(null);
const phoneNumberRef = ref(null);
const landlineNumberRef = ref(null);
const emailRef = ref(null);
const bankAccountRef = ref(null);
const bankNameRef = ref(null);
const bankBranchRef = ref(null);

const dialogRef = ref(null);
const notiRef = ref(null);

const cancelBtnRef = ref(null);
const saveBtnRef = ref(null);
const saveAndAddBtnRef = ref(null);
const departmentList = ref([]);

resetFormState();
// #endregion

// #region hook
onMounted(async () => {
  try {
    if (form.value.type == $enum.form.infoType && !isUUID(form.value.empId)) {
      await router.replace("/employee");
      return;
    }
    form.value.isLoading = true;
    await getDataFromApi();
    form.value.isLoading = false;
    employeeCodeRef.value.refInput.focus();
  } catch (error) {
    form.value.isLoading = false;
    await handleResponseStatusCode(error.response.status, error);
  }
});

// Handle key event
const keys = useMagicKeys();
const { current } = useMagicKeys();

const { ctrl_s } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === "s" && e.type === "keydown") {
      e.preventDefault();
    }
  },
});

const ctrl_shift_s = keys["Ctrl+Shift+S"];

onKeyStroke("Escape", onEscapeKeydown, { dedupe: true });

whenever(ctrl_s, ctrlSCombination);

whenever(ctrl_shift_s, ctrlShiftSCombination);

// #endregion

// #region function

/**
 * Kiểm tra một string có phải UUID không
 *
 * Author: Dũng (11/06/2023)
 */
function isUUID(str) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}

/**
 * Reset giá trị employee và trạng thái form
 *
 * Author: Dũng (08/05/2023)
 */
function resetFormState() {
  form.value = {
    type: route.params.id
      ? $enum.form.infoType
      : props.metadata.isDupplicate
      ? $enum.form.dupplicateType
      : $enum.form.createType,
    empId: route.params.id ?? "",
    isLoading: false,
    checkbox1: false,
    checkbox2: false,
  };
  if (form.value.type == $enum.form.dupplicateType) {
    emits("update:metadata", {
      isDupplicate: false,
      employeeDupplicate: props.metadata.employeeDupplicate,
    });
  }
  employee.value = new Employee({});
}

/**
 * Quản lý các mã HTTP Code trả về sau khi gọi API
 * @param {code}
 * Author: Dũng (08/05/2023)
 */
async function handleResponseStatusCode(code, error) {
  formNoti.value.notiboxType = "alert";
  if (code == 400) {
    formNoti.value.notiboxMessage = $error.invalidInput;
    await displayNotiBox();
  } else if (code == 404) {
    await router.replace("/employee");
  } else {
    formNoti.value.notiboxMessage = error.response.data.UserMessage;
    await displayNotiBox();
  }
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
    formNoti.value.employeeCode = "";
    form.value.isLoading = false;
  } catch (error) {
    form.value.isLoading = false;
    await handleResponseStatusCode(error.response.status, error);
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
  return response.data;
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
    return;
  }

  if (form.value.type == $enum.form.infoType) {
    // Fetch employee information
    await fetchEmployeeInfoToEmployeeObject(form.value.empId, form.value.type);
    const oldEmp = new Employee({});
    oldEmp.cloneFromOtherEmployee(employee.value);
    oldEmployee = oldEmp;
    return;
  }

  if (form.value.type == $enum.form.dupplicateType) {
    // Fetch employee information
    const emp = new Employee({});
    emp.cloneFromOtherEmployee(props.metadata.employeeDupplicate);
    employee.value = emp;
    employee.value.employeeCode = "";
    employee.value.employeeId = "";
    await fetchNewEmployeeCode();
    return;
  }
}

/**
 * Validate các thông tin có trong form
 *
 * Author: Dũng (08/05/2023)
 */
async function validateData() {
  firstErrorRef = null;

  // Validate mã nhân viên
  // Mã trống
  if (employee.value.employeeCode.trim() == "") {
    employee.value.employeeCode = "";
    formNoti.value.employeeCode = $error.fieldCannotEmpty(
      lang.textfield.empCode.label
    );
    firstErrorRef = firstErrorRef ?? employeeCodeRef;
  } else {
    // Mã quá dài
    if (employee.value.employeeCode.length > 50) {
      formNoti.value.employeeCode = $error.fieldTooLong(
        lang.textfield.empCode.label,
        50
      );
      firstErrorRef = firstErrorRef ?? employeeCodeRef;
    } else {
      // Kiểm tra trùng mã
      const isCodeExist = await isEmpCodeExist(
        employee.value.employeeCode,
        form.value.empId
      );
      if (isCodeExist) {
        formNoti.value.employeeCode = $error.employeeCodeHasExist;
        firstErrorRef = firstErrorRef ?? employeeCodeRef;
      }
    }
  }
  // Kiểm tra tên nhân viên
  // Tên bị trống
  if (employee.value.employeeFullName.trim() == "") {
    formNoti.value.employeeFullName = $error.fieldCannotEmpty(
      lang.textfield.empName.label
    );
    firstErrorRef = firstErrorRef ?? employeeFullNameRef;
  } else {
    // Tên quá dài
    if (employee.value.employeeFullName.length > 100) {
      formNoti.value.employeeFullName = $error.fieldTooLong(
        lang.textfield.empName.label,
        100
      );
      firstErrorRef = firstErrorRef ?? employeeFullNameRef;
    }
  }

  // Kiểm tra thông tin đơn vị
  if (employee.value.departmentName.trim() == "") {
    formNoti.value.departmentName = $error.fieldCannotEmpty(
      lang.combobox.empDepart.label
    );
    firstErrorRef = firstErrorRef ?? departmentNameRef;
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
      formNoti.value.departmentName = $error.departmentNotInList;
      firstErrorRef = firstErrorRef ?? departmentNameRef;
    }
  }

  // Kiểm tra thông tin chức danh
  if (employee.value.positionName.length > 255) {
    formNoti.value.positionName = $error.fieldTooLong(
      lang.textfield.empPos.label,
      255
    );
    firstErrorRef = firstErrorRef ?? positionNameRef;
  }

  // Kiểm tra ngày sinh
  // Định dạng
  if (
    employee.value.dateOfBirth.length > 0 &&
    !$formatter.isValidDate(employee.value.dateOfBirth)
  ) {
    formNoti.value.dateOfBirth = $error.fieldWrongFormat(
      lang.datepicker.empDob.label
    );
    firstErrorRef = firstErrorRef ?? dateOfBirthRef;
  }
  // Ngày sinh ở tương lai
  if (
    employee.value.dateOfBirth.length > 0 &&
    $formatter.isValidDate(employee.value.dateOfBirth) &&
    !$formatter.isPastDate(employee.value.dateOfBirth)
  ) {
    formNoti.value.dateOfBirth = $error.fieldNotValid(
      lang.datepicker.empDob.label
    );
    firstErrorRef = firstErrorRef ?? dateOfBirthRef;
  }

  // Kiểm tra thông tin CMND
  if (!/^$|^\d{9}$|^\d{12}$/.test(employee.value.identityNumber)) {
    formNoti.value.identityNumber = $error.fieldWrongFormat(
      lang.textfield.empIdentity.label
    );
    firstErrorRef = firstErrorRef ?? identityNumberRef;
  }

  // Kiểm tra ngày cấp CMND
  if (
    employee.value.identityDate.length > 0 &&
    !$formatter.isValidDate(employee.value.identityDate)
  ) {
    formNoti.value.identityDate = $error.fieldWrongFormat(
      lang.datepicker.empIdentityDate.label
    );
    firstErrorRef = firstErrorRef ?? identityDateRef;
  }
  // Ngày cấp ở tương lai
  if (
    employee.value.identityDate.length > 0 &&
    $formatter.isValidDate(employee.value.identityDate) &&
    !$formatter.isPastDate(employee.value.identityDate)
  ) {
    formNoti.value.identityDate = $error.fieldNotValid(
      lang.datepicker.empIdentityDate.label
    );
    firstErrorRef = firstErrorRef ?? identityDateRef;
  }

  // Nơi cấp
  if (employee.value.identityPlace.length > 255) {
    formNoti.value.identityPlace = $error.fieldTooLong(
      lang.textfield.empIdentityPlace.label,
      255
    );
    firstErrorRef = firstErrorRef ?? identityPlaceRef;
  }

  // Địa chỉ
  if (employee.value.address.length > 255) {
    formNoti.value.address = $error.fieldTooLong(
      lang.textfield.empAddress.label,
      255
    );
    firstErrorRef = firstErrorRef ?? addressRef;
  }

  // Kiểm tra số điện thoại di động
  if (!/^$|^\+?\d{0,50}$/.test(employee.value.phoneNumber)) {
    formNoti.value.phoneNumber = $error.fieldWrongFormat(
      lang.textfield.empPhone.tooltip
    );
    firstErrorRef = firstErrorRef ?? phoneNumberRef;
  }

  // Kiểm tra số điện thoại cố định
  if (!/^$|^\+?\d{0,50}$/.test(employee.value.landlineNumber)) {
    formNoti.value.landlineNumber = $error.fieldWrongFormat(
      lang.textfield.empLandline.tooltip
    );
    firstErrorRef = firstErrorRef ?? landlineNumberRef;
  }
  // Kiểm tra Email
  // Email đúng định dạng
  if (!/^$|^\w+@\w+\..*\w$/.test(employee.value.email)) {
    formNoti.value.email = $error.fieldWrongFormat(
      lang.textfield.empEmail.label
    );
    firstErrorRef = firstErrorRef ?? emailRef;
  }

  // Email quá dài
  if (employee.value.email.length > 50) {
    formNoti.value.email = $error.fieldTooLong(
      lang.textfield.empEmail.label,
      50
    );
    firstErrorRef = firstErrorRef ?? emailRef;
  }

  // Kiểm tra số tài khoản ngân hàng
  if (!/^$|^\d{0,50}$/.test(employee.value.bankAccount)) {
    formNoti.value.bankAccount = $error.fieldWrongFormat(
      lang.textfield.empBankAcc.label
    );
    firstErrorRef = firstErrorRef ?? bankAccountRef;
  }

  // Kiểm tra tên ngân hàng
  if (employee.value.bankName.length > 255) {
    formNoti.value.bankName = $error.fieldTooLong(
      lang.textfield.empBankName.label,
      255
    );
    firstErrorRef = firstErrorRef ?? bankNameRef;
  }

  // Kiểm tra chi nhánh ngân hàng
  if (employee.value.bankBranch.length > 255) {
    formNoti.value.bankBranch = $error.fieldTooLong(
      lang.textfield.empBankBranch.label,
      255
    );
    if (firstErrorRef == null) firstErrorRef = bankBranchRef;
    // firstErrorRef =
    //   firstErrorRef ?? bankBranchRef;
  }

  if (firstErrorRef != null) {
    // Update notibox value
    formNoti.value.notiboxType = "alert";
    formNoti.value.notiboxMessage = $error.invalidInput;
  } else {
    formNoti.value.notiboxMessage = "";
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
 * Focus vào ô lỗi đầu tiên
 *
 * Author: Dũng (08/05/2023)
 */
function focusOnFirstErrorInput() {
  firstErrorRef.value.refInput.focus();
}

/**
 * Gọi API lấy thông tin nhân viên và gán vào employee object
 * @param {String} empId Id nhân viên
 *
 * Author: Dũng (08/05/2023)
 */
async function fetchEmployeeInfoToEmployeeObject(empId) {
  const response = await $axios.get($api.employee.one(empId));
  const empFromApi = response.data;

  employee.value = new Employee(empFromApi);

  // Gắn thông tin đơn vị vào Employee
  for (const department of departmentList.value) {
    if (department.departmentId == employee.value.departmentId) {
      employee.value.departmentName = department.departmentName;
      employee.value.departmentCode = department.departmentCode;
    }
  }
}

// #endregion

// #region handle event
/**
 * Sự kiện nhấn Escape
 *
 * Author: Dũng (02/06/2023)
 */
async function onEscapeKeydown() {
  if (formNoti.value.showNotibox) return;
  if (formDialog.value.isShow) return;
  await btnCloseOnClick();
}

/**
 * Sự kiện nhấn Ctrl S
 *
 * Author: Dũng (02/06/2023)
 */
async function ctrlSCombination() {
  if (current.has("shift")) return;
  if (formNoti.value.showNotibox) return;
  if (formDialog.value.isShow) return;
  if (firstErrorRef != null) firstErrorRef.value.refInput.blur();
  await btnSaveOnClick();
}

/**
 * Sự kiện nhấn Ctrl Shift S
 *
 * Author: Dũng (02/06/2023)
 */
async function ctrlShiftSCombination() {
  if (formNoti.value.showNotibox) return;
  if (formDialog.value.isShow) return;
  if (firstErrorRef != null) firstErrorRef.value.refInput.blur();
  await btnSaveAndAddOnClick();
}

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
 * Hiển thị notibox thông báo
 * Author: Duxng(03/06/2023)
 */
async function displayNotiBox() {
  formNoti.value.showNotibox = true;
  await nextTick();
  notiRef.value.yesBtn.refBtn.focus();
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

    if (formNoti.value.notiboxMessage.length) {
      form.value.isLoading = false;
      // show notibox
      await displayNotiBox();
    } else {
      if (form.value.type == $enum.form.infoType) {
        // edit employee
        await callEditEmployeeApi();
        emits("updateEmplist", "edit", employee.value);
      } else {
        // create or dupplicate employee
        const newEmployeeId = await callCreateEmployeeApi();
        employee.value.employeeId = newEmployeeId;
        emits("updateEmplist", "create", employee.value);
      }

      form.value.isLoading = false;
      router.replace("/employee");
    }
  } catch (error) {
    form.value.isLoading = false;
    await handleResponseStatusCode(error.response.status, error);
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
      await displayNotiBox();
    } else {
      if (form.value.type == $enum.form.infoType) {
        // edit employee
        await callEditEmployeeApi();
        emits("updateEmplist", "edit", employee.value);
      } else {
        // create or dupplicate employee
        const newEmployeeId = await callCreateEmployeeApi();
        employee.value.employeeId = newEmployeeId;
        emits("updateEmplist", "create", employee.value);
      }

      form.value.isLoading = false;
      // Reset anything
      await router.replace("/employee/create");
      resetFormState();
      await fetchNewEmployeeCode();
      employeeCodeRef.value.refInput.focus();
    }
  } catch (error) {
    form.value.isLoading = false;
    await handleResponseStatusCode(error.response.status, error);
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
async function formDialogCloseBtnOnClick() {
  formDialog.value.isShow = false;
  await nextTick();
  if (firstErrorRef != null) {
    focusOnFirstErrorInput();
  } else {
    employeeCodeRef.value.refInput.focus();
  }
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
  employeeCodeRef.value.refInput.focus();
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
  bankBranchRef.value.refInput.focus();
}
/**
 * Sự kiện shift tab của ô chi nhánh
 * Author: Dũng (08/05/2023)
 */
function bankAreaInputOnShiftTabKeyDown() {
  bankNameRef.value.refInput.focus();
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
 * Sự kiện click vào nút đóng form
 * Author: Dũng (08/05/2023)
 */
async function btnCloseOnClick() {
  if (_.isEqual(oldEmployee, employee.value)) {
    router.replace("/employee");
  }
  formDialog.value.isShow = true;
  await nextTick();
  await dialogRef.value.yesBtn.refBtn.focus();
}

// #endregion
</script>

<style
  scoped
  lang="css"
  src="../../../css/components/views/employee-management/employee-form.css"
></style>
