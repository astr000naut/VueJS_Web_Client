<template>
  <router-view name="EmployeeForm"></router-view>
  <div class="pcontent">
    <div class="pcontent__heading">
      <div class="pcontent__title">Nhân viên</div>
      <BaseButton
        bname="Thêm mới nhân viên"
        class="btn--primary"
        @click="btnAddOnClick"
      />
    </div>
    <div class="pcontent__container">
      <div class="pcontent__searchbar">
        <BaseTextfield
          pholder="Tìm kiếm theo mã, tên nhân viên"
          class="txtfield--search mw-300"
        />
        <BaseButton class="mi mi-36 mi-refresh" @click="btnRefreshOnClick" />
        <div class="button__hoverbox">
          <div class="hover__arrow"></div>
          <div class="hover__text">Tải lại dữ liệu</div>
        </div>
      </div>
      <EmployeeTable ref="basetable" />
    </div>
  </div>
</template>

<script setup>
import EmployeeTable from "@/components/views/employee-management/EmployeeTable.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const basetable = ref(null);

function btnAddOnClick() {
  router.replace("/employee/create");
}

function btnRefreshOnClick() {
  basetable.value.loadData();
}
</script>

<style scoped>
.pcontent {
  flex: 1;
  height: calc(100vh - 56px);
  min-width: 800px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

/* Heading */

.pcontent__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.pcontent__title {
  flex-shrink: 0;
  font-size: var(--fs-head1);
  font-weight: 700;
  line-height: var(--lh-head1);
}

/* Container */

.pcontent__container {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 200px;
  overflow: hidden;
  margin-top: 24px;
  background-color: #fff;
  padding: 24px 24px 12px 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Search bar */
.pcontent__searchbar {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  column-gap: 24px;
  overflow: hidden;
  align-items: center;
}
.button__hoverbox {
  display: none;
  z-index: 20;
  position: absolute;
  top: 0px;
  right: 0px;
}

.hover__text {
  padding: 4px 8px;
  background-color: #393a3d;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
}
.hover__arrow {
  width: 10px;
  height: 10px;
  background-color: #393a3d;
  position: absolute;
  bottom: -9px;
  right: 42%;
  transform: translateY(-50%) rotate(45deg);
}

.mi-refresh:hover + .button__hoverbox {
  display: block;
}
</style>
