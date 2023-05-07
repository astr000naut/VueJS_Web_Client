<template>
  <div class="dialog">
    <div class="dialog__bar">
      <div class="dialog__heading">{{ props.title }}</div>
      <BaseButton
        bname=""
        class="mi-36 btn--close"
        @click="props.closeOnClick"
      />
    </div>
    <div class="dialog__content">
      {{ props.message }}
    </div>
    <div class="dialog__footer">
      <BaseButton
        bname="Không"
        class="btn--secondary"
        @click="props.noOnClick"
      />
      <BaseButton bname="Có" class="btn--primary" @click="props.yesOnClick" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
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
