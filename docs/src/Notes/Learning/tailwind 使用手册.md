---
outline: deep
updateTime: "2023-09-26 15:36"
tags: "tailwind/手册"
desc: "一文掌握目前最火的原子化 css 解决方案。你将了解到如何在项目中引入 TailwindCss，以及较为常用的基础语法。"
---

TailwindCSS 是一种实用的原子化 CSS 框架，它提供了一套丰富的预定义类，使开发人员可以通过组合这些类来构建用户界面。在笔者看来，其主要的优势有两点：

1. **⚙️ 实用高效**：Tailwind 提供了数千个用于构建用户界面的实用 CSS 类，包括颜色、字体、边距、填充、网格、灵活布局、阴影、动画等。“不需要离开HTML，即可开发现代Web应用”。例如我可以通过 `line-clamp-3` 快速实现多行文字溢出省略的效果，如果使用普通的 CSS 我可能需要四到五行。又例如我可以通过 `md:` 或者 `dark` 等前缀快速编写响应式 / 暗黑主题的样式。
2. **🚀 性能优越**：Tailwind 使用原子化的 CSS 编写方法并提供了一种名为 PurgeCSS 的工具，可以自动删除未使用的 CSS，从而保持最终打包后的样式表尽可能小。

## 📚 快速开始

