<template>
  <div class="tablebox">
    <table
      class="m-table"
      :style="{
        'z-index': !isLoadingData && rowList.length <= 6 ? 30 : 0,
      }"
    >
      <thead>
        <tr>
          <th class="th1--sticky">
            <div class="align-center mw-40">
              <div
                class="t__checkbox mi-24"
                :class="[selectedEmpIds.length > 0 ? 'selected' : '']"
                @click="thCheckboxOnClick"
              >
                <i class="fas fa-minus"></i>
              </div>
            </div>
          </th>
          <th><div class="text-left mw-100">Mã nhân viên</div></th>
          <th><div class="text-left mw-200">Tên nhân viên</div></th>
          <th><div class="text-left mw-70">Giới tính</div></th>
          <th><div class="text-left mw-80">Ngày sinh</div></th>
          <th class="zindex--3">
            <div class="text-left mw-120">
              <span
                class="text"
                @mouseenter="thOnMouseEnter('isShowIdentityNumber')"
                @mouseleave="thOnMouseLeave('isShowIdentityNumber')"
              >
                Số CMND
              </span>
              <div class="th__tooltip" v-show="tooltip.isShowIdentityNumber">
                Số chứng minh nhân dân
              </div>
            </div>
          </th>
          <th><div class="text-left mw-150">Chức danh</div></th>
          <th><div class="text-left mw-200">Tên đơn vị</div></th>
          <th><div class="text-left mw-150">Số tài khoản</div></th>
          <th><div class="text-left mw-150">Tên ngân hàng</div></th>
          <th class="zindex--3">
            <div class="text-left mw-200">
              <span
                class="text"
                @mouseenter="thOnMouseEnter('isShowBankPlace')"
                @mouseleave="thOnMouseLeave('isShowBankPlace')"
              >
                Chi nhánh TK ngân hàng
              </span>
              <div class="th__tooltip" v-show="tooltip.isShowBankPlace">
                Chi nhánh tài khoản ngân hàng
              </div>
            </div>
          </th>
          <th class="thn--sticky">
            <div class="text-left mw-80">Chức năng</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="isLoadingData">
          <tr v-for="i in Math.min(15, pagingData.pageSize)" :key="i">
            <td class="td1--sticky"><div class="loading-item"></div></td>
            <td v-for="j in 10" :key="j">
              <div class="loading-item"></div>
            </td>
            <td class="tdn--sticky">
              <div class="loading-item"></div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            v-for="({ active, selected, emp } = row, index) in rowList"
            :key="emp.employeeId"
            :class="{
              active: active,
            }"
            @click="trOnClick(index)"
            @dblclick="trOnDblclick(emp.employeeId)"
          >
            <td class="td1--sticky" @dblclick.stop>
              <div class="align-center">
                <div
                  class="t__checkbox mi-24"
                  :class="{
                    selected: selected,
                  }"
                  @click.stop="checkBoxOnClick(index)"
                >
                  <i class="fas fa-check"></i>
                </div>
              </div>
            </td>
            <td>
              <div class="text-left">{{ emp.employeeCode }}</div>
            </td>
            <td>
              <div class="text-left">{{ emp.fullName }}</div>
            </td>
            <td>
              <div class="text-left">{{ emp.genderName }}</div>
            </td>
            <td>
              <div class="text-left">
                {{ $formatter.changeFormat(emp.dateOfBirth) }}
              </div>
            </td>
            <td>
              <div class="text-right">{{ emp.identityNumber }}</div>
            </td>
            <td>
              <div class="text-left">{{ emp.positionName }}</div>
            </td>
            <td>
              <div class="text-left">{{ emp.departmentName }}</div>
            </td>
            <td><div class="text-right">231239485923</div></td>
            <td><div class="text-left">BIDV</div></td>
            <td><div class="text-left">Cầu Giấy</div></td>
            <td
              :class="[table.expandEmpId == emp.employeeId ? 'above' : '']"
              class="tdn--sticky"
              @dblclick.stop
            >
              <div class="t__optionbox align-center">
                <button
                  class="option__edit"
                  @click="btnEditOnClick(emp.employeeId)"
                >
                  Sửa
                </button>
                <button
                  class="btn__expand mi mi-16 mi-expand-down"
                  @click="btnExpandOnClick(emp.employeeId)"
                ></button>
                <ul
                  class="actions-list btn__expand"
                  :class="
                    (emp.employeeId ==
                      rowList[rowList.length - 1].emp.employeeId ||
                      emp.employeeId ==
                        rowList[rowList.length - 2].emp.employeeId) &&
                    rowList.length > 6
                      ? 'action-list--top'
                      : ''
                  "
                  v-show="table.expandEmpId == emp.employeeId"
                  @mouseleave="table.expandEmpId = ''"
                >
                  <li><div class="li-data">Nhân bản</div></li>
                  <li>
                    <div
                      class="li-data"
                      @click="deleteEmployeeFunction(emp.employeeId)"
                    >
                      Xóa
                    </div>
                  </li>
                  <li><div class="li-data">Ngừng sử dụng</div></li>
                </ul>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="table__pag">
      <div class="pag__leftside">
        <span
          >Tổng số: <strong>{{ pagingData.totalRecord }}</strong> bản ghi</span
        >
      </div>
      <div class="pag__rightside">
        <div class="pag__recordcount">
          <div
            class="record__amount__select"
            v-show="table.recordAmountOpen"
            :class="[
              pagingData.curAmount > 3
                ? 'record__amount__select--top'
                : 'record__amount__select--bottom',
            ]"
          >
            <ul>
              <li
                v-for="recordAmount in table.recordAmountList"
                :key="recordAmount"
              >
                <div
                  class="record__amount__option"
                  :class="[
                    recordAmount == pagingData.pageSize
                      ? 'amount--selected'
                      : '',
                  ]"
                  @click="recordAmountOptionOnClick(recordAmount)"
                >
                  {{ recordAmount }} bản ghi trên 1 trang
                </div>
              </li>
            </ul>
          </div>
          <span>Số bản ghi / trang: {{ pagingData.pageSize }}</span>
          <div
            class="pag__arrowdown mi mi-24 mi-arrowdown-small"
            :class="[
              table.recordAmountOpen
                ? 'mi-arrowup-small'
                : 'mi-arrowdown-small',
            ]"
            @click="pagArrowdownOnClick"
          ></div>
        </div>
        <div class="pag__info">
          {{
            pagingData.pageSize * (pagingData.pageNumber - 1) +
            (rowList.length > 0 ? 1 : 0)
          }}
          -
          <span v-show="!isLoadingData">
            <strong>{{
              pagingData.pageSize * (pagingData.pageNumber - 1) +
              pagingData.curAmount
            }}</strong>
          </span>
          <span v-show="isLoadingData"><strong>xx</strong> </span>
          bản ghi
        </div>
        <div
          class="pag__prev mi mi-24 mi-arrowleft"
          @click="prevPageOnClick"
        ></div>
        <div
          class="pag__next mi mi-24 mi-arrowright"
          @click="nextPageOnClick"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import $formatter from "@/js/common/formater";
