<template>
  <div class="tablebox">
    <div class="loader__container" v-show="isLoadingData">
      <BaseLoader />
    </div>
    <div class="table__wrapper" v-show="!isLoadingData">
      <table class="m-table">
        <thead>
          <tr>
            <th>
              <div class="align-center mw-40">
                <div class="t__checkbox mi-24">
                  <i class="fas fa-minus"></i>
                </div>
              </div>
            </th>
            <th><div class="text-left mw-100">Mã nhân viên</div></th>
            <th><div class="text-left mw-200">Tên nhân viên</div></th>
            <th><div class="text-left mw-70">Giới tính</div></th>
            <th><div class="text-left mw-70">Ngày sinh</div></th>
            <th><div class="text-left mw-100">Số CMND</div></th>
            <th><div class="text-left mw-150">Chức danh</div></th>
            <th><div class="text-left mw-200">Tên đơn vị</div></th>
            <th><div class="text-left mw-150">Số tài khoản</div></th>
            <th><div class="text-left mw-150">Tên ngân hàng</div></th>
            <th><div class="text-left mw-200">Chi nhánh TK ngân hàng</div></th>
            <th><div class="text-left mw-80">Chức năng</div></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="emp in empList"
            :key="emp.EmployeeId"
            :class="{
              active: emp.active,
            }"
            @click="trOnClick(emp.EmployeeId)"
          >
            <td>
              <div class="tb-item align-center">
                <div
                  class="t__checkbox mi-24"
                  :class="{
                    selected: emp.selected,
                  }"
                  @click="checkBoxOnClick(emp.EmployeeId)"
                >
                  <i class="fas fa-check"></i>
                </div>
              </div>
            </td>
            <td>
              <div class="tb-item text-left">{{ emp.EmployeeCode }}</div>
            </td>
            <td>
              <div class="tb-item text-left">{{ emp.FullName }}</div>
            </td>
            <td>
              <div class="tb-item text-left">{{ emp.GenderName }}</div>
            </td>
            <td>
              <div class="tb-item text-left">{{ emp.DateOfBirth }}</div>
            </td>
            <td>
              <div class="tb-item text-left">{{ emp.IdentityNumber }}</div>
            </td>
            <td>
              <div class="tb-item text-left">{{ emp.PositionName }}</div>
            </td>
            <td>
              <div class="tb-item text-left">{{ emp.DepartmentName }}</div>
            </td>
            <td><div class="tb-item text-left">231239485923</div></td>
            <td><div class="tb-item text-left">BIDV</div></td>
            <td><div class="tb-item text-left">Cầu Giấy</div></td>
            <td>
              <div class="t__optionbox">
                <button class="option__edit">Sửa</button>
                <button class="btn__expand mi mi-16 mi-expand-down"></button>
                <ul class="actions-list btn__expand">
                  <li><div class="li-data">Nhân bản</div></li>
                  <li><div class="li-data">Xóa</div></li>
                  <li><div class="li-data">Ngừng sử dụng</div></li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table__pag" v-show="!isLoadingData">
      <div class="pag__leftside">
        <span>Tổng số: <strong>20</strong> bản ghi</span>
      </div>
      <div class="pag__rightside">
        <div class="pag__recordcount">
          <div class="record__amount__select display--none">
            <ul>
              <li>
                <div class="record__amount__option">
                  10 bản ghi trên 1 trang
                </div>
              </li>
              <li>
                <div class="record__amount__option amount--selected">
                  20 bản ghi trên 1 trang
                </div>
              </li>
              <li>
                <div class="record__amount__option">
                  30 bản ghi trên 1 trang
                </div>
              </li>
              <li>
                <div class="record__amount__option">
                  50 bản ghi trên 1 trang
                </div>
              </li>
              <li>
                <div class="record__amount__option">
                  100 bản ghi trên 1 trang
                </div>
              </li>
            </ul>
          </div>
          <span>Số bản ghi / trang: 20</span>
          <div class="pag__arrowdown mi mi-24 mi-arrowdown-small"></div>
        </div>
        <div class="pag__info">
          <span>1 - <strong>20</strong> bản ghi</span>
        </div>
        <div class="pag__prev mi mi-24 mi-arrowleft"></div>
        <div class="pag__next mi mi-24 mi-arrowright"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from "vue";
import BaseLoader from "./BaseLoader.vue";

const $axios = inject("$axios");
const empList = ref([]);
const isLoadingData = ref(false);
defineExpose({
  loadData,
});

function checkBoxOnClick(empId) {
  for (const emp of empList.value) {
    if (emp.EmployeeId == empId) {
      emp.selected = !emp.selected;
      if (emp.selected == false) {
        emp.active = false;
      }
    }
  }
}

function trOnClick(empId) {
  for (const emp of empList.value) {
    if (emp.EmployeeId == empId || emp.selected) {
      emp.active = true;
    } else {
      emp.active = false;
    }
  }
}

function loadData() {
  isLoadingData.value = true;
  $axios
    .get("https://cukcuk.manhnv.net/api/v1/Employees")
    .then(function (response) {
      // handle success
      isLoadingData.value = false;
      empList.value = response.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
loadData();
</script>

<style scoped>
/* Loader container */

.loader__container {
  height: 100%;
}

.tablebox {
  width: 100%;
  min-height: 200px;
  flex: 1;
  margin-top: 24px;
  max-width: 100%;
  overflow: auto;
  position: relative;
}

.tablebox::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: transparent;
}

.tablebox::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.tablebox::-webkit-scrollbar-thumb {
  background-color: var(--clr-t-border);
}

.m-table {
  min-width: 100%;
  table-layout: fixed;
  border-spacing: 0;
  border-collapse: separate;
  transform: translate3d(0, 0, 0);
}

.m-table th,
.m-table td {
  border-style: solid;
  border-width: 1px;
  border-left: none;
  border-top: none;
  border-bottom-color: #c7c7c7;
  border-right-color: #c7c7c7;
  height: 48px;
  padding: 0 12px;
}

.m-table thead th {
  background-color: #e5e8ec;
  position: sticky;
  top: -1px;
  z-index: 2;
}

.m-table tbody tr {
  background-color: #fff;
}

.m-table tbody td:first-child {
  position: sticky;
  left: -1px;
  background-color: inherit;
  border-left: 1px solid var(--clr-t-border);
}

.m-table thead th:first-child {
  position: sticky;
  left: -1px;
  z-index: 4;
}

.m-table tbody td:last-child {
  position: sticky;
  right: -1px;
  background-color: inherit;
  border-left: 1px solid #c7c7c7;
}
.m-table thead th:last-child {
  position: sticky;
  right: -1px;
  z-index: 4;
  border-left: 1px solid #c7c7c7;
}

.t__optionbox {
  display: flex;
}

.t__optionbox button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.actions-list {
  position: absolute;
  border: 1px solid var(--clr-t-border);
  display: none;
  list-style-type: none;
  top: 36px;
  width: 130px;
  right: 5px;
  background-color: #fff;
}

.activee {
  display: block;
}

.actions-list > li:hover {
  background-color: var(--clr-t-border);
  color: var(--clr-lg500);
  cursor: pointer;
}

.above {
  z-index: 1;
}

.btn__expand {
  margin-left: 5px;
}

.li-data {
  padding: 8px;
}

.option__edit {
  color: rgb(55, 127, 223);
  font-weight: 500;
}

/* Table pagination */

.table__pag {
  width: 100%;
  border: none;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fff;
  border: 1px solid var(--clr-t-border);
  position: sticky;
  left: 0;
  bottom: -1px;
}

.pag__leftside {
  display: flex;
  align-items: center;
}

.pag__rightside {
  display: flex;
  justify-content: space-between;
  column-gap: 16px;
  align-items: center;
}

.pag__recordcount {
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding: 0 12px;
  position: relative;
}

.record__amount__select {
  width: 100%;
  background-color: #fff;
  border: 1px solid var(--clr-t-border);
  box-shadow: 2px 2px 4px gray;
  position: absolute;
  bottom: calc(100% + 14px);
  left: 0;
}

.record__amount__select > ul {
  list-style-type: none;
  padding: 4px 0;
}

.record__amount__option {
  height: 36px;
  line-height: 36px;
  padding-left: 8px;
  background-color: #fff;
  cursor: pointer;
}

.amount--selected {
  color: #fff;
  background-color: var(--clr-lg500);
}

.pag__prev {
  border-radius: 4px;
}
.pag__next {
  border-radius: 4px;
}

/* Check box */

.t__checkbox {
  border-radius: 4px;
  border: 2px solid gray;
  cursor: pointer;
  text-align: center;
  line-height: 24px;
  background-color: #fff;
  color: #fff;
}

.t__checkbox.selected {
  border: none;
  background-color: var(--clr-lg400);
}

/* Animation */
.m-table tbody tr:hover {
  background-color: #f2f9ff;
}

.tr--selected {
  background-color: #b7d9f8 !important;
}

.record__amount__option:not(.amount--selected):hover {
  background-color: var(--clr-lg200);
}
.m-table tbody tr.active {
  background-color: #e5f3ff;
}
</style>