安装 TailwindCSS 的所有方式可以参考官方文档：[Installation - Taiwind Css](https://tailwindcss.com/docs/installation)

在本文中笔者会对其中三种方法展开介绍。

### CDN 引用

在你的 HTML 文件中嵌入下面第 6 行高亮代码，即可开始极速体验 TailwindCss，无需任何构建步骤。

::: warning
CDN 引用的方法**强烈建议**仅用于开发目的，由于 CDN 在某些情况下并不总是稳定，对于生产环境采用其他的选择更加稳妥安全。（或许这种方式适合快速制作网站预览图😎）
::: 

下面代码的第 9 行是关于 TailwindCss 的简单应用，用来检查 CDN 是否成功引入，如果你观察到字体的颜色是蓝色，那么恭喜你成功引入了🥳。至于这行语句的具体含义，我们将在后文进行解释。

```html:line-numbers {6,9}
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <h1 class="text-3xl font-bold text-sky-500">
    Hello world!
  </h1>
</body>
</html>
```


### 使用 Tailwind CLI

1. **安装 TailwindCss & 初始化配置文件**

```shell
npm install -D tailwindcss
npx tailwindcss init
```

第 1 行指令会在你的项目中安装 TailwindCss
第 2 行指令会在项目根目录中创建一个 `tailwind.config.js` 文件，里面将会记录相关配置信息。

2. **配置模板路径**

TailwindCss 的工作原理简单来讲是这样的，扫描项目中的某些文件（例如 HTML 后缀），分析这些文件中出现的类名（或是 TailwindCss 相关语法），从而生成对应的样式文件。那么我们要做的第一步就是在 `tailwind.config.js` 确定哪些文件是需要被识别的。我们看到下面的配置代码：

```js{3}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

其中 `content` 字段指定了哪些文件会被扫描，在上述代码中指的是 `src` 目录下所有的 HTML 和 js 文件将会被扫描。

3. **在 CSS 插入 TailwindCss 命令**

在你平常存放 CSS 代码的目录下新建一个文件（名字叫啥都无所谓），我们姑且命名为 `input.css`，在其中加入以下代码：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

或许你想了解一下这三行代码是在干什么？

1. `base` : 插入 Tailwind 的基础样式，这包括一些标准化的样式（例如，将 box-sizing 设置为 border-box，设置所有元素的 margin 和 padding 为 0 等）以及一些 HTML 元素的默认样式（例如，设置字体样式、颜色等）。（你可以理解为全局样式初始化）
2. `components` ：插入由 @apply 指令生成的所有组件样式。这些通常是你在项目中定义的复用的、定制的组件，例如按钮、卡片、表单等。（其实笔者也没用过😜）
3. `utilities` ：插入所有的实用程序类，这是 Tailwind 的主要部分，包括颜色、字体、间距、布局、阴影等所有的实用程序类。

官方文档的解释在这里：[Directives - Tailwind Css](https://tailwindcss.com/docs/functions-and-directives#tailwind)

4. **愉快地使用**

现在你可以在你的 HTML 文件中愉快地使用 TailwindCss 了，让我们编写一个简单的 demo 试一试。

```html{2}
<!-- 省略了不必要的代码 -->
<h1 class="text-3xl font-bold text-sky-500">
  Hello world!
</h1>
```

然而我们并不能生效，这是因为缺少了最为重要的一步构建操作。

现在让我们在 cmd 中输入下面的代码：

```shell
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch 
```

- `./src/input.css` 是我们在第 3 步中新建的文件，请确保在 cmd 中输入的路径是正确的。
- `./src/output.css` 是预期输出文件的路径。当运行上述代码时，TailwindCss 会从`input.css`中导入基本的工具，随后扫描在第 2 步中设置的文件，然后生成一个全新的 CSS 文件，在本例中，这个文件就叫做 `output.css`
- `watch` 选项的作用是启动一个监视器，当你的正在编写的 HTML 代码发生变动时，就会触发重新编译。

::: danger 注意
使用 watch 选项时，请不要去编辑 input.css 中的代码，这会导致无限循环。

你可以先停止 watch 的运行，完成编辑后再重新启动 watch
:::

此时我们修改之前的 HTML 代码：（引入构建后的 CSS 文件）

```html{7,11}
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- 引入构建后的样式文件 -->
  <link href="/src/output.css" rel="stylesheet">
  <!-- <script src="https://cdn.tailwindcss.com"></script> -->
</head>
<body>
<h1 class="text-3xl font-bold text-sky-500">
    Hello world!
  </h1>
</body>
</html>
```
🎉 这时候就能正常工作啦！



### 使用 PostCss

官方文档📖的说法是这样的：将 TailWindCSS 安装为 PostCSS 插件是将其与 webpack 、 Rollup 、 Vite 和 Parcel 等构建工具集成的最无缝方式。笔者在使用 Vue 框架时通常会选择这种方式来安装 TailWindCSS.

1. **安装 TailWindCSS 与同级依赖**

```shell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

这一步与上一种方法十分类似，不同之处在于我们还安装了另外两个依赖项，或许你想了解一下他们是用来干什么的🤓：

1. `PostCSS`：一个用 JavaScript 编写的工具，可以对 CSS 进行转换。它允许你使用不同 的 JavaScript 插件来处理 CSS，这些插件可以执行各种任务（例如 TailwindCSS 就是一个插件）
2. `Autoprefixer`：一个 PostCSS 插件，用于为某些 CSS 属性添加前缀，例如，你可能会写 `display: flex;` 该插件会自动将其转换为 `display: -webkit-box; display: -ms-flexbox; display: flex;`，以确保在旧版本的浏览器中也能正确显示。

2. **配置 PostCSS 插件 & 模板路径**

在项目根目录下新建 `postcss.config.js` 写入以下代码，完成 PostCSS 的插件配置。

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

在项目根目录下新建 `tailwind.config.js` 写入以下代码，完成模板路径的配置。这是什么意思呢？**看看上一种方法的第二步吧**！

```js{3}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. **在 CSS 插入 TailwindCss 命令**

在你平常存放 CSS 代码的目录下新建一个文件 `Tailwind.css`（其实名字叫啥都无所谓），在本文中，笔者存放的位置是  `/src/assets/style` ，在其中写入以下代码：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

改代码的具体含义已在上一种方法中介绍过了，这里就不再赘述啦💣。

4. **全局引入 TailwindCss**

我们需要在项目中全局挂载之后，才能正式开始使用。这里笔者以 Vue 为例，在 `src` 目录下的 `main.js` 中加入下面高亮部分的代码：

```js{5}
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/style/tailwindcss.css'
// 这里路径要正确哦~
const app = createApp(App);
app.use(store);
app.use(router);

app.mount('#app');
```

🎉 此时就可以愉快地使用啦！

## 🔥 常见语法

:::warning 🚧 2023-09-26 15:34
咕咕咕
:::