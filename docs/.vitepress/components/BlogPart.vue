<template>
  <div class="w-full max-w-6xl mx-auto">
    <!-- 类别标题 -->
    <h1
      class="pb-2 text-3xl font-bold transition-all duration-300 border-b-4 border-sky-500 dark:border-sky-700 w-fit hover:pr-7"
    >
      {{ columnData.text }}
    </h1>
    <div class="flex flex-col mb-4 lg:flex-row">
      <!-- 最近更新的三篇文章 -->
      <li
        @click="openLink(item.link)"
        v-for="(item, index) in columnData.items.slice(0, 3)"
        :key="index"
        class="mt-6 lg:px-2 list-none min-w-full lg:min-w-[33%] cursor-pointer"
      >
        <div
          class="flex flex-col justify-between p-4 transition-all duration-300 border rounded-lg lg:h-full dark:bg-slate-800 dark:border-slate-900 lg:dark:hover:border-sky-400 bg-zinc-50 group lg:hover:border-indigo-800 hover:-translate-y-3"
        >
          <!-- 更新时间 -->
          <p class="text-sm text-zinc-400">
            {{ getDateTime(item.updateTime) }}
          </p>
          <!-- 标题 -->
          <h1 class="mt-1 text-2xl font-bold">{{ item.text }}</h1>
          <!-- 摘要 -->
          <p
            class="flex-1 mt-2 transition-all duration-300 text-black/60 dark:text-slate-500 dark:group-hover:text-white/80 group-hover:text-black line-clamp-3"
          >
            {{ item.desc }}
          </p>
          <!-- tags -->
          <div class="flex justify-end w-full mt-2">
            <p
              v-for="(tag, tagIndex) in getTags(item)"
              :key="tagIndex"
              :class="tagIndex >= 1 ? 'ml-2' : ''"
              class="px-2 text-sm border rounded-full text-zinc-400 dark:text-zinc-200"
            >
              {{ tag }}
            </p>
          </div>
        </div>
      </li>
    </div>
  </div>
</template>

<script setup>
const { columnData } = defineProps(["columnData"]);
import { useRouter } from "vitepress";
const router = useRouter();

// 格式化文章更新时间
function getDateTime(item) {
  let date = new Date(item);
  let formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
}

// 获取文章的前两个tag
function getTags(item) {
  if (!item?.tags) return [];
  let tagsArr = item.tags.split("/").slice(0, 2);
  return tagsArr;
}
// 打开文章连接
function openLink(link) {
  router.go(link);
}
</script>

<style scoped>
*::-webkit-scrollbar {
  display: none;
}
</style>
