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
defineProps({
  type: String,
  message: String,
  yesOnClick: Function,
});
</script>

<style scoped>
.notibox {
  width: 450px;
  height: 200px;
  background-color: #fff;
  border-radius: var(--border-radius);
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 24px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
}

.notibox__content {
  flex: 1;
  display: flex;
  align-items: center;
  column-gap: 24px;
  font-weight: 400;
}

.content__logo {
  width: 36px;
  height: 36px;
}

.notibox__footer {
  margin: 18px auto 0 auto;
}

.logo--alert {
  background-image: url("../../assets/img/Sprites.64af8f61.svg");
  background-position: -752px -462px;
}
</style>