const router = useRouter();

const props = defineProps({
  pagingData: Object,
  isLoadingData: Boolean,
  rowList: Array,
  deleteEmployeeFunction: Function,
  pagingNextPage: Function,
  pagingPrevPage: Function,
  selectedEmpIds: Array,
});

const emits = defineEmits(["updatePagingData", "updateRowStatus"]);

const table = ref({
  recordAmountOpen: false,
  recordAmountList: [10, 20, 30, 50, 100],
  expandEmpId: "",
});

const tooltip = ref({
  isShowIdentityNumber: false,
  isShowBankPlace: false,
});

function thCheckboxOnClick() {
  emits("updateRowStatus", {
    type: "toggleAll",
    rowIndex: "",
  });
}

/**
 * Mouse leave khỏi ô th có tooltip
 * @param {String} name tên tooltip của ô th
 * Author: Dũng (08/05/2023)
 */
function thOnMouseLeave(name) {
  tooltip.value[name] = false;
}

/**
 * Mouse enter vào ô th có tooltip
 * @param {String} name tên tooltip của ô th
 * Author: Dũng (08/05/2023)
 */
function thOnMouseEnter(name) {
  tooltip.value[name] = true;
}

/**
 * Click next chuyển trang
 * Author: Dũng (08/05/2023)
 */
async function nextPageOnClick() {
  if (
    (props.pagingData.pageNumber - 1) * props.pagingData.pageSize +
      props.pagingData.curAmount >=
    props.pagingData.totalRecord
  )
    return;
  await props.pagingNextPage();
}

/**
 * Click prev chuyển trang
 * Author: Dũng (08/05/2023)
 */
async function prevPageOnClick() {
  if (props.pagingData.pageNumber <= 1) return;
  await props.pagingPrevPage();
  console.log("Prev");
}

