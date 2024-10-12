<template>
  <span class="badge" :class="badgeClass">
    <slot>UESTCer</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'
const { color, light } = defineProps(['color', 'light'])

const colorClasses = {
  sky: { light: 'text-sky-600 bg-sky-500/10 dark:bg-sky-100', dark: 'bg-sky-500 text-white' },
  pink: { light: 'text-pink-600 bg-pink-500/10 dark:bg-pink-100', dark: 'bg-pink-500 text-white' },
  indigo: {
    light: 'text-indigo-600 bg-indigo-500/10 dark:bg-indigo-100',
    dark: 'bg-indigo-500 text-white'
  },
  orange: {
    light: 'text-orange-600 bg-orange-500/10 dark:bg-orange-100',
    dark: 'bg-orange-500 text-white'
  },
  green: {
    light: 'text-green-700 bg-green-500/20 dark:bg-green-100',
    dark: 'bg-green-500 text-white'
  },
  default: { light: 'text-black bg-black/5 dark:bg-white/80', dark: 'text-black bg-black/5' }
}

const badgeClass = computed(() => {
  const selectedColor = colorClasses[color] || colorClasses.default
  return light ? selectedColor.light : selectedColor.dark
})
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
