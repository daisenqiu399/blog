<template>
  <div
    @click="openLink"
    class="link-card my-3 p-4 transition-all duration-300 rounded-lg shadow-md cursor-pointer hover:bg-sky-100/80 dark:shadow-sky-900/80 hover:scale-[0.99] shadow-sky-400/30 dark:bg-sky-950 dark:hover:bg-sky-950/80 bg-sky-100/50 group"
  >
    <header class="text-xl">🐳 {{ desc }}</header>
    <footer
      class="mt-1 transition-all duration-300 text-slate-500 dark:text-slate-400 dark:group-hover:text-sky-400 group-hover:text-sky-500 line-clamp-1"
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
