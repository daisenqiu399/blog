<template>
  <VPTeamPage>
    <VPTeamPageTitle>
      <template #title>🎨 My Friends 🙌</template>
      <template #lead>...</template>
    </VPTeamPageTitle>
    <VPTeamMembers size="small" :members="members" />
    <FriendsCard v-bind="friendsInfo[0]"></FriendsCard>
  </VPTeamPage>
</template>

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection,
} from "vitepress/theme";

import FriendsCard from "./FriendsCard.vue";

const friendsInfo = [
  {
    avatar: "https://www.github.com/yaossg.png",
    name: "Yaossg",
    title: "Frontend Engineer",
    link: "https://Yaossg.com",
  },
];

const members = [
  {
    avatar: "https://www.github.com/yaossg.png",
    name: "Evan You",
    title: "Creator",
    links: [
      { icon: "github", link: "https://github.com/yyx990803" },
      { icon: "twitter", link: "https://twitter.com/youyuxi" },
    ],
  },
  {
    avatar: "https://www.github.com/zbwer.png",
    name: "Evan You",
    title: "Creator",
    links: [
      { icon: "github", link: "https://github.com/yyx990803" },
      { icon: "twitter", link: "https://twitter.com/youyuxi" },
    ],
  },
  {
    avatar: "https://www.github.com/Timlzh.png",
    name: "Evan You",
    title: "Creator",
    links: [
      { icon: "github", link: "https://github.com/yyx990803" },
      { icon: "twitter", link: "https://twitter.com/youyuxi" },
    ],
  },
  {
    avatar: "https://www.github.com/zzzRemake.png",
    name: "Evan You",
    title: "Creator",
    links: [
      { icon: "github", link: "https://github.com/yyx990803" },
      { icon: "twitter", link: "https://twitter.com/youyuxi" },
    ],
  },
];
</script>
