<template>
  <div
    class="cbox"
    :class="[
      isrequired ? 'field--required' : '',
      noti.length > 0 ? 'error-noti' : '',
    ]"
  >
    <div class="cbox__label label">{{ label }}</div>
    <div class="cbox__select">
      <div class="select__box">
        <div class="select__input">
          <input
            type="text"
            :value="text"
            ref="refInput"
            @input="$emit('update:text', $event.target.value)"
            @keyup="inputKeyupHandler"
            @keypress="inputKeyPressHandler"
          />
        </div>
        <button
          class="select__button mi"
          :class="[
            cbox.isOptionboxOpen ? 'mi-cbox-arrowup' : 'mi-cbox-arrowdown',
          ]"
          tabindex="-1"
          @click="selectButtonOnClick"
        ></button>
      </div>
      <div
        :class="[cbox.isOptionboxOpen ? '' : 'display--none']"
        class="select__optionbox"
      >
        <div class="loader__container" v-show="cbox.isLoading">
          <BaseLoader />
        </div>
        <div
          class="optionlist"
          v-show="!cbox.isLoading"
          :class="[cbox.hasScrollbar ? 'hascrollbar' : '']"
        >
          <template
            v-for="(option, index) in optionList"
            :key="option.DepartmentId"
          >
            <div
              v-show="!optionIdHide.includes(index)"
              class="option__item"
              @click="
                optionOnClick(
                  $event,
                  option.DepartmentId,
                  option.DepartmentName
                )
              "
              :class="[
                option.DepartmentId == selectedItemId ? 'item--selected' : '',
                cbox.cusorItemId != null &&
                option.DepartmentId == optionList[cbox.cusorItemId].DepartmentId
                  ? 'item--highlighted'
                  : '',
              ]"
            >
              <div class="option__text">{{ option.DepartmentName }}</div>
              <div class="option__icon"></div>
            </div>
          </template>
          <div
            v-show="cbox.suggestAddingItem.length > 0"
            class="option__item"
            @click="addingItemOnClick"
          >
            <div class="option__text">
              Thêm mới <strong>{{ cbox.suggestAddingItem }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cbox__noti noti">{{ noti }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseLoader from "./BaseLoader.vue";
// Luu cac bien setTimeout
const typingTimers = [];
const timeoutVal = 500;
const optionIdHide = ref([]);
const refInput = ref(null);

const props = defineProps({
  label: String,
  text: String,
  isrequired: Boolean,
  selectedItemId: String,
  addNewItem: Function,
  optionList: Array,
  noti: String,
});

const emits = defineEmits([
  "update:text",
  "update:noti",
  "update:selectedItemId",
]);
defineExpose({ refInput });

const cbox = ref({
  isOptionboxOpen: false,
  isLoading: false,
  suggestAddingItem: "",
  cusorItemId: null,
  hasScrollbar: false,
});

/**
 * Sự kiện click vào item trong danh sách combobox option
 *
 * @param {Object} _$event biến sự kiện
 * @param {String} optionId Option Id
 * @param {String} optionName Option Name
 *
 * Author: Dũng (08/05/2023)
 */
function optionOnClick(_$event, optionId, optionName) {
  // Update dữ liệu lên Form Object
  emits("update:text", optionName);
  emits("update:noti", "");

  // Đóng optionbox
  cbox.value.isOptionboxOpen = false;
  emits("update:selectedItemId", optionId);
  // Xóa bỏ gợi ý thêm mới đơn vị
  cbox.value.suggestAddingItem = "";
}

/**
 * Sự kiện click vào mũi tên mở rộng combobox
 * NEED xóa cusor hoặc code lại
 *
 * Author: Dũng (08/05/2023)
 */
function selectButtonOnClick() {
  cbox.value.cusorItemId = null;

  // Kiểm tra xem chọn đúng đơn vị trong danh sách
  if (cbox.value.isOptionboxOpen == true) {
    if (props.text.length != 0 && props.selectedItemId == "") {
      emits("update:noti", `Vui lòng chọn <${props.label}> có trong danh mục`);
    }
  } else {
    optionIdHide.value = [];
  }
  cbox.value.isOptionboxOpen = !cbox.value.isOptionboxOpen;
}

/**
 * Sự kiện click vào thêm mới Item
 * Author: Dũng (08/05/2023)
 */
async function addingItemOnClick() {
  await props.addNewItem(cbox.value.suggestAddingItem);
  cbox.value.isOptionboxOpen = false;
  cbox.value.suggestAddingItem = "";
}

/**
 * Sự kiện Keyup ô Input
 * @param {Object} $event biến sự kiện
 *
 * Author: Dũng (08/05/2023)
 */

function inputKeyupHandler($event) {
  // Nếu combobox là requied thì khi xóa hết text sẽ thông báo lỗi
  if (props.isrequired) {
    if (props.text.length == 0 && $event.key == "Backspace") {
      emits("update:noti", `${props.label} không được để trống`);
    } else {
      // Khi typing thì tắt thông báo lỗi
      emits("update:noti", "");
    }
  }

  // 500ms sau khi Typing tự động mở optionBox
  if (cbox.value.isOptionboxOpen == false && $event.key != "Tab") {
    setTimeout(() => {
      cbox.value.isOptionboxOpen = true;
    }, 500);
  }
  // Xóa các timeout trước trong khi typing
  while (typingTimers.length > 0) {
    clearTimeout(typingTimers[0]);
    typingTimers.splice(0, 1);
  }

  typingTimers.push(
    setTimeout(() => {
      // Display loading
      cbox.value.isLoading = true;
      emits("update:selectedItemId", "");
      filterData(props.text).then((IdHideList) => {
        optionIdHide.value = IdHideList;
        if (IdHideList.length != props.optionList.length) {
          cbox.value.suggestAddingItem = "";
        } else {
          cbox.value.suggestAddingItem = props.text;
        }
        cbox.value.isLoading = false;
      });
    }, timeoutVal)
  );
}

/**
 * Sự kiện Typing vào ô input
 * Author: Dũng (08/05/2023)
 */
function inputKeyPressHandler() {
  cbox.value.isLoading = true;
  // Xóa setTimeout đã tạo từ tước
  while (typingTimers.length > 0) {
    clearTimeout(typingTimers[0]);
    typingTimers.splice(0, 1);
  }
}

/**
 * Hàm tìm kiếm đơn vị
 * @param {String} input Tên đơn vị
 *
 * Author: Dũng (08/05/2023)
 */
function filterData(input) {
  const IdHideList = [];
  for (let i = 0; i < props.optionList.length; ++i) {
    if (
      !props.optionList[i].DepartmentName.toLowerCase().includes(
        input.toLowerCase().trim()
      )
    ) {
      IdHideList.push(i);
    }
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(IdHideList);
    }, 200);
  });
}
</script>

