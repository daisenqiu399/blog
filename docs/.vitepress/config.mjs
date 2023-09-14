import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "zbwer's Blog",
  titleTemplate: "zbwer",
  description:
    "zbwer's tech blog: An undergraduate's journey through frontend development, sharing insights, tips, and experiences in web technologies.",
  head: [["link", { rel: "icon", href: "/logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    // 顶部导航栏
    nav: [
      { text: "Blogs", link: "/Notes/index" },
      { text: "Projects", link: "/Project/index" },
      { text: "Friends", link: "Friends.md" },
    ],
    // 文章页面左侧导航
    sidebar: {
      "/Notes/": [
        {
          text: "字节跳动",
          link: "/Notes/",
          items: [
            {
              text: "商业化技术",
              link: "/Notes/面试考点",
              items: [{ text: "一轮", link: "/Notes/面试考点" }],
            },
          ],
          collapsed: false,
        },
      ],
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
  // md 文件根目录
  srcDir: "./src",
  lastUpdated: true,
});
