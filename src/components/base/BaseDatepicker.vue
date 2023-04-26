<template>
  <div class="dpicker">
    <div class="dpicker__label">{{ props.label }}</div>
    <div class="dpicker__selector">
      <div class="dpicker__input">
        <input type="text" placeholder="DD/MM/YYYY" />
        <div class="dpicker__icon mi mi-24 mi-calendar"></div>
      </div>
    </div>
    <div class="dpicker__box display--none">
      <div class="dpicker__header">
        <div class="dp__header__left">
          <div class="dp__date">Tháng 5, 2019</div>
          <div class="dp__expandic mi mi-14 mi-arrowdown"></div>
        </div>
        <div class="dp__header__right">
          <div class="dp__prev mi mi-24 mi-arrowleft"></div>
          <div class="dp__next mi mi-24 mi-arrowright"></div>
        </div>
      </div>
      <div class="dpicker__body">
        <div class="dpicker__yearlist display--none">
          <div class="yearlist__tablebox">
            <table>
              <tbody>
                <tr>
                  <td>
                    <div class="year-item"></div>
                    2023
                  </td>
                  <td>
                    <div class="year-item"></div>
                    2022
                  </td>
                  <td>
                    <div class="year-item"></div>
                    2021
                  </td>
                  <td>
                    <div class="year-item"></div>
                    2020
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="year-item"></div>
                    2019
                  </td>
                  <td>
                    <div class="year-item"></div>
                    2018
                  </td>
                  <td>
                    <div class="year-item"></div>
                    2017
                  </td>
                  <td>
                    <div class="year-item"></div>
                    2016
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="year-item"></div>
                    2015
                  </td>
                  <td>
                    <div class="year-item"></div>
                    2014
                  </td>
                  <td>
                    <div class="year-item"></div>
                    2013
                  </td>
                  <td>
                    <div class="year-item"></div>
                    2012
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="dpicker__cancelbox">
            <button class="dp__cancel">Hủy bỏ</button>
          </div>
        </div>
        <div class="dpicker__daylist">
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
                <tr>
                  <td><div class="date__item"></div></td>
                  <td><div class="date__item"></div></td>
                  <td>
                    <div class="date__item"></div>
                    1
                  </td>
                  <td>
                    <div class="date__item"></div>
                    2
                  </td>
                  <td>
                    <div class="date__item"></div>
                    3
                  </td>
                  <td>
                    <div class="date__item"></div>
                    4
                  </td>
                  <td>
                    <div class="date__item"></div>
                    5
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="date__item"></div>
                    6
                  </td>
                  <td>
                    <div class="date__item"></div>
                    7
                  </td>
                  <td>
                    <div class="date__item"></div>
                    8
                  </td>
                  <td>
                    <div class="date__item"></div>
                    9
                  </td>
                  <td>
                    <div class="date__item"></div>
                    10
                  </td>
                  <td>
                    <div class="date__item"></div>
                    11
                  </td>
                  <td>
                    <div class="date__item"></div>
                    12
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="date__item"></div>
                    13
                  </td>
                  <td>
                    <div class="date__item"></div>
                    14
                  </td>
                  <td>
                    <div class="date__item"></div>
                    15
                  </td>
                  <td>
                    <div class="date__item"></div>
                    16
                  </td>
                  <td>
                    <div class="date__item"></div>
                    17
                  </td>
                  <td>
                    <div class="date__item"></div>
                    18
                  </td>
                  <td>
                    <div class="date__item"></div>
                    19
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="date__item"></div>
                    20
                  </td>
                  <td>
                    <div class="date__item"></div>
                    21
                  </td>
                  <td>
                    <div class="date__item"></div>
                    22
                  </td>
                  <td>
                    <div class="date__item"></div>
                    23
                  </td>
                  <td>
                    <div class="date__item"></div>
                    24
                  </td>
                  <td>
                    <div class="date__item"></div>
                    25
                  </td>
                  <td>
                    <div class="date__item"></div>
                    26
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="date__item"></div>
                    27
                  </td>
                  <td>
                    <div class="date__item"></div>
                    28
                  </td>
                  <td>
                    <div class="date__item"></div>
                    29
                  </td>
                  <td>
                    <div class="date__item"></div>
                    30
                  </td>
                  <td>
                    <div class="date__item"></div>
                    31
                  </td>
                  <td><div class="date__item"></div></td>
                  <td><div class="date__item"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="dpicker__curdate">
            <button class="dp__now">Hôm nay</button>
          </div>
        </div>
      </div>
    </div>
    <div class="dpicker__noti noti"></div>
  </div>
</template>

<script setup>
const props = defineProps(["label"]);
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
  height: 350px;
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
  width: 40px;
  height: 30px;
  border-radius: 50%;
  /* border: 1px solid black; */
  color: var(--clr-t-disable);
  cursor: pointer;
}

.daylist__table table td:hover {
  background-color: var(--clr-lg500);
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
