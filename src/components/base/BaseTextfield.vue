<template>
  <div
    class="txtfield"
    :class="[
      isrequired ? 'field--required' : '',
      noti.length > 0 ? 'error-noti' : '',
    ]"
  >
    <div
      v-show="label != 'empty'"
      class="txtfield__label label"
      @mouseenter="labelOnMouseEnter"
      @mouseleave="labelOnMouseOut"
    >
      {{ $t(label) }}
    </div>
    <div class="txtfield__tooltip" v-show="$t(tooltip).length && showTooltip">
      {{ $t(tooltip) }}
    </div>
    <div class="txtfield__textbox">
      <input
        class="txtfield__input"
        type="text"
        :placeholder="pholder ? $t(pholder) : null"
        :value="text"
        ref="refInput"
        @input="$emit('update:text', $event.target.value)"
        @keyup="inputKeyupHandler"
        @keypress="inputKeyPressHandler"
        @keydown.shift.f8.prevent="autoFill"
      />
      <div class="txtfield__icon"></div>
    </div>
    <div class="txtfield__noti noti">{{ noti }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  pholder: String,
  label: String,
  text: String,
  isrequired: Boolean,
  tooltip: String,
  noti: String,
  realTimeSearch: Boolean,
  doSearch: Function,
  autoFill: Function,
  autoFillMessage: String,
});
const typingTimers = [];
const timeoutVal = 500;
const refInput = ref(null);
const showTooltip = ref(false);
const emits = defineEmits(["update:text", "update:noti"]);
defineExpose({ refInput });

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
 * Sự kiện keyup cho ô input
 *
 * @param {Object} $event biến sự kiện
 *
 * Author: Dũng (08/05/2023)
 */
function inputKeyupHandler($event) {
  emits("update:noti", "");
  if (props.isrequired) {
    if (props.text.length == 0 && $event.key == "Backspace") {
      refInput.value.placeholder = props.autoFillMessage
        ? t(props.autoFillMessage)
        : "";
      emits(
        "update:noti",
        `${t("error.isRequired", { field: t(props.label) })}`
      );
    }
  }
  if (isNormalCharacterKey($event.key) && props.realTimeSearch) {
    // Xóa các timeout trước trong khi typing
    while (typingTimers.length > 0) {
      clearTimeout(typingTimers[0]);
      typingTimers.splice(0, 1);
    }

    typingTimers.push(
      setTimeout(() => {
        // Display loading
        props.doSearch(props.text);
      }, timeoutVal)
    );
  }
}

/**
 * Sự kiện Typing vào ô input
 * Author: Dũng (08/05/2023)
 */
function inputKeyPressHandler($event) {
  if (isNormalCharacterKey($event.key) && props.realTimeSearch) {
    // Xóa setTimeout đã tạo từ tước
    while (typingTimers.length > 0) {
      clearTimeout(typingTimers[0]);
      typingTimers.splice(0, 1);
    }
  }
}

/**
 * Sự kiện mouse enter vào label
 *
 * Author: Dũng (08/05/2023)
 */
function labelOnMouseEnter() {
  showTooltip.value = true;
}

/**
 * Sự kiện mouse out khỏi label
 *
 * Author: Dũng (08/05/2023)
 */
function labelOnMouseOut() {
  showTooltip.value = false;
}
</script>

<style scoped>
.txtfield {
  position: relative;
}

.txtfield__textbox {
  height: var(--h-default);
  min-width: 120px;
  position: relative;
}

.txtfield__label {
  width: fit-content;
  margin-bottom: 8px;
  font-weight: 500;
}

.txtfield.field--required .txtfield__label::after {
  content: " *";
  color: red;
}

.txtfield__input {
  width: 100%;
  height: 100%;
  border: 1px solid var(--clr-t-border);
  border-radius: var(--border-radius);
  padding: 0 12px 0 12px;
}

.txtfield__input:hover {
  background-color: var(--clr-t-bg);
}

.txtfield__input:focus {
  outline: none;
  border: 1px solid var(--clr-lg500);
}

.txtfield:not(.error-noti) .txtfield__noti {
  display: none;
}

.txtfield__noti {
  /* margin-top: 8px; */
  overflow: hidden;
  text-overflow: ellipsis;
  color: red;
  max-height: 16px;
  font-size: 11px;
  position: absolute;
  top: 70px;
}

/* Error */

.error-noti .txtfield__input {
  border: 1px solid red;
}

/* Validate */

.txtfield--validate .txtfield__input {
  border: 1px solid var(--clr-lg500);
  padding-right: 36px;
}

.txtfield--validate .txtfield__icon {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: url("../../assets/img/Sprites.64af8f61.svg");
  background-repeat: no-repeat;
  background-position: -893px -406px;
}

/* Verifying */
.txtfield--verifying .txtfield__input {
  padding-right: 36px;
  border: 1px solid var(--clr-lg500);
}

.txtfield--verifying .txtfield__icon {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: url("../../assets/loading.svg");
  background-size: contain;
}

/* Search */

.txtfield--search .txtfield__input {
  padding-right: 36px;
}

.txtfield--search .txtfield__icon {
  width: 36px;
  height: 36px;
  position: absolute;
  border-radius: 0 4px 4px 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: url("../../assets/img/Sprites.64af8f61.svg");
  background-repeat: no-repeat;
  background-position: -1035px -82px;
}

/* .txtfield--search .txtfield__icon:hover {
  cursor: pointer;
}

.txtfield--search .txtfield__icon:active {
  background-color: var(--clr-t-border);
} */

/* Tooltip */
.txtfield__tooltip {
  background-color: #393a3d;
  position: absolute;
  z-index: 1;
  left: -10px;
  border-radius: 4px;
  color: #fff;
  width: fit-content;
  padding: 2px 4px;
}
</style>
