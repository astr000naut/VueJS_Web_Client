<template>
  <TheHeader />
  <div class="mainarea">
    <TheSidebar />
    <EmployeeList />
  </div>
</template>

<script setup>
import TheHeader from "./components/layout/TheHeader.vue";
import TheSidebar from "./components/layout/TheSidebar.vue";
import EmployeeList from "./components/views/EmployeeList.vue";
</script>

<style scoped>
.mainarea {
  display: flex;
}
</style>
