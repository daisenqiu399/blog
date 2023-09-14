<template>
  <div
    @click="openLink"
    class="flex flex-col items-center p-6 transition-all duration-300 border cursor-pointer group hover:border-indigo-800 dark:hover:border-sky-300 dark:border-transparent bg-slate-50 dark:bg-slate-800 dark:text-slate-300 w-52 h-52 rounded-xl"
  >
    <!-- 头像 -->
    <div class="w-16 h-16 rounded-full VP-shadow">
      <img :src="avatar" :alt="name" />
    </div>
    <!-- 简介 -->
    <div class="text-center">
      <h1 class="text-lg font-bold tracking-wider dark:text-zinc-200">
        {{ name }}
      </h1>
      <p class="dark:text-zinc-400">{{ title }}</p>
      <p
        class="inline-block text-sm text-indigo-400 transition-all duration-300 border-b border-indigo-400 dark:text-sky-400 dark:border-sky-400 sm:opacity-0 group-hover:opacity-100"
      >
        🔗{{ shortLink }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const friendsInfo = defineProps(["avatar", "name", "title", "link"]);

const shortLink = computed(() => {
  let baseLink = friendsInfo.link;
  const regex = /^(http|https):\/\/(.*)$/;
  return baseLink.replace(regex, "$2");
});

function openLink() {
  console.log(friendsInfo.link);
  window.open(friendsInfo.link, "_blank");
}

console.log(friendsInfo);
</script>

<style scoped>
.VP-shadow {
  box-shadow: var(--vp-shadow-3);
}
</style>
