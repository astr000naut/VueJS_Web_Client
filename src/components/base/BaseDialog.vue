<template>
  <div class="dialog">
    <div class="dialog__bar">
      <div class="dialog__heading">{{ title ? $t(title) : null }}</div>
      <BaseButton class="mi-36 btn--close" @click="closeOnClick" />
    </div>
    <div class="dialog__content">
      {{ message ? $t(message) : null }}
    </div>
    <div class="dialog__footer">
      <BaseButton bname="button.no" class="btn--secondary" @click="noOnClick" />
      <BaseButton bname="button.yes" class="btn--primary" @click="yesOnClick" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
  closeOnClick: Function,
  yesOnClick: Function,
  noOnClick: Function,
});
</script>

<style scoped>
.dialog {
  width: 450px;
  height: 200px;
  background-color: #fff;
  border-radius: var(--border-radius);
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 24px;
  transform: translate(-50%, -50%);
}

.dialog__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog__heading {
  font-size: 20px;
  font-weight: 700;
}
.dialog__content {
  margin: 24px 0;
  font-weight: 400;
}

.dialog__footer {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  column-gap: 8px;
  justify-content: flex-end;
}
</style>
