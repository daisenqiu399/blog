<template>
  <div
    @click="openLink"
    class="p-4 transition-all duration-300 border border-transparent rounded-lg cursor-pointer dark:bg-sky-950 dark:hover:border-sky-600 bg-sky-50 group hover:border-sky-800"
  >
    <header class="text-xl">🐳 {{ desc }}</header>
    <footer
      class="mt-1 transition-all duration-300 text-slate-500 dark:text-slate-400 dark:group-hover:text-sky-400 group-hover:text-sky-700 line-clamp-1"
    >
      {{ link }}
    </footer>
  </div>
</template>

<script setup>
const { desc, link } = defineProps(["desc", "link"]);

function openLink() {
  window.open(link, "_blank");
}
</script>
