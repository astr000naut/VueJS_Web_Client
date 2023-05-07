<template>
  <div class="toast">
    <div class="left__area">
      <div class="mi-icon-success mi-24"></div>
      <div class="toast__title title--success">
        <strong>Thành công!</strong>
      </div>
      <div class="toast__message">Công việc đã bị xóa.</div>
    </div>
    <div class="right__area">
      <div class="mi mi-16 mi-close-small"></div>
    </div>
  </div>
</template>

<script setup>
// const props = defineProps({
//   type: String,
//   message: String,
//   yesOnClick: Function,
// });
</script>

<style scoped>
.toast {
  min-width: 450px;
  max-width: 650px;
  background-color: #fff;
  height: 56px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  border-radius: 4px;
}

.left__area {
  display: flex;
  align-items: center;
  column-gap: 8px;
}

.right__area {
  display: flex;
  align-items: center;
  column-gap: 16px;
}
.title--success {
  color: var(--clr-lg500);
}
</style>
