<template>
  <Teleport to="body">
    <EmployeeForm v-show="!isFormOpened" @close-form="toggleEmployeeForm" />
  </Teleport>
  <div class="pcontent">
    <div class="pcontent__heading">
      <div class="pcontent__title">Nhân viên</div>
      <BaseButton
        bname="Thêm mới nhân viên"
        class="btn--primary"
        @click="toggleEmployeeForm"
      />
    </div>
    <div class="pcontent__container">
      <div class="pcontent__searchbar">
        <BaseTextfield
          pholder="Tìm kiếm theo mã, tên nhân viên"
          class="txtfield--search mw-300"
        />
        <BaseButton class="mi mi-36 mi-refresh" />
      </div>
      <BaseTable />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import EmployeeForm from "./EmployeeForm.vue";
const isFormOpened = ref(false);

function toggleEmployeeForm() {
  isFormOpened.value = !isFormOpened.value;
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
}
</style>
