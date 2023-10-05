---
outline: deep
updateTime: "2023-09-27 11:24"
tags: "tailwind/手册"
desc: "一文掌握目前最火的原子化 css 解决方案。你将了解到如何在项目中引入
  TailwindCSS，以及较为常用的基础语法。"
---

> 一文掌握目前最火的原子化 css 解决方案。你将了解到如何在项目中引入 TailwindCSS，以及较为
> 常用的基础语法。

TailwindCSS 是一种实用的原子化 CSS 框架，它提供了一套丰富的预定义类，使开发人员可以通过组合这些类来构建用户界面。在笔者看来，其主要的优势有两点：

1. **⚙️ 实用高效**：Tailwind 提供了数千个用于构建用户界面的实用 CSS 类，包括颜色、字体、边距、填充、网格、灵活布局、阴影、动画等。“不需要离开 HTML，即可开发现代 Web 应用”。例如我可以通过 `line-clamp-3` 快速实现多行文字溢出省略的效果，如果使用普通的 CSS 我可能需要四到五行。又例如我可以通过 `md:` 或者 `dark` 等前缀快速编写响应式 / 暗黑主题的样式。
2. **🚀 性能优越**：Tailwind 使用原子化的 CSS 编写方法并提供了一种名为 PurgeCSS 的工具，可以自动删除未使用的 CSS，从而保持最终打包后的样式表尽可能小。

## 📚 快速开始

安装 TailwindCSS 的所有方式可以参考官方文档：
<LinkCard desc="Installation - Tailwind Css" link="https://TailwindCSS.com/docs/installation" />

在本文中笔者会对其中三种方法展开介绍。

### CDN 引用

在你的 HTML 文件中嵌入下面第 6 行高亮代码，即可开始极速体验 TailwindCSS，无需任何构建步骤
。

::: warning
CDN 引用的方法**强烈建议**仅用于开发目的，由于 CDN 在某些情况下并不总是稳定，对于生产环境采用其他的选择更加稳妥安全。（或许这种方式适合快速制作网站预览图 😎）
:::

下面代码的第 9 行是关于 TailwindCSS 的简单应用，用来检查 CDN 是否成功引入，如果你观察到字体的颜色是蓝色，那么恭喜你成功引入了 🥳。至于这行语句的具体含义，我们将在后文进行解释。

```html:line-numbers {6,9}
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.TailwindCSS.com"></script>
</head>
<body>
  <h1 class="text-3xl font-bold text-sky-500">
    Hello world!
  </h1>
</body>
</html>
```

### 使用 Tailwind CLI

1. **安装 TailwindCSS & 初始化配置文件**

```shell
npm install -D TailwindCSS
npx TailwindCSS init
```

第 1 行指令会在你的项目中安装 TailwindCSS 第 2 行指令会在项目根目录中创建一个`tailwind.config.js` 文件，里面将会记录相关配置信息。

2. **配置模板路径**

TailwindCSS 的工作原理简单来讲是这样的，扫描项目中的某些文件（例如 HTML 后缀），分析这些文件中出现的类名（或是 TailwindCSS 相关语法），从而生成对应的样式文件。那么我们要做的第一步就是在 `tailwind.config.js` 确定哪些文件是需要被识别的。我们看到下面的配置代码：

```js{3}
/** @type {import('TailwindCSS').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

其中 `content` 字段指定了哪些文件会被扫描，在上述代码中指的是 `src` 目录下所有的 HTML 和 js 文件将会被扫描。

3. **在 CSS 插入 TailwindCSS 命令**

在你平常存放 CSS 代码的目录下新建一个文件（名字叫啥都无所谓），我们姑且命名为 `input.css`，在其中加入以下代码：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

或许你想了解一下这三行代码是在干什么？

1. `base` : 插入 Tailwind 的基础样式，这包括一些标准化的样式（例如，将 box-sizing 设置为 border-box，设置所有元素的 margin 和 padding 为 0 等）以及一些 HTML 元素的默认样式（例如，设置字体样式、颜色等）。（你可以理解为全局样式初始化）
2. `components` ：插入由 @apply 指令生成的所有组件样式。这些通常是你在项目中定义的复用的、定制的组件，例如按钮、卡片、表单等。（其实笔者也没用过 😜）
3. `utilities` ：插入所有的实用程序类，这是 Tailwind 的主要部分，包括颜色、字体、间距、布局、阴影等所有的实用程序类。

官方文档的解释在这里：
<LinkCard desc="Directives - Tailwind Css" link="https://TailwindCSS.com/docs/functions-and-directives#tailwind" />

4. **愉快地使用**

现在你可以在你的 HTML 文件中愉快地使用 TailwindCSS 了，让我们编写一个简单的 demo 试一试。

```html{2}
<!-- 省略了不必要的代码 -->
<h1 class="text-3xl font-bold text-sky-500">
  Hello world!
