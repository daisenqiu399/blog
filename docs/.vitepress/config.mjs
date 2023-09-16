import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { getSidebar } from "./utils/getSidebar";
export default defineConfig({
  title: "zbwer's Blog",
  titleTemplate: "zbwer",
  // md 文件根目录
  srcDir: "./src",
  lastUpdated: true,
  description:
    "zbwer's tech blog: An undergraduate's journey through frontend development, sharing insights, tips, and experiences in web technologies.",
  head: [["link", { rel: "icon", href: "/logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    // 顶部导航栏
    nav: [
      { text: "About", link: "AboutMe.md" },
      { text: "Blogs", link: "/Notes/index" },
      { text: "Projects", link: "Projects.md" },
      { text: "Friends", link: "Friends.md" },
    ],
    // 文章页面左侧导航
    sidebar: {
      "/Notes/": getSidebar(),
    },
    // 是否启动搜索功能
    search: {
      provider: "local",
    },
    // 顶部导航栏左侧的社交平台跳转
    socialLinks: [{ icon: "github", link: "https://github.com/ZbWeR" }],
    // 首页底部版权声明
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2023-present zbwer",
    },
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPDocFooterLastUpdated\.vue$/,
          replacement: fileURLToPath(
            new URL("./components/UpdateTime.vue", import.meta.url)
          ),
        },
      ],
    },
  },
});
