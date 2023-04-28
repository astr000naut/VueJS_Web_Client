<template>
  <TheHeader />
  <div class="mainarea">
    <TheSidebar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import TheHeader from "./components/layout/TheHeader.vue";
import TheSidebar from "./components/layout/TheSidebar.vue";
</script>

<style scoped>
.mainarea {
  display: flex;
}
</style>
