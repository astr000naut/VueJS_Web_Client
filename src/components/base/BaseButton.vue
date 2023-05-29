<template>
  <button ref="refBtn">{{ bname }}</button>
</template>

<script setup>
//#region import
import { ref } from "vue";
//#endregion

//#region  init
defineProps({
  // Ten button
  bname: String,
});
// Template reference
const refBtn = ref(null);
defineExpose({ refBtn });
//#endregion
</script>

<style
  scoped
  lang="css"
  src="../../css/components/base/base-button.css"
></style>
