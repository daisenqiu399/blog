<template>
  <span class="badge text-slate-100" :class="getColor">
    <slot>UESTCer</slot>
  </span>
</template>

<script setup>
import { computed } from "vue";
const { color } = defineProps(["color"]);
console.log(color);
const getColor = computed(() => {
  if (color) return `bg-${color}-500`;
  return "bg-gray-500";
});
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 0 10px;
  line-height: 22px;
  font-size: 12px;
  border-radius: 12px;
}
</style>
