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
            <strong>{{ toast.title }}</strong>
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
// toastList.value = [
//   {
//     id: 0,
//     type: "success",
//     title: "Thành công!",
//     message: "Nhân viên đã bị xóa.",
//     timeToLive: 0,
//   },
//   {
//     id: 1,
//     type: "alert",
//     title: "Cảnh báo!",
//     message: "Thay đổi thông tin nhân viên thành công.",
//   },
//   {
//     id: 2,
//     type: "fail",
//     title: "Lỗi!",
//     message:
//       "Tải dữ liệu không thành công. Vui lòng kiểm tra lại kết nối Internet.",
//   },
// ];
</script>

<style scoped>
.list-enter-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  transition: all 0.75s ease;
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.toast__box {
  height: 300px;
  /* background-color: rgba(153, 205, 50, 0.164); */
}
.toast {
  min-width: 450px;
  max-width: 650px;
  height: 56px;
  padding: 16px;
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
