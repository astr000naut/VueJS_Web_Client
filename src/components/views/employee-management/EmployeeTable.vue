<template>
  <div class="tablebox">
    <div class="loader__container" v-show="false">
      <BaseLoader />
    </div>
    <div class="table__wrapper">
      <table class="m-table">
        <thead>
          <tr>
            <th class="th1--sticky">
              <div class="align-center mw-40">
                <div class="t__checkbox mi-24">
                  <i class="fas fa-minus"></i>
                </div>
              </div>
            </th>
            <th><div class="text-left mw-100">Mã nhân viên</div></th>
            <th><div class="text-left mw-200">Tên nhân viên</div></th>
            <th><div class="text-left mw-70">Giới tính</div></th>
            <th><div class="text-left mw-80">Ngày sinh</div></th>
            <th><div class="text-left mw-120">Số CMND</div></th>
            <th><div class="text-left mw-150">Chức danh</div></th>
            <th><div class="text-left mw-200">Tên đơn vị</div></th>
            <th><div class="text-left mw-150">Số tài khoản</div></th>
            <th><div class="text-left mw-150">Tên ngân hàng</div></th>
            <th><div class="text-left mw-200">Chi nhánh TK ngân hàng</div></th>
            <th class="thn--sticky">
              <div class="text-left mw-80">Chức năng</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="props.isLoadingData">
            <tr v-for="i in Math.min(15, props.pagingData.pageSize)" :key="i">
              <td v-for="j in 11" :key="j">
                <div class="loading-item"></div>
              </td>
              <td class="tdn--sticky">
                <div class="loading-item"></div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="emp in props.empList"
              :key="emp.EmployeeId"
              :class="{
                active: emp.active,
              }"
              @click="trOnClick(emp.EmployeeId)"
              @dblclick="trOnDblclick(emp.EmployeeId)"
            >
              <td class="td1--sticky" @dblclick.stop>
                <div class="align-center">
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
                <div class="text-left">{{ emp.EmployeeCode }}</div>
              </td>
              <td>
                <div class="text-left">{{ emp.FullName }}</div>
              </td>
              <td>
                <div class="text-left">{{ emp.GenderName }}</div>
              </td>
              <td>
                <div class="text-left">
                  {{ $formatter.changeFormat(emp.DateOfBirth) }}
                </div>
              </td>
              <td>
                <div class="text-left">{{ emp.IdentityNumber }}</div>
              </td>
              <td>
                <div class="text-left">{{ emp.PositionName }}</div>
              </td>
              <td>
                <div class="text-left">{{ emp.DepartmentName }}</div>
              </td>
              <td><div class="text-left">231239485923</div></td>
              <td><div class="text-left">BIDV</div></td>
              <td><div class="text-left">Cầu Giấy</div></td>
              <td
                :class="[table.expandEmpId == emp.EmployeeId ? 'above' : '']"
                class="tdn--sticky"
                @dblclick.stop
              >
                <div class="t__optionbox align-center">
                  <button
                    class="option__edit"
                    @click="btnEditOnClick(emp.EmployeeId)"
                  >
                    Sửa
                  </button>
                  <button
                    class="btn__expand mi mi-16 mi-expand-down"
                    @click="btnExpandOnClick(emp.EmployeeId)"
                  ></button>
                  <ul
                    class="actions-list btn__expand"
                    v-show="table.expandEmpId == emp.EmployeeId"
                    @mouseleave="table.expandEmpId = ''"
                  >
                    <li><div class="li-data">Nhân bản</div></li>
                    <li>
                      <div
                        class="li-data"
                        @click="deleteEmployeeFunction(emp.EmployeeId)"
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
    </div>
    <div class="table__pag">
      <div class="pag__leftside">
        <span
          >Tổng số: <strong>{{ props.pagingData.totalRecord }}</strong> bản
          ghi</span
        >
      </div>
      <div class="pag__rightside">
        <div class="pag__recordcount">
          <div
            class="record__amount__select"
            v-show="table.recordAmountOpen"
            :class="[
              props.pagingData.curAmount > 3
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
                    recordAmount == props.pagingData.pageSize
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
          <span>Số bản ghi / trang: {{ props.pagingData.pageSize }}</span>
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
            props.pagingData.pageSize * (props.pagingData.pageNumber - 1) + 1
          }}
          -
          <span v-show="!props.isLoadingData">
            <strong>{{
              props.pagingData.pageSize * (props.pagingData.pageNumber - 1) +
              props.pagingData.curAmount
            }}</strong>
          </span>
          <span v-show="props.isLoadingData"><strong>xx</strong> </span>
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
import BaseLoader from "../../base/BaseLoader.vue";
import { useRouter } from "vue-router";
import $formatter from "@/js/common/formater";

const router = useRouter();

const table = ref({
  recordAmountOpen: false,
  recordAmountList: [10, 20, 30, 50, 100],
  expandEmpId: "",
});
const props = defineProps({
  pagingData: Object,
  isLoadingData: Boolean,
  empList: Array,
  deleteEmployeeFunction: Function,
  pagingNextPage: Function,
  pagingPrevPage: Function,
});
const emits = defineEmits(["updatePagingData"]);
async function nextPageOnClick() {
  if (
    (props.pagingData.pageNumber - 1) * props.pagingData.pageSize +
      props.pagingData.curAmount >=
    props.pagingData.totalRecord
  )
    return;
  await props.pagingNextPage();
  console.log("Next");
}

async function prevPageOnClick() {
  if (props.pagingData.pageNumber <= 1) return;
  await props.pagingPrevPage();
  console.log("Prev");
}

function btnEditOnClick(empId) {
  router.push(`/employee/${empId}`);
}

function btnExpandOnClick(empId) {
  if (table.value.expandEmpId == empId) {
    table.value.expandEmpId = "";
  } else {
    table.value.expandEmpId = empId;
  }
}

function recordAmountOptionOnClick(recordAmount) {
  emits("updatePagingData", {
    totalRecord: props.pagingData.totalRecord,
    curAmount: props.pagingData.curAmount,
    pageSize: recordAmount,
    pageNumber: 1,
  });
  table.value.recordAmountOpen = false;
}

function pagArrowdownOnClick() {
  table.value.recordAmountOpen = !table.value.recordAmountOpen;
}
function checkBoxOnClick(empId) {
  for (const emp of props.empList) {
    if (emp.EmployeeId == empId) {
      emp.selected = !emp.selected;
      if (emp.selected == false) {
        emp.active = false;
      }
    }
  }
}

function trOnClick(empId) {
  for (const emp of props.empList) {
    if (emp.EmployeeId == empId || emp.selected) {
      emp.active = true;
    } else {
      emp.active = false;
    }
  }
}

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
  z-index: 4;
}

.thn--sticky {
  position: sticky;
  right: -1px;
  z-index: 4;
  border-left: 1px solid #c7c7c7;
}

.td1--sticky {
  position: sticky;
  left: -1px;
  background-color: inherit;
}

.tdn--sticky {
  position: sticky;
  right: -1px;
  background-color: inherit;
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
  list-style-type: none;
  top: 36px;
  width: 130px;
  right: 5px;
  background-color: #fff;
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
</style>
