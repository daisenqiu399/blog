import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { getSidebar } from "./utils/getSidebar";

export default defineConfig({
  title: "戴森球",
  titleTemplate: "daisenqiu",
  // md 文件根目录
  srcDir: "./src",
  lastUpdated: true,
  description:
    "戴森球的博客: An undergraduate's journey through frontend development, sharing insights, tips, and experiences in web technologies.",
  head: [["link", { rel: "icon", href: "/mylogo.png" }]],
  themeConfig: {
    logo: "/avatar.jpg",
    // 顶部导航栏
    nav: [
      { text: "关于我", link: "AboutMe.md" },
      { text: "文档", link: "/Notes/index" },
      { text: "友链", link: "Friends.md" },
    ],
    // 文章页面左侧导航
    sidebar: {
      "/Notes/": getSidebar("/docs/src", "/Notes/"),
    },
    // 是否启动搜索功能
    search: {
      provider: "local",
    },
    // 顶部导航栏左侧的社交平台跳转
    socialLinks: [{ icon: "github", link: "https://github.com/daisenqiu399" }],
    // 首页底部版权声明
    footer: {
      copyright: "Copyright © 2023-present daisenqiu",
    },
    // 文章内导航栏标题
    outlineTitle: "导航栏",
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
        {
          find: /^.*\/VPFooter\.vue$/,
          replacement: fileURLToPath(new URL("./components/Footer.vue", import.meta.url)),
        },
      ],
    },
  },
  markdown: {
    math: true,
  },
});
