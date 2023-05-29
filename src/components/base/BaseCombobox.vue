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
            :key="option.departmentId"
          >
            <div
              v-show="!optionIdHide.includes(index)"
              class="option__item"
              @click="
                optionOnClick(
                  $event,
                  option.departmentId,
                  option.departmentName
                )
              "
              :class="[
                option.departmentId == selectedItemId ? 'item--selected' : '',
                cbox.cusorItemId != null &&
                option.departmentId == optionList[cbox.cusorItemId].departmentId
                  ? 'item--highlighted'
                  : '',
              ]"
            >
              <div class="option__text">{{ option.departmentName }}</div>
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
//#region import
import { ref } from "vue";
import BaseLoader from "./BaseLoader.vue";
//#endregion

//#region init
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

//#endregion

//#region function
/**
 * Kiểm tra keypress có là ký tự text bình thường không
 * @param {String} key là $event.key
 *
 * Author: Dũng(12/05/2023)
 */
function isNormalCharacterKey(key) {
  return key.length == 1 || key == "Backspace" ? true : false;
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
      !props.optionList[i].departmentName
        .toLowerCase()
        .includes(input.toLowerCase().trim())
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

//#endregion

//#region handle event

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
    optionIdHide.value = [];
  }
  cbox.value.isOptionboxOpen = !cbox.value.isOptionboxOpen;
}

/**
 * Sự kiện click vào thêm mới Item
 * Author: Dũng (08/05/2023)
 */
async function addingItemOnClick() {
  // await props.addNewItem(cbox.value.suggestAddingItem);
  cbox.value.isOptionboxOpen = false;
  cbox.value.suggestAddingItem = "";
  optionIdHide.value = [];
}

/**
 * Sự kiện Keyup ô Input
 * @param {Object} $event biến sự kiện
 *
 * Author: Dũng (08/05/2023)
 */

function inputKeyupHandler($event) {
  if (!isNormalCharacterKey($event.key)) return;
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
function inputKeyPressHandler($event) {
  if (!isNormalCharacterKey($event.key)) return;
  cbox.value.isLoading = true;
  // Xóa setTimeout đã tạo từ tước
  while (typingTimers.length > 0) {
    clearTimeout(typingTimers[0]);
    typingTimers.splice(0, 1);
  }
}

//#endregion
</script>

<style
  scoped
  lang="css"
  src="../../css/components/base/base-combobox.css"
></style>
