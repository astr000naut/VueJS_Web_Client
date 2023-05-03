<template>
  <div
    class="txtfield"
    :class="[
      props.isrequired ? 'field--required' : '',
      noti.length > 0 ? 'error-noti' : '',
    ]"
  >
    <div v-show="props.label" class="txtfield__label label">
      {{ props.label }}
    </div>
    <div class="txtfield__textbox">
      <input
        class="txtfield__input"
        type="text"
        :placeholder="props.pholder"
        :value="text"
        ref="refInput"
        @input="$emit('update:text', $event.target.value)"
        @keyup="inputKeyupHandler($event)"
      />
      <div class="txtfield__icon"></div>
    </div>
    <div class="txtfield__noti noti">{{ noti }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  pholder: String,
  label: String,
  text: String,
  isrequired: Boolean,
});
const refInput = ref(null);
const noti = ref("");
defineEmits(["update:text"]);
defineExpose({ refInput });
function inputKeyupHandler($event) {
  if (props.isrequired) {
    if (props.text.length == 0 && $event.key == "Backspace") {
      noti.value = `${props.label} không được để trống`;
    } else {
      noti.value = "";
    }
  }
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
</style>
