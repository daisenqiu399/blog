import { readdirSync, statSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { timeStamp } from "console";

// 笔记顶级分类
// export const COLS = [
//   { text: "🏃 面经分享", link: "/Interviews/" },
//   { text: "🍩 学习笔记", link: "/Learning/" },
//   { text: "🔮 随想杂文", link: "/Thoughts/" },
// ];

// TODO: 元数据处理，中英对照，归档

const INDEX_FILE = "index";

/**
 * 生成 vitepress 所需的 sidebar 配置信息
 * @param {*} notesRootPath - md 笔记文件存放的根目录，将从该目录开始解析
 * @param {*} pagePath - 要解析的目录名称
 * @param {*} prefix - 不包含根目录的前缀路由
 * @returns
 */
function generate(notesRootPath, pagePath, prefix = "", depth = 0) {
  if (depth >= 3) return [];

  // 构造绝对路径，用于读取目录下的所有文件信息
  const dir = path.join(process.cwd(), notesRootPath, prefix, pagePath);
  // 构造相对路径，用于设置 sidebar 中的 link 字段
  const relDir = path.join(prefix, pagePath);
  // sidebar 初始化
  const sidebarSection = {
    text: pagePath.replace(/\//g, ""),
    items: [],
    collapsed: depth >= 2,
  };
  const sidebarConfig = [sidebarSection];

  const files = readdirSync(dir) || [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = statSync(filePath);

    // 对于目录
    if (stats.isDirectory()) {
      const childItems = generate(notesRootPath, file, relDir, depth + 1);
      // 剔除不包含 md 文件的目录
      if (childItems[0].items.length === 0) continue;
      sidebarSection.items.push(...childItems);
    }
    // 对于文件
    else {
      // 索引文件
      const fileName = file.replace(/\.md$/, "");
      // 处理非 md 文件
      if (file === fileName) continue;

      const rawLink = path.join(relDir, fileName);
      const tmpLink = rawLink.split("\\").join("/");
      // 处理 index 文件
      if (fileName === INDEX_FILE) sidebarSection.link = tmpLink;
      else
        sidebarSection.items.push({
          text: fileName,
          link: tmpLink,
        });
    }
  }
  return sidebarConfig;
}

export function getSidebar(notesRootPath, pagePath) {
  const sidebarConfig = generate(notesRootPath, pagePath);
  return {
    text: sidebarConfig[0].text,
    items: sidebarConfig[0].items,
  };
}
