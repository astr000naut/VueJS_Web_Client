<template>
  <div
    class="cbox"
    :class="[
      props.isrequired ? 'field--required' : '',
      noti.length > 0 ? 'error-noti' : '',
    ]"
  >
    <div class="cbox__label label">{{ props.label }}</div>
    <div class="cbox__select">
      <div class="select__box">
        <div class="select__input">
          <input
            type="text"
            :value="props.text"
            @input="$emit('update:text', $event.target.value)"
            @keyup="inputKeyupHandler"
            @keypress="inputKeyPressHandler"
          />
        </div>
        <button
          class="select__button"
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
        <div class="optionlist" v-show="!cbox.isLoading">
          <div
            v-for="option in optionListDisplay"
            class="option__item"
            :key="option.DepartmentId"
            @click="
              optionOnClick($event, option.DepartmentId, option.DepartmentName)
            "
            :class="[
              option.DepartmentId == cbox.selectedItemId
                ? 'item--selected'
                : '',
              cbox.cusorItemId != null &&
              option.DepartmentId ==
                optionListDisplay[cbox.cusorItemId].DepartmentId
                ? 'item--highlighted'
                : '',
            ]"
          >
            <div class="option__text">{{ option.DepartmentName }}</div>
            <div class="option__icon"></div>
          </div>
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
import { ref, inject } from "vue";
import BaseLoader from "./BaseLoader.vue";
const $axios = inject("$axios");
const typingTimers = [];
const timeoutVal = 500;

const props = defineProps({
  label: String,
  text: String,
  isrequired: Boolean,
  api: String,
});

const emits = defineEmits(["update:text"]);
const cbox = ref({
  isOptionboxOpen: false,
  isLoading: false,
  selectedItemId: "",
  suggestAddingItem: "",
  cusorItemId: null,
});
const noti = ref("");
const optionList = ref([]);
const optionListDisplay = ref([]);

fetchOptionList();

function optionOnClick(_$event, departmentId, departmentName) {
  emits("update:text", departmentName);
  noti.value = "";
  cbox.value.isOptionboxOpen = false;
  cbox.value.selectedItemId = departmentId;
}

function selectButtonOnClick() {
  cbox.value.cusorItemId = null;
  optionListDisplay.value = optionList.value;
  cbox.value.isOptionboxOpen = !cbox.value.isOptionboxOpen;
}

function addingItemOnClick() {
  $axios
    .post(props.api, {
      createdDate: new Date(),
      createdBy: "string",
      modifiedDate: new Date(),
      modifiedBy: "string",
      departmentCode: "string",
      departmentName: cbox.value.suggestAddingItem,
      description: "string",
    })
    .then((response) => {
      console.log(response);
      cbox.value.suggestAddingItem = "";
      fetchOptionList();
    })
    .catch((error) => {
      console.log(error);
    });
}

function fetchOptionList() {
  cbox.value.isLoading = true;
  $axios
    .get(props.api)
    .then((response) => {
      const data = response.data;
      cbox.value.isLoading = false;
      optionList.value = data;
      optionListDisplay.value = data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function inputKeyupHandler($event) {
  if (props.isrequired) {
    if (props.text.length == 0 && $event.key == "Backspace") {
      noti.value = `${props.label} không được để trống`;
    } else {
      noti.value = "";
    }
  }
  if (cbox.value.isOptionboxOpen == false && $event.key != "Tab") {
    setTimeout(() => {
      cbox.value.isOptionboxOpen = true;
    }, 500);
  }

  while (typingTimers.length > 0) {
    clearTimeout(typingTimers[0]);
    typingTimers.splice(0, 1);
  }

  typingTimers.push(
    setTimeout(() => {
      // Display loading
      cbox.value.isLoading = true;
      cbox.value.selectedItemId = "";
      filterData(props.text).then((idList) => {
        optionListDisplay.value = [];
        if (idList.length > 0) {
          cbox.value.suggestAddingItem = "";
          for (let i = 0; i < idList.length; ++i) {
            optionListDisplay.value.push(optionList.value[idList[i]]);
          }
        } else {
          cbox.value.suggestAddingItem = props.text;
        }
        cbox.value.isLoading = false;
      });
    }, timeoutVal)
  );
}

function inputKeyPressHandler() {
  cbox.value.isLoading = true;
  while (typingTimers.length > 0) {
    clearTimeout(typingTimers[0]);
    typingTimers.splice(0, 1);
  }
}

function filterData(input) {
  const idList = [];
  for (let i = 0; i < optionList.value.length; ++i) {
    if (
      optionList.value[i].DepartmentName.toLowerCase().includes(
        input.toLowerCase().trim()
      )
    ) {
      idList.push(i);
    }
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(idList);
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
  background: url(../../assets/img/Sprites.64af8f61.svg) no-repeat -1117px -352px;
  cursor: pointer;
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

.optionlist::-webkit-scrollbar {
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