<style scoped>
.cbox {
  position: relative;
}

.cbox__label {
  font-weight: 500;
  margin-bottom: 8px;
}

.cbox.field--required .cbox__label::after {
  content: " *";
  color: red;
}

.select__box {
  display: flex;
  height: var(--h-default);
  border: 1px solid var(--clr-t-border);
  border-radius: var(--border-radius);
}

.select__input {
  flex: 1;
}

.select__input input {
  height: 100%;
  width: 100%;
  padding: 0 12px;
  border-radius: 4px 0 0 4px;
  border: none;
  outline: none;
}

.select__button {
  width: 40px;
  border: none;
  outline: none;
  border-left: 1px solid var(--clr-t-border);
  border-radius: 0 3px 3px 0;
}

.select__optionbox {
  background-color: #fff;
  border-radius: var(--border-radius);
  border: 1px solid var(--clr-t-border);
  box-shadow: 4px 4px 5px var(--clr-t-bg);
  padding: 8px;
  max-height: 308px;
  width: 100%;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
}

.optionlist {
  max-height: 292px;
  user-select: none;
  overflow-y: scroll;
}

.option__item {
  height: var(--h-default);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 4px;
}

.option__icon {
  width: 16px;
  height: 16px;
  background: url(../../assets/img/Sprites.64af8f61.svg) no-repeat -1225px -360px;
}

::-webkit-scrollbar {
  width: 0px;
  background-color: transparent;
}

.optionlist.hascrollbar::-webkit-scrollbar {
  width: 9px;
  background-color: transparent;
}

.optionlist::-webkit-scrollbar-thumb {
  background-color: var(--clr-t-border);
  border-radius: 8px;
}

.cbox__noti {
  position: absolute;
  top: 70px;
  color: red;
  font-size: 12px;
}

.cbox:not(.error-noti) .cbox__noti {
  display: none;
}

.cbox:not(.error-noti) .select__box:has(.select__input input:focus) {
  border: 1px solid var(--clr-lg500);
}

.select__button:hover {
  background-color: var(--clr-t-border);
}

.select__button:active {
  background-color: var(--clr-t-bg);
}

.select__input input:hover {
  background-color: var(--clr-t-bg);
}

.cbox:has(input:focus) .select__box {
  outline: none;
  border: 1px solid var(--clr-lg500);
}

.cbox.error-noti:has(.select__optionbox.display--none) .select__box {
  outline: none;
  border: 1px solid red;
}

.cbox:not(:has(.select__optionbox.display--none)) .select__box {
  outline: none;
  border: 1px solid var(--clr-lg500);
}

.cbox:not(:has(.select__optionbox.display--none)) .cbox__noti {
  display: none;
}

.option__item:hover {
  cursor: pointer;
  background-color: var(--clr-lg100);
  color: #000;
}

.item--selected {
  color: var(--clr-lg500);
}

.item--highlighted {
  background-color: var(--clr-lg500);
  color: #fff;
}

.option__item:not(.item--selected) .option__icon {
  display: none;
}

/* Loader */
.loader__container {
  height: 200px;
}
</style>
