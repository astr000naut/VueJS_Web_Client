<template>
  <div class="toast__box">
    <transition-group name="list">
      <div
        v-for="toast in props.toastList"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
      >
        <div class="left__area">
          <div class="minc mi-24"></div>
          <div class="toast__title">
            <strong>{{
              toast.type == "success"
                ? "Thành công!"
                : toast.type == "alert"
                ? "Cảnh báo!"
                : "Lỗi!"
            }}</strong>
          </div>
          <div class="toast__message">{{ toast.message }}</div>
        </div>
        <div class="right__area">
          <div
            class="mi mi-16 mi-close-small"
            @click="props.removeToast(toast.id)"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
const props = defineProps({
  toastList: Array,
  removeToast: Function,
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-enter-to {
  max-height: 56px;
}

.list-leave-from {
  max-height: 56px;
}

.list-leave-to {
  opacity: 0;
  max-height: 0px;
  transform: translateY(-10px);
}
.toast {
  min-width: 450px;
  max-width: 650px;
  height: 56px;
  padding: 0 16px;
  overflow: hidden;
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  align-items: center;
  user-select: none;
  border-radius: 4px;
  margin-bottom: 8px;
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
  margin-left: 16px;
}

.toast--success .minc {
  background-position: -1600px -256px;
}

.toast--alert .minc {
  background-position: -593px -145px;
}

.toast--fail .minc {
  background-position: -538px -146px;
}

.toast--success .toast__title {
  color: var(--clr-lg500);
}

.toast--alert .toast__title {
  color: #ff8a1c;
}

.toast--fail .toast__title {
  color: #fd4040;
}
</style>
