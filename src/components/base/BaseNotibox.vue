<template>
  <div class="notibox">
    <div class="notibox__content">
      <div
        class="content__logo"
        :class="[type == 'alert' ? 'logo--alert' : '']"
      ></div>
      <div class="content__text">{{ message }}</div>
    </div>
    <hr />
    <div class="notibox__footer">
      <BaseButton bname="Đồng ý" class="btn--primary" @click="yesOnClick" />
    </div>
  </div>
</template>

<script setup>
//#region init
defineProps({
  type: String,
  message: String,
  yesOnClick: Function,
});
//#endregion
</script>

<style
  scoped
  lang="css"
  src="../../css/components/base/base-notibox.css"
></style>
