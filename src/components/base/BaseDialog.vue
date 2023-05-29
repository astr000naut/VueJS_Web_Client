<template>
  <div class="dialog">
    <div class="dialog__bar">
      <div class="dialog__heading">{{ title }}</div>
      <BaseButton bname="" class="mi-36 btn--close" @click="closeOnClick" />
    </div>
    <div class="dialog__content">
      {{ message }}
    </div>
    <div class="dialog__footer">
      <BaseButton bname="Không" class="btn--secondary" @click="noOnClick" />
      <BaseButton bname="Có" class="btn--primary" @click="yesOnClick" />
    </div>
  </div>
</template>

<script setup>
//#region init
defineProps({
  title: String,
  message: String,
  closeOnClick: Function,
  yesOnClick: Function,
  noOnClick: Function,
});
//#endregion
</script>

<style
  scoped
  lang="css"
  src="../../css/components/base/base-dialog.css"
></style>
