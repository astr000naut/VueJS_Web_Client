<template>
  <div
    class="sidebar"
    :style="{ 'flex-basis': isSidebarBig ? '200px' : '78px' }"
  >
    <div class="sidebar__main">
      <router-link
        v-for="item in sidebarItems"
        :key="item.name"
        :to="item.link"
      >
        <div
          class="sidebar__item"
          :class="item.name == itemSelected ? 'sidebar__item--highlight' : ''"
          @mouseover="sideBarItemOnMouseOver($event, item)"
          @mouseleave="item.displayLabel = !isSidebarBig & false"
          @click="sidebarItemOnClick(item.name)"
        >
          <div class="item__icon mi mi-24" :class="item.icon"></div>
          <div v-show="isSidebarBig" class="item__text">
            {{ item.name }}
          </div>
          <div
            v-show="item.displayLabel"
            :style="{ top: item.labelPos + 'px' }"
            class="item__hoverbox"
          >
            <div class="hover__arrow"></div>
            <div class="hover__text">{{ item.name }}</div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="sidebar__footer" @click="resizeSidebar">
      <div
        class="item__icon mi mi-24"
        :class="
          isSidebarBig ? 'mi-sidebar-left-arrow' : 'mi-sidebar-right-arrow'
        "
      ></div>
      <div v-show="isSidebarBig" class="item__text" data-text="Thu gọn">
        Thu gọn
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";

const $common = inject("$common");
const $emitter = inject("$emitter");
const sidebarItems = ref($common.sidebarItems);
const isSidebarBig = ref(true);
const itemSelected = ref("");
sidebarItems.value.forEach((item) => {
  item.displayLabel = false;
  item.labelPos = 0;
});

function sidebarItemOnClick(itemName) {
  itemSelected.value = itemName;
}

function sideBarItemOnMouseOver($event, item) {
  item.labelPos = $event.currentTarget.getBoundingClientRect().y - 56;
  item.displayLabel = !isSidebarBig.value & true;
}

function resizeSidebar() {
  isSidebarBig.value = !isSidebarBig.value;
  $emitter.emit("resizeSidebar", isSidebarBig.value);
  $emitter.emit("rerenderTable");
}
</script>

<style scoped>
.sidebar {
  /* flex-basis: 200px; */
  flex-shrink: 0;
  height: calc(100vh - 56px);
  font-weight: 400;
  background-color: #393a3d;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
  transform: translate3d(0, 0, 0);
  z-index: 20;
}

.sidebar__main {
  max-height: calc(100vh - 56px - 44px);
  row-gap: 4px;
  padding: 20px 12px 12px 12px;
  overflow-y: scroll;
}

.sidebar__main::-webkit-scrollbar {
  width: 4px;
  background-color: transparent;
}

.sidebar__main::-webkit-scrollbar-thumb {
  background-color: var(--clr-t-border);
}

.sidebar__item {
  height: 44px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  padding-left: 12px;
  column-gap: 12px;
  color: #fff;
}

.sidebar .item__text {
  font-size: var(--fs-caption);
  line-height: var(--lh-caption);
}

.sidebar__footer {
  height: 44px;
  width: 100%;
  color: #fff;
  display: flex;
  align-items: center;
  padding-left: 24px;
  column-gap: 12px;
  border-top: 1px solid var(--clr-t-setext);
}

.item__hoverbox {
  background-color: #393a3d;
  border-radius: 4px;
  padding: 12px;
  position: absolute;
  width: max-content;
  left: 85px;
}

.item__hoverbox .hover__arrow {
  width: 10px;
  height: 10px;
  background-color: #393a3d;
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.sidebar__item:hover {
  background-color: #616164;
  cursor: pointer;
}

.sidebar__footer:hover {
  background-color: #616164;
  cursor: pointer;
}

.sidebar__item--highlight {
  background-color: #58595d;
}
</style>
