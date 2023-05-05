<template>
  <div class="header">
    <div
      class="header__sidearea"
      :style="{ 'flex-basis': isHeaderBig ? '200px' : '78px' }"
    >
      <div class="header__navicon mi mi-24 mi-header-nav"></div>
      <div class="header__applogo" v-show="isHeaderBig"></div>
    </div>
    <div class="header__mainarea">
      <div class="header__leftarea">
        <div class="header__sidebaric mi mi-24 mi-header-three-line"></div>
        <div class="header__title">
          <div class="header__brandname">
            CÔNG TY TNNH SẢN XUẤT - THƯƠNG MẠI - DỊCH VỤ QUI PHÚC
          </div>
          <div class="header__title__arrow mi mi-14 mi-arrowdown"></div>
        </div>
      </div>
      <div class="header__rightarea">
        <div class="header__noti mi mi-24 mi-header-bell"></div>
        <div class="header__user">
          <div class="header__avatar"></div>
          <div class="header__username">Dũng Nguyễn</div>
          <div class="header__user__arrow mi mi-24 mi-arrowdown-small"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onBeforeUnmount } from "vue";

const $emitter = inject("$emitter");
const isHeaderBig = ref(true);
$emitter.on("resizeSidebar", (isSidebarBig) => {
  isHeaderBig.value = isSidebarBig;
  // console.log("hi");
});
onBeforeUnmount(() => {
  $emitter.off("resizeSidebar");
});
</script>

<style scoped>
.header {
  display: flex;
  height: 56px;
  width: 100%;
  background-color: #fff;
  justify-content: space-between;
  position: relative;
  user-select: none;
}

/* Top left area of header */

.header__sidearea {
  flex-basis: 200px;
  height: 100%;
  display: flex;
  background-color: #393a3d;
  align-items: center;
  justify-content: center;
  column-gap: 16px;
  /* padding-left: 16px; */
}

.header__applogo {
  width: 120px;
  height: 36px;
  background-image: url(../../assets/img/Logo_Module_TiengViet_White.66947422.svg);
  background-repeat: no-repeat;
  background-size: contain;
}

/* Main area of header */

.header__mainarea {
  flex: 2;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding-right: 16px;
  /* position: absolute;
    top: 0;
    right: 0;
    left: 200px; */
}

.header__leftarea {
  height: 100%;
  /* flex-shrink: 0; */
  display: flex;
  column-gap: 20px;
  align-items: center;
  padding-left: 10px;
}

.header__rightarea {
  /* flex-shrink: 0; */
  height: 100%;
  display: flex;
  align-items: center;
  column-gap: 24px;
  justify-content: flex-end;
  overflow: hidden;
}

/* Left area */

.header__title {
  font-weight: 500;
  display: flex;
  align-items: center;
  column-gap: 5px;
}

/* Right area */

.header__user {
  display: flex;
  column-gap: 5px;
  align-items: center;
}

.header__username {
  font-weight: 500;
  cursor: pointer;
}

.header__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: url(../../assets/img/avatar-default.png);
  background-size: cover;
  cursor: pointer;
}

/* Animation */

.header__title:hover {
  cursor: pointer;
}
</style>
