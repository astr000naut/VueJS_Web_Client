<template>
  <div class="wrapper wrapper--dark1 wrapper--form">
    <div class="form__dialog" v-show="formDialog.isShow">
      <BaseDialog
        title="Lưu lại thay đổi"
        :close-on-click="formDialogCloseBtnOnClick"
        :no-on-click="formDialogNoBtnOnClick"
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
                ? "Thông tin nhân viên"
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
                  label="Mã"
                  :isrequired="true"
                  v-model:text="form.empCode"
                  ref="empCodeRef"
                />
              </div>
              <div class="fu__name">
                <BaseTextfield
                  pholder=""
                  label="Tên"
                  :isrequired="true"
                  v-model:text="form.empFullName"
                />
              </div>
            </div>
            <div class="fu__left__mid">
              <div class="fu__unit">
                <BaseCombobox
                  label="Đơn vị"
                  :isrequired="true"
                  :option-list="departmentList"
                  v-model:text="form.empDepartmentName"
                />
              </div>
            </div>
            <div class="fu__left__bot">
              <div class="fu__position">
                <BaseTextfield
                  pholder=""
                  label="Chức danh"
                  v-model:text="form.empPositionName"
                />
              </div>
            </div>
          </div>
          <div class="fu__right">
            <div class="fu__right__top">
              <div class="fu__dob">
                <BaseDatepicker
                  label="Ngày sinh"
                  v-model:inputText="form.empDateOfBirth"
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
                  v-model:radioValue="form.empGender"
                />
              </div>
            </div>
            <div class="fu__right__mid">
              <div class="fu__cmnd">
                <BaseTextfield
                  pholder=""
                  label="Số CMND"
                  v-model:text="form.empIdentityNumber"
                  tooltip="Số chứng minh nhân dân"
                />
              </div>
              <div class="fu__cmnddate">
                <BaseDatepicker
                  label="Ngày cấp"
                  v-model:inputText="form.empIdentityDate"
                />
              </div>
            </div>
            <div class="fu__right__bot">
              <div class="fu__cmndpos">
                <BaseTextfield
                  pholder=""
                  label="Nơi cấp"
                  v-model:text="form.empIdentityPlace"
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
                v-model:text="form.empAddress"
              />
            </div>
          </div>
          <div class="fl__mid">
            <div class="fl__phone">
              <BaseTextfield
                pholder=""
                label="ĐT di động"
                tooltip="Số điện thoại di động"
                v-model:text="form.empPhoneNumber"
              />
            </div>
            <div class="fl__homephone">
              <BaseTextfield
                pholder=""
                label="ĐT cố định"
                tooltip="Số điện thoại cố định"
                v-model:text="form.empLandlineNumber"
              />
            </div>
            <div class="fl__email">
              <BaseTextfield
                pholder=""
                label="Email"
                v-model:text="form.empEmail"
              />
            </div>
          </div>
          <div class="fl__bot">
            <div class="fl__bankacc">
              <BaseTextfield
                pholder=""
                label="Tài khoản ngân hàng"
                v-model:text="form.empBankAcc"
              />
            </div>
            <div class="fl__bankname">
              <BaseTextfield
                pholder=""
                label="Tên ngân hàng"
                v-model:text="form.empBankName"
              />
            </div>
            <div class="fl__bankarea">
              <BaseTextfield
                pholder=""
                label="Chi nhánh"
                v-model:text="form.empBankPlace"
                ref="bankAreaInputRef"
                @keydown.tab.prevent="bankAreaInputOnTabKeyDown"
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
            @click="cancelBtnOnClick"
          />
        </div>
        <div class="footer__right">
          <BaseButton
            bname="Cất"
            class="btn--secondary"
            ref="saveBtnRef"
            @click="btnSaveOnClick"
          />
          <BaseButton
            bname="Cất và Thêm"
            class="btn--primary"
            @keydown.tab.prevent="saveAndAddBtnOnTabKeydown"
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
import $enum from "@/js/common/enum";
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import $formatter from "@/js/common/formater";
const $axios = inject("$axios");

