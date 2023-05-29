<template>
  <div class="dpicker">
    <div class="dpicker__label">{{ label }}</div>
    <div class="dpicker__selector">
      <div class="dpicker__input">
        <input
          type="text"
          :placeholder="$formatter.dateFormat"
          :value="inputText"
          @input="$emit('update:inputText', $event.target.value)"
        />
        <div
          class="dpicker__icon mi mi-24 mi-calendar"
          @click="miCalendarOnClick"
        ></div>
      </div>
    </div>
    <div v-show="isBoxOpen" class="dpicker__box">
      <div class="dpicker__header">
        <div class="dp__header__left">
          <div class="dp__date">{{ boxText }}</div>
          <div
            class="dp__expandic mi mi-14"
            :class="boxStatus == 0 ? 'mi-arrowdown' : 'mi-arrowup'"
            @click="expandIcOnClick"
          ></div>
        </div>
        <div class="dp__header__right">
          <div
            class="dp__prev mi mi-24 mi-arrowleft"
            @click="prevOnClick"
          ></div>
          <div
            class="dp__next mi mi-24 mi-arrowright"
            @click="nextOnClick"
          ></div>
        </div>
      </div>
      <div class="dpicker__body">
        <div v-show="boxStatus == 2" class="dpicker__yearlist">
          <div class="yearlist__tablebox">
            <table>
              <tbody>
                <tr v-for="i in 3" :key="i">
                  <td
                    v-for="j in 4"
                    :key="j"
                    @click="
                      yearItemOnClick(
                        $event,
                        yearRangeNow + 4 * (i - 1) + j - 1
                      )
                    "
                  >
                    <div class="year-item">
                      {{ yearRangeNow + 4 * (i - 1) + j - 1 }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="dpicker__cancelbox">
            <button class="dp__cancel" @click="cancelBtnOnClick">Hủy bỏ</button>
          </div>
        </div>
        <div v-show="boxStatus == 1" class="dpicker__yearlist">
          <div class="yearlist__tablebox">
            <table>
              <tbody>
                <tr v-for="i in 3" :key="i">
                  <td
                    v-for="j in 4"
                    :key="j"
                    @click="monthItemOnClick($event, 4 * (i - 1) + j)"
                  >
                    <div class="month-item">Thg {{ 4 * (i - 1) + j }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="dpicker__cancelbox">
            <button class="dp__cancel" @click="cancelBtnOnClick">Hủy bỏ</button>
          </div>
        </div>
        <div v-show="boxStatus == 0" class="dpicker__daylist">
          <div class="daylist__table">
            <table>
              <thead>
                <tr>
                  <th>T2</th>
                  <th>T3</th>
                  <th>T4</th>
                  <th>T5</th>
                  <th>T6</th>
                  <th>T7</th>
                  <th>CN</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 5" :key="i">
                  <td
                    v-for="j in 7"
                    :key="j"
                    :class="{
                      chooseable: cell[7 * (i - 1) + j - 1] > 0,
                      selected:
                        cell[7 * (i - 1) + j - 1] == curDay &&
                        curMonth == realMonth &&
                        curYear == realYear,
                    }"
                    @click="dateItemOnClick($event, 7 * (i - 1) + j - 1)"
                  >
                    <div class="date__item">
                      {{
                        cell[7 * (i - 1) + j - 1] > 0
                          ? cell[7 * (i - 1) + j - 1]
                          : ""
                      }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="dpicker__curdate">
            <button class="dp__now" @click="todayBtnOnClick">Hôm nay</button>
          </div>
        </div>
      </div>
    </div>
    <div class="dpicker__noti noti"></div>
  </div>
</template>

<script setup>
//#region import
import { ref } from "vue";
import $formatter from "@/js/common/formater";

//#endregion

//#region init
const props = defineProps({
  label: String,
  inputText: String,
});
const emits = defineEmits(["update:inputText"]);
const isBoxOpen = ref(false);

// 0 -> Day 1-> Month 2 -> Year
const boxStatus = ref(0);
var date = new Date();
const yearRangeNow = ref(date.getFullYear());
const boxText = ref("");
const curYear = ref(0);
const curMonth = ref(0);
const curDay = ref(-1);
const realYear = ref(-1);
const realMonth = ref(-1);
const realDay = ref(-1);
const cell = ref([]);
const selectedIdx = ref(-1);
const maxYearLimit = date.getFullYear() + 12;
const minYearLimit = date.getFullYear() - 150;

//#endregion

//#region function

/**
 * Gán ngày hiển thị bằng ngày đã chọn
 *
 * Author: Dũng (08/05/2023)
 */
function assignRealtoCur() {
  curDay.value = realDay.value;
  curMonth.value = realMonth.value;
  curYear.value = realYear.value;
}

/**
 * Gán ngày đã chọn bằng ngày hiển thị
 *
 * Author: Dũng (08/05/2023)
 */
function assignCurToReal() {
  realDay.value = curDay.value;
  realMonth.value = curMonth.value;
  realYear.value = curYear.value;
}

/**
 * Cập nhật lại giá trị ngày cho cell
 * @param {Number} year Id Đơn vị
 * @param {Number} month Tên đơn vị
 *
 * Author: Dũng (08/05/2023)
 */
function updateCell(year, month) {
  const fd = new Date(year, month - 1, 1);

  //0-7
  const firstDay = fd.getDay();

  const dc = new Date(year, month, 0);
  const dateCount = dc.getDate();
  cell.value = [];
  let day = 0;
  for (let i = 0; i < 35; ++i) {
    if (i >= firstDay - 1) {
      ++day;
    }
    cell.value[i] = day;
    if (day == dateCount) {
      break;
    }
  }
}

//#endregion

//#region handle event
/**
 * Sự kiện click vào chọn ngày hôm nay
 *
 * Author: Dũng (08/05/2023)
 */
function todayBtnOnClick() {
  date = new Date();
  realYear.value = date.getFullYear();
  realMonth.value = date.getMonth() + 1;
  realDay.value = date.getDate();
  assignRealtoCur();
  // Update ngày
  updateCell(realYear.value, realMonth.value);
  yearRangeNow.value = date.getFullYear();
  boxText.value = `Tháng ${realMonth.value}, ${realYear.value}`;
  isBoxOpen.value = false;
  emits(
    "update:inputText",
    $formatter.formatDate(realDay.value, realMonth.value, realYear.value)
  );
}

/**
 * Sự kiện click vào btn hủy chọn ngày
 * Author: Dũng (08/05/2023)
 */
function cancelBtnOnClick() {
  assignRealtoCur();
  boxStatus.value = 0;
  boxText.value = `Tháng ${realMonth.value}, ${realYear.value}`;
}

/**
 * Sự kiện click vào ngày trong lịch
 *
 * @param {Object} _e biến sự kiện
 * @param {String} dateChooseIdx Index của ngày được chọn trong cells
 *
 * Author: Dũng (08/05/2023)
 */
function dateItemOnClick(_e, dateChoosedIdx) {
  if (cell[dateChoosedIdx] == 0) {
    return;
  }
  curDay.value = cell.value[dateChoosedIdx];
  assignCurToReal();
  isBoxOpen.value = false;
  emits(
    "update:inputText",
    $formatter.formatDate(realDay.value, realMonth.value, realYear.value)
  );
}

/**
 * Sự kiện click vào tháng trong lịch
 * @param {Object} _e biến sự kiện
 * @param {Number} monthChoosed tháng được chọn
 *
 * Author: Dũng (08/05/2023)
 */
function monthItemOnClick(_e, monthChoosed) {
  curMonth.value = monthChoosed;
  boxText.value = `Tháng ${curMonth.value}, ${curYear.value}`;
  updateCell(curYear.value, curMonth.value);
  boxStatus.value = 0;
}

/**
 * Sự kiện click vào năm trong lịch
 * @param {Object} _ biến sự kiện
 * @param {String} yearChoosed năm được chọn
 *
 * Author: Dũng (08/05/2023)
 */
function yearItemOnClick(_e, yearChoosed) {
  curYear.value = yearChoosed;
  boxText.value = `Năm ${yearChoosed}`;
  boxStatus.value = 1;
}

/**
 * Sự kiện click vào item calendar
 *
 * Author: Dũng (08/05/2023)
 */
function miCalendarOnClick() {
  // Init
  if (!isBoxOpen.value) {
    if ($formatter.isValidDate(props.inputText)) {
      // Nếu ngày tháng nhập vào hợp lệ
      // Reset ngày tháng năm về ngày tháng đã nhập
      const { day, month, year } = $formatter.stringToDmy(props.inputText);
      realDay.value = day;
      realMonth.value = month;
      realYear.value = year;
      assignRealtoCur();
      // Update ngày
      yearRangeNow.value = curYear.value;
      boxText.value = `Tháng ${realMonth.value}, ${realYear.value}`;
      boxStatus.value = 0;
      emits(
        "update:inputText",
        $formatter.formatDate(realDay.value, realMonth.value, realYear.value)
      );
      updateCell(realYear.value, realMonth.value);
    } else {
      // Nếu ngày tháng nhập vào không hợp lệ hoặc để trống
      // Reset input text
      emits("update:inputText", "");
      // Reset ngày tháng năm về hiện tại
      realYear.value = date.getFullYear();
      realMonth.value = date.getMonth() + 1;
      realDay.value = date.getDate();
      assignRealtoCur();
      // Update ngày
      updateCell(realYear.value, realMonth.value);
      yearRangeNow.value = date.getFullYear();
      boxText.value = `Tháng ${realMonth.value}, ${realYear.value}`;
      boxStatus.value = 0;
    }
  }
  isBoxOpen.value = !isBoxOpen.value;
}

/**
 * Sự kiện click vào nút chọn năm, tháng
 *
 * Author: Dũng (08/05/2023)
 */
function expandIcOnClick() {
  // Lịch -> Năm
  if (boxStatus.value == 0) {
    boxText.value = `${yearRangeNow.value} - ${yearRangeNow.value + 11}`;
    boxStatus.value = 2;
  } else {
    // Năm, Tháng -> Lịch
    assignRealtoCur();
    boxText.value = `Tháng ${realMonth.value}, ${realYear.value}`;
    boxStatus.value = 0;
  }
}

/**
 * Sự kiện click vào nút prev
 *
 * Author: Dũng (08/05/2023)
 */
function prevOnClick() {
  // Back Năm
  if (boxStatus.value == 2) {
    if (yearRangeNow.value > minYearLimit) {
      yearRangeNow.value -= 12;
      boxText.value = `${yearRangeNow.value} - ${yearRangeNow.value + 11}`;
    }
  }
  if (boxStatus.value == 0) {
    // Back Lịch
    if (curMonth.value == 1) {
      curMonth.value = 12;
      curYear.value -= 1;
    } else {
      curMonth.value -= 1;
    }
    boxText.value = `Tháng ${curMonth.value}, ${curYear.value}`;
    selectedIdx.value = -1;
    updateCell(curYear.value, curMonth.value);
  }
  if (boxStatus.value == 1) {
    if (curYear.value > minYearLimit) {
      curYear.value -= 1;
      boxText.value = `Năm ${curYear.value}`;
    }
  }
}

/**
 * Sự kiện click vào nút next
 *
 * Author: Dũng (08/05/2023)
 */
function nextOnClick() {
  if (boxStatus.value == 2) {
    if (yearRangeNow.value < maxYearLimit) {
      yearRangeNow.value += 12;
      boxText.value = `${yearRangeNow.value} - ${yearRangeNow.value + 11}`;
    }
  }
  if (boxStatus.value == 0) {
    // Next lịch
    if (curMonth.value == 12) {
      if (curYear.value < maxYearLimit) {
        curMonth.value = 1;
        curYear.value += 1;
      }
    } else {
      curMonth.value += 1;
    }
    boxText.value = `Tháng ${curMonth.value}, ${curYear.value}`;
    selectedIdx.value = -1;
    updateCell(curYear.value, curMonth.value);
  }
  if (boxStatus.value == 1) {
    if (curYear.value < maxYearLimit) {
      curYear.value += 1;
      boxText.value = `Năm ${curYear.value}`;
    }
  }
}

//#endregion
</script>

<style scoped>
.dpicker {
  position: relative;
}

.dpicker__label {
  font-weight: 500;
  margin-bottom: 8px;
}

.dpicker__input {
  position: relative;
  background-color: green;
  width: fit-content;
}

.dpicker.error-noti input {
  outline: none;
  border: 1px solid red;
}

.dpicker__input > input {
  height: 36px;
  width: 150px;
  padding: 0 30px 0 12px;
  border: 1px solid var(--clr-t-border);
}

.dpicker__icon {
  width: 24px;
  height: 24px;
  position: absolute;
  right: 6px;
  top: 6px;
}

.dpicker__box {
  width: 320px;
  /* height: 350px; */
  margin-top: 2px;
  background-color: #fff;
  border: 1px solid var(--clr-t-border);
  user-select: none;
  position: absolute;
  right: 0;
  box-shadow: 2px 2px 5px gray;
  z-index: 999;
}

.display--none {
  display: none;
}

.dpicker__header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}
.daylist__table {
  height: calc(350px - 60px - 48px);
}
.dpicker__curdate {
  height: 48px;
}

/* Header */
.dp__header__left {
  display: flex;
  align-items: center;
  column-gap: 8px;
  cursor: pointer;
}

.dp__date {
  font-size: 16px;
  font-weight: 600;
  width: 120px;
}

.dp__header__right {
  display: flex;
  column-gap: 12px;
}

/* Table */

.daylist__table {
  display: flex;
  justify-content: center;
  /* border: 1px solid green; */
}

.daylist__table table th {
  color: var(--clr-t-disable);
}

.daylist__table table td {
  text-align: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  /* border: 1px solid black; */
  color: var(--clr-t-disable);
}

.daylist__table table td.chooseable:not(.selected):hover {
  /* background-color: var(--clr-lg500);
  cursor: pointer;
  color: #fff; */
  border: 2px solid var(--clr-lg500);
  border-radius: 50%;
  color: #000;
  cursor: pointer;
}
.daylist__table table td:not(.chooseable) {
  pointer-events: none;
}
.daylist__table table td.selected {
  background-color: var(--clr-lg500);
  cursor: pointer;
  color: #fff;
}

/* Curdate */

.dpicker__curdate {
  border-top: 1px solid var(--clr-t-border);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dp__now {
  background-color: transparent;
  border: none;
  padding: 4px;
  color: var(--clr-lg500);
  cursor: pointer;
}

/* Year list */

.dpicker__yearlist {
  height: calc(350px - 60px);
  padding: 0 10px;
  font-weight: 500;
}

.yearlist__tablebox {
  display: flex;
  justify-content: center;
  background-color: var(--clr-lg500);
  border-radius: 15px 15px 0 0;
}
.yearlist__tablebox table {
  border-spacing: 20px;
  color: #fff;
}

.yearlist__tablebox td {
  width: 60px;
  height: 36px;
  text-align: center;
  cursor: pointer;
}

.dpicker__cancelbox {
  height: 90px;
  background-color: var(--clr-lg500);
  display: flex;
  border-radius: 0 0 15px 15px;
  justify-content: center;
  align-items: center;
}

.dp__cancel {
  padding: 12px;
  cursor: pointer;
  color: #fff;
  background-color: transparent;
  border-radius: var(--border-radius);
  font-weight: 500;
  border: none;
}

.yearlist__tablebox td:hover {
  background-color: #fff;
  color: var(--clr-lg500);
}

.dp__cancel:hover {
  background-color: var(--clr-lg600);
}

.dpicker:not(.error-noti) input:focus {
  outline: none;
  border: 1px solid var(--clr-lg500);
}

/* Noti */
.dpicker__noti {
  /* margin-top: 8px; */
  color: red;
  font-size: 12px;
  position: absolute;
  top: 70px;
}

.dpicker:not(.error-noti) .dpicker__noti {
  display: none;
}
</style>