</h1>
```

然而我们并不能生效，这是因为缺少了最为重要的一步构建操作。

现在让我们在 cmd 中输入下面的代码：

```shell
npx TailwindCSS -i ./src/input.css -o ./src/output.css --watch
```

- `./src/input.css` 是我们在第 3 步中新建的文件，请确保在 cmd 中输入的路径是正确的。
- `./src/output.css` 是预期输出文件的路径。当运行上述代码时，TailwindCSS 会从`input.css`中导入基本的工具，随后扫描在第 2 步中设置的文件，然后生成一个全新的 CSS 文件，在本例中，这个文件就叫做 `output.css`
- `watch` 选项的作用是启动一个监视器，当你的正在编写的 HTML 代码发生变动时，就会触发重新编译。

::: danger
注意使用 watch 选项时，请不要去编辑 input.css 中的代码，这会导致无限循环。

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
  <!-- <script src="https://cdn.TailwindCSS.com"></script> -->
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

官方文档 📖 的说法是这样的：将 TailwindCSS 安装为 PostCSS 插件是将其与 webpack 、 Rollup、 Vite 和 Parcel 等构建工具集成的最无缝方式。笔者在使用 Vue 框架时通常会选择这种方式来安装 TailwindCSS.

1. **安装 TailwindCSS 与同级依赖**

```shell
npm install -D TailwindCSS postcss autoprefixer
npx TailwindCSS init
```

这一步与上一种方法十分类似，不同之处在于我们还安装了另外两个依赖项，或许你想了解一下他们是用来干什么的 🤓：

1. `PostCSS`：一个用 JavaScript 编写的工具，可以对 CSS 进行转换。它允许你使用不同 的 JavaScript 插件来处理 CSS，这些插件可以执行各种任务（例如 TailwindCSS 就是一个插件）
2. `Autoprefixer`：一个 PostCSS 插件，用于为某些 CSS 属性添加前缀，例如，你可能会写`display: flex;` 该插件会自动将其转换为`display: -webkit-box; display: -ms-flexbox; display: flex;`，以确保在旧版本的浏览器中也能正确显示。

3. **配置 PostCSS 插件 & 模板路径**

在项目根目录下新建 `postcss.config.js` 写入以下代码，完成 PostCSS 的插件配置。

```js
module.exports = {
  plugins: {
    TailwindCSS: {},
    autoprefixer: {},
  },
};
```

在项目根目录下新建 `tailwind.config.js` 写入以下代码，完成模板路径的配置。这是什么思呢？**看看上一种方法的第二步吧**！

```js{3}
/** @type {import('TailwindCSS').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. **在 CSS 插入 TailwindCSS 命令**

在你平常存放 CSS 代码的目录下新建一个文件 `Tailwind.css`（其实名字叫啥都无所谓），在本文中，笔者存放的位置是 `/src/assets/style` ，在其中写入以下代码：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

改代码的具体含义已在上一种方法中介绍过了，这里就不再赘述啦 💣。

4. **全局引入 TailwindCSS**

我们需要在项目中全局挂载之后，才能正式开始使用。这里笔者以 Vue 为例，在 `src` 目录下的`main.js` 中加入下面高亮部分的代码：

```js{5}
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/style/TailwindCSS.css'
// 这里路径要正确哦~
const app = createApp(App);
app.use(store);
app.use(router);

app.mount('#app');
```

🎉 此时就可以愉快地使用啦！

## ✨ 插件推荐

1. **Tailwind CSS IntelliSense**：主要特性包括自动补全，错误提示，鼠标悬浮查看完整的 CSS (超级有用 🌹)，以及语法高亮。
2. Headwind：一个美化插件，用于将 TailwindCSS 以特定的顺序排列。

```html
<!-- Before -->
<button class="px-4 py-2 text-white sm:px-8 sm:py-3 bg-sky-700 hover:bg-sky-800">
  ...
</button>

<!-- After -->
<button class="px-4 py-2 text-white bg-sky-700 hover:bg-sky-800 sm:px-8 sm:py-3">
  ...
</button>
```

## 🔥 常见语法

关于语法这一部分的内容，我更推荐大家在实践中去查阅官方文档。例如我们平常写样式时，需要给某个 `div` 盒子添加一个背景色，那我就去官方文档搜索 `background color`；又比如需要添加圆角，那就去搜索 `radius` 。这样子多写写就熟悉啦 😎。

此处笔者就简单介绍一下吧。

### 基础语法

- 背景颜色：`bg-sky-400`，通过类似这样的语句，我们可以将一个元素的背景颜色设置为 `sky` 蓝色，调整后面的数值可以获得颜色更深的蓝色。
- 文字颜色：`text-sky-400`，与上面语句类似。
- 长宽：`w-1/2`，这个语句表示设置元素的宽度为父亲元素的 50% 。
- ...（哎呀，自己去看吧，懒得写了 😴）

### 响应式 & 暗黑主题 & 交互效果

通过给上述的基础语法添加前缀，我们就可以实现许多复杂的效果。

1. **响应式**

在 TailwindCSS 语法中，`md:`前缀代指的是 `@media (min-width: 768px) { ... }`，我们来看一个简单的例子。

```html
<div class="bg-sky-400 md:bg-pink-400"></div>
```

上面这个 `div` 元素在移动端设备上显示为蓝色，在宽度大于 768px 的设备上显示为粉色。需要注意的是，我们默认编写的是移动端的样式。有了诸如 `md:` 和 `lg:` 的前缀，以往我们编写响应式布局需要的媒体查询就可以很轻松地写出来了。🥰

2. **暗黑主题**

添加前缀 `dark:` 就能编写暗黑模式下的样式啦。例如下面这个例子，正常状态下为蓝色，暗黑模式下则显示为粉色。

```html
<div class="bg-sky-400 dark:bg-pink-400"></div>
```

关于暗黑模式的更多定制化内容，请参考官方文档（因为我也没用过）：
<LinkCard desc="Dark Mode - Tailwind CSS" link="https://tailwindcss.com/docs/dark-mode"/>

3. **交互效果**

Tailwind CSS 如何实现交互效果下的样式呢，例如 `hover` 和 `focus` 这样的伪类效果，他们的语法是什么样的呢？其实就是换成前缀。例如下面这个例子，正常状态下为蓝色，鼠标悬浮则显示为粉色
。

```html
<div class="bg-sky-400 hover:bg-pink-400"></div>
```

Tailwind CSS 在伪类这部分提供了极其丰富的前缀，建议查阅参考文档：

<LinkCard desc="Handling Hover, Focus, and Other States" link="https://tailwindcss.com/docs/hover-focus-and-other-states"/>

::: danger

注意当你使用 Vue 去编写样式时，可能你会这么写。

```vue
<div :class="`bg-${color}-400`"></div>
```

固然这样很方便，但很遗憾它并不能生效，在使用 TailwindCSS 的语法时，一定不能将其拆分开来。
:::

### 代码复用

或许有一天你会写出这样的代码，有一种好的做法是封装成组件或是使用 `v-for` 渲染，但假如你没有使用框架，可以怎么做呢？

```
<p id="mapArea0" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">⭕</p>
<p id="mapArea1" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">⭕</p>
<p id="mapArea2" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">✔️</p>
<p id="mapArea3" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">✔️</p>
<p id="mapArea4" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">⭕</p>
<p id="mapArea5" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">✔️</p>
<p id="mapArea6" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">⭕</p>
<p id="mapArea7" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">✔️</p>
<p id="mapArea8" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">⭕</p>
```

在 TailwindCSS 的样式文件中写入下面代码：

```css{5-9}
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .game-area {
    @apply flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100;
  }
}
```

然后即可更改上述代码：

```js
<p id="mapArea8" class="flex items-center justify-center w-32 h-32 -mt-px -ml-px text-6xl transition-all bg-white border cursor-pointer hover:bg-slate-100">⭕</p> // [!code --]
<p id="mapArea8" class="game-area">⭕</p> // [!code ++]
```

### 有趣样式收录

🦄 在该部分笔者会收录一些简单优雅又好看的 TailwindCSS 代码。

1. 多行文字溢出省略：`line-clamp-3` 超出三行自动省略，让我们复习一下它的完整 CSS 代码：

```css
overflow: hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
```

2. 渐变色文字

```html
<div class="text-5xl font-extrabold ...">
  <span
    class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500"
  >
    Hello world
  </span>
</div>
```