const router = useRouter();
const route = useRoute();
const form = ref({
  type: "",
  isLoading: false,
  checkbox1: false,
  checkbox2: false,
  empId: "",
  empCode: "",
  empFullName: "",
  empDepartmentCode: "",
  empDepartmentName: "",
  empPositionId: "",
  empPositionName: "",
  empDateOfBirth: "",
  empGender: -1,
  empGenderName: "",
  empIdentityNumber: "",
  empIdentityDate: "",
  empIdentityPlace: "",
  empAddress: "",
  empPhoneNumber: "",
  empLandlineNumber: "",
  empEmail: "",
  empBankAcc: "",
  empBankName: "",
  empBankPlace: "",
});
const formDialog = ref({
  isShow: false,
});
const empCodeRef = ref(null);
const cancelBtnRef = ref(null);
const saveBtnRef = ref(null);
const bankAreaInputRef = ref(null);
const departmentList = ref([]);

initState();

onMounted(async () => {
  form.value.isLoading = true;
  await getDataFromApi();
  form.value.isLoading = false;
  empCodeRef.value.refInput.focus();
});

function initState() {
  if (route.params.id) {
    form.value.type = $enum.form.infoType;
    form.value.empId = route.params.id;
  } else {
    form.value.type = $enum.form.createType;
  }
}

async function getDataFromApi() {
  try {
    // Fetch Department List
    const departmentApiResponse = await $axios.get($enum.api.departments);
    departmentList.value = departmentApiResponse.data;

    if (form.value.type == $enum.form.createType) {
      // Fetch new employee code
      const response = await $axios.get($enum.api.employees.newCode);
      form.value.empCode = response.data;
    } else {
      // Fetch employee information
      await getEmployee(form.value.empId);
    }
  } catch (error) {
    console.log(error);
  }
}

function btnSaveOnClick() {
  console.log(form.value);
}

function formDialogCloseBtnOnClick() {
  formDialog.value.isShow = false;
}

function formDialogNoBtnOnClick() {
  formDialog.value.isShow = false;
  router.replace("/employee");
}

function cancelBtnOnClick() {
  router.replace("/employee");
}

function cancelBtnOnTabKeydown() {
  empCodeRef.value.refInput.focus();
}

function bankAreaInputOnTabKeyDown() {
  saveBtnRef.value.refBtn.focus();
}

function saveAndAddBtnOnTabKeydown() {
  cancelBtnRef.value.refBtn.focus();
}

async function getEmployee(empId) {
  try {
    const response = await $axios.get($enum.api.employees.one(empId));
    const data = response.data;
    form.value.empCode = data.EmployeeCode;
    form.value.empFullName = data.FullName;
    form.value.empDepartmentName = data.DepartmentName ?? "";
    form.value.empDepartmentCode = data.DepartmentCode;
    form.value.empPositionId = data.PositionId;
    form.value.empPositionName = data.empPositionName;
    form.value.empDateOfBirth = $formatter.changeFormat(data.DateOfBirth);
    form.value.empGender = data.Gender;
    form.value.empGenderName = data.GenderName;
    form.value.empIdentityNumber = data.IdentityNumber;
    form.value.empIdentityDate = $formatter.changeFormat(data.IdentityDate);
    form.value.empIdentityPlace = data.IdentityPlace;
    form.value.empAddress = data.Address;
    form.value.empPhoneNumber = data.PhoneNumber;
    form.value.empLandlineNumber = "sample";
    form.value.empEmail = data.Email;
    form.value.empBankAcc = "sample";
    form.value.empBankName = "sample";
    form.value.empBankPlace = "sample";
  } catch (error) {
    console.log(error);
  }
}

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
  flex: 1;
}

.fu__name {
  flex: 2;
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

.form__dialog {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #88888893;
  z-index: 12;
}
</style>