/**
 * Click vào btn sửa nhân viên
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function btnEditOnClick(empId) {
  router.push(`/employee/${empId}`);
}

/**
 * Click vào nút mở rộng của một nhân viên
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function btnExpandOnClick(empId) {
  if (table.value.expandEmpId == empId) {
    table.value.expandEmpId = "";
  } else {
    table.value.expandEmpId = empId;
  }
}

/**
 * Click chọn số lượng bản ghi/trang
 * @param {Number} recordAmount số lượng bản ghi/trang
 * Author: Dũng (08/05/2023)
 */
function recordAmountOptionOnClick(recordAmount) {
  emits("updatePagingData", {
    totalRecord: props.pagingData.totalRecord,
    curAmount: props.pagingData.curAmount,
    pageSize: recordAmount,
    pageNumber: 1,
  });
  table.value.recordAmountOpen = false;
}

/**
 * Click mở menu chọn số lượng bản ghi/trang
 * Author: Dũng (08/05/2023)
 */
function pagArrowdownOnClick() {
  table.value.recordAmountOpen = !table.value.recordAmountOpen;
}

/**
 * Click vào checkbox
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function checkBoxOnClick(rowIndex) {
  emits("updateRowStatus", {
    type: "selected",
    rowIndex: rowIndex,
  });
}

/**
 * Click vào tr
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function trOnClick(rowIndex) {
  emits("updateRowStatus", {
    type: "active",
    rowIndex: rowIndex,
  });
}

/**
 * DblClick vào checkbox
 * @param {String} empId Id nhân viên
 * Author: Dũng (08/05/2023)
 */
function trOnDblclick(empId) {
  router.push(`/employee/${empId}`);
}
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
  transform: translate3d(0, 0, 0);
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
  user-select: none;
  position: relative;
}

td {
  border-left: none;
  border-top: none;
  border-bottom: 1px solid #c7c7c7;
  border-right: 1px solid #c7c7c7;
  height: 48px;
  padding: 0 12px;
}

th {
  border-bottom: 1px solid #c7c7c7;
  border-right: 1px solid #c7c7c7;
  height: 48px;
  padding: 0 12px;
  background-color: #e5e8ec;
  position: sticky;
  top: -1px;
  z-index: 2;
}

tbody tr {
  background-color: #fff;
}

.th1--sticky {
  position: sticky;
  left: -1px;
  z-index: 5;
}

.thn--sticky {
  position: sticky;
  right: -1px;
  z-index: 9;
  border-left: 1px solid #c7c7c7;
}

.td1--sticky {
  position: sticky;
  left: -1px;
  background-color: inherit;
  z-index: 4;
}

.tdn--sticky {
  position: sticky;
  right: -1px;
  background-color: inherit;
  border-left: 1px solid #c7c7c7;
  z-index: 4;
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
  list-style-type: none;
  top: 36px;
  width: 130px;
  right: 5px;
  background-color: #fff;
  z-index: 30;
}

.action-list--top {
  top: unset;
  bottom: 38px;
}

.actions-list > li:hover {
  background-color: var(--clr-t-border);
  color: var(--clr-lg500);
  cursor: pointer;
}

.above {
  z-index: 8;
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
  border-left: unset;
  position: sticky;
  left: 0;
  z-index: 20;
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

.pag__recordcount span {
  width: 150px;
}

.record__amount__select {
  width: 100%;
  background-color: #fff;
  border: 1px solid var(--clr-t-border);
  box-shadow: 2px 2px 4px gray;
  position: absolute;
  left: 0;
}

.record__amount__select--top {
  bottom: calc(100% + 14px);
}

.record__amount__select--bottom {
  top: calc(100% + 14px);
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
tbody tr:hover {
  background-color: #f2f9ff;
}

.record__amount__option:not(.amount--selected):hover {
  background-color: var(--clr-lg200);
}
tr.active {
  background-color: #e5f3ff;
}

td:has(.loading-item) {
  padding: 12px 20px;
}
.loading-item {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: #ededed;
  background: linear-gradient(
      to right,
      rgba(100, 100, 100, 0.2) 10%,
      rgba(255, 255, 255, 0) 40%,
      rgba(100, 100, 100, 0.3) 80%
    )
    #ededed;
  background-size: 200% 100%;
  background-position-x: 0%;
  animation: loading;
  animation-duration: 0.5s;
  animation-direction: alternate-reverse;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes loading {
  100% {
    background-position-x: 80%;
  }
}

.th__tooltip {
  position: absolute;
  top: 36px;
  left: -8px;
  padding: 2px;
  border-radius: 4px;
  width: max-content;
  color: #fff;
  background-color: #393a3d;
  font-weight: 400;
}

.zindex--3 {
  z-index: 3;
}
</style>
