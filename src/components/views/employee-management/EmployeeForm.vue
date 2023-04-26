<template>
  <div class="wrapper wrapper--dark1 wrapper--form">
    <div class="form">
      <div class="form__header">
        <div class="header__left">
          <div class="header__title">Thông tin nhân viên</div>
          <div class="header__option1">
            <div class="checkbox mi mi-18"></div>
            <div class="checkbox__label">Là khách hàng</div>
          </div>
          <div class="header__option2">
            <div class="checkbox mi mi-18"></div>
            <div class="checkbox__label">Là nhà cung cấp</div>
          </div>
        </div>
        <div class="header__right">
          <BaseButton bname="" class="mi-36 btn--help" />
          <BaseButton
            bname=""
            class="mi-36 btn--close"
            @click="$emit('closeForm')"
          />
        </div>
      </div>
      <div class="form__body">
        <div class="form__upper">
          <div class="fu__left">
            <div class="fu__left__top">
              <div class="fu__index">
                <BaseTextfield pholder="" label="Mã" class="field--required" />
              </div>
              <div class="fu__name">
                <BaseTextfield pholder="" label="Tên" class="field--required" />
              </div>
            </div>
            <div class="fu__left__mid">
              <div class="fu__unit">
                <BaseCombobox label="Đơn vị" class="field--required" />
              </div>
            </div>
            <div class="fu__left__bot">
              <div class="fu__position">
                <BaseTextfield pholder="" label="Chức danh" />
              </div>
            </div>
          </div>
          <div class="fu__right">
            <div class="fu__right__top">
              <div class="fu__dob">
                <BaseDatepicker label="Ngày sinh" />
              </div>
              <div class="fu__gender">
                <BaseRadiogroup
                  label="Giới tính"
                  :options="['Nam', 'Nữ', 'Khác']"
                />
              </div>
            </div>
            <div class="fu__right__mid">
              <div class="fu__cmnd">
                <BaseTextfield pholder="" label="Số CMND" />
              </div>
              <div class="fu__cmnddate">
                <BaseDatepicker label="Ngày cấp" />
              </div>
            </div>
            <div class="fu__right__bot">
              <div class="fu__cmndpos">
                <BaseTextfield pholder="" label="Nơi cấp" />
              </div>
            </div>
          </div>
        </div>

        <div class="form__lower">
          <div class="fl__top">
            <div class="fl__address">
              <BaseTextfield pholder="" label="Địa chỉ" />
            </div>
          </div>
          <div class="fl__mid">
            <div class="fl__phone">
              <BaseTextfield pholder="" label="ĐT di động" />
            </div>
            <div class="fl__homephone">
              <BaseTextfield pholder="" label="ĐT cố định" />
            </div>
            <div class="fl__email">
              <BaseTextfield pholder="" label="Email" />
            </div>
          </div>
          <div class="fl__bot">
            <div class="fl__bankacc">
              <BaseTextfield pholder="" label="Tài khoản ngân hàng" />
            </div>
            <div class="fl__bankname">
              <BaseTextfield pholder="" label="Tên ngân hàng" />
            </div>
            <div class="fl__bankarea">
              <BaseTextfield pholder="" label="Chi nhánh" />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="form__footer">
        <div class="footer__left">
          <BaseButton bname="Hủy" class="btn--secondary" />
        </div>
        <div class="footer__right">
          <BaseButton bname="Cất" class="btn--secondary" />
          <BaseButton bname="Cất và Thêm" class="btn--primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseCombobox from "@/components/base/BaseCombobox.vue";
import BaseDatepicker from "@/components/base/BaseDatepicker.vue";
import BaseRadiogroup from "@/components/base/BaseRadiogroup.vue";
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
</style>
