<template>
  <div class="pcontent">
    <div class="pcontent__heading">
      <div class="pcontent__title">Nhân viên</div>
      <BaseButton
        bname="Thêm mới nhân viên"
        class="btn btn--medium btn--primary"
      />
    </div>
    <div class="pcontent__container">
      <div class="pcontent__searchbar">
        <BaseTextfield
          pholder="Tìm kiếm theo mã, tên nhân viên"
          class="txtfield--search mw-300"
        />
        <BaseButton class="btn btn--medium mi mi-36 mi-refresh" />
      </div>
      <BaseTable />
    </div>
  </div>
</template>

<script setup>
import BaseButton from "../base/BaseButton.vue";
import BaseTextfield from "../base/BaseTextfield.vue";
import BaseTable from "../base/BaseTable.vue";
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

.pcontent__searchbar .txtfield__input {
  width: 300px;
}
</style>
