<template>
  <div class="input--radio">
    <div class="radio__label">{{ $t(label) }}</div>
    <div class="radio__container">
      <div v-for="option in options" :key="option.value" class="radio__item">
        <input
          type="radio"
          name="gender"
          id=""
          :checked="option.value == radioValue"
          @click="$emit('update:radioValue', option.value)"
        />
        <label for="">{{ $t(`radioGroup.empGender.${option.text}`) }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  options: Array,
  radioValue: Number,
});
defineEmits(["update:radioValue"]);
</script>

<style scoped>
.radio__label {
  font-weight: 500;
}

.radio__container {
  display: flex;
  column-gap: 12px;
  margin-top: 12px;
}

.radio__item > input[type="radio"] {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  accent-color: rgb(19, 155, 19);
  transform: translate(4px, 4px);
  cursor: pointer;
}

.radio__item > input[type="radio"]:focus {
  outline-color: var(--clr-lg500);
}
</style>
