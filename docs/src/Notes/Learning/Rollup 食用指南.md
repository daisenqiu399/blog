---
outline: deep
updateTime: "2023-10-02 16:28"
tags: "Rollup/手册"
desc: "快速上手 JavaScript模块打包工具 Rollup。本文将带你了解 Rollup的基本概念以及如何优雅地食用 Rollup."
---

**🍰 Rollup 是什么？**

Rollup 是一个用于 JavaScript 的模块打包工具 ⚙️ ，它也可以将项目中散落的细小模块打包为整块代码，从而使得这些划分的模块可以更好的运行在浏览器环境或者 Node.js 环境。Rollup 通常用于框架与类库的开发，例如 Vue,React 这些知名的前端框架就是使用 Rollup 构建的。

**✨ 为什么需要 Rollup？**

1. **代码组织**: 在大型项目中，我们通常会将代码分解为多个模块，以便更好地组织和管理代码（例如 `index.js` 入口函数调用 `util.js` 中的模块）。然而，浏览器并不直接支持模块系统，因此我们需要使用打包工具将分散的代码打包成一个或几个文件。
2. **性能优化**：Rollup 会静态分析导入的代码，排除其中并没有被使用的内容，从而减小最终的代码体积，这个过程被称为除屑优化（Tree-Shaking）。
3. **便于分发**：假设我们正在创建一个库，使用 Rollup 打包能够帮助你的库更容易被其他开发者使用。例如有的开发人员想要在浏览器中使用你的库，有的开发人员想使用 CommonJS 的方式导入你的库，你不需要编写多个版本的代码，Rollup 可以帮你打包成各种各样的格式。

**🎯 Rollup 与 Webpack 有什么区别？**

1. Webpack 是一个通用的模块打包工具，它不仅可以处理 JavaScript，还可以处理 CSS、图片和其他类型的资源。Webpack 的设计哲学是“一切皆模块”，它有丰富的插件系统和 loader 系统，可以通过配置来满足各种复杂的需求，通常用于构建大型应用程序。

2. Rollup 的设计哲学是“尽可能地生成小的 bundle”。它专注于 JavaScript 的静态模块打包，并且使用了 tree shaking 技术来移除无用的代码，生成更小的文件。Rollup 更适合用于打包库和框架。

> 简而言之，如果你正在开发 JavaScript 框架或是类库，那你一定要尝试一下 Rollup.

## 🚀 快速上手

该部分内容笔者建议阅读官方文档的 Tutorial（简直是保姆式教程！）

<LinkCard link="https://www.rollupjs.com/tutorial/" desc="教程 | Rollup 中文文档" />

需要**注意**的配置项： `output.name`

对于输出格式为 `iifs`/`umd` 的代码来说，如果想要使用全局变量名来表示打包后的代码，该选项是必要的。例如此时相关代码如下:

::: code-group

```js [src/index.js]
export function hi() {
  console.log("Hello Rollup");
}
```

````js [rollup.config.js]
export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'MyBundle'
  }
};

:::

打包后结果如下：

``` js
var MyBundle = (function () {...
````

在浏览器中你可以通过这样的代码来调用函数 `hi`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document</title>
    <script src="bundle.js"></script>
    <script>
      MyBundle.hi();
    </script>
  </head>
</html>
```

::: danger 注意

如果你使用了 terser 插件的 toplevel 会导致 output.name 失效.

:::

## 🔨 可能有用的插件

- `@rollup/plugin-json`

通常来讲 Rollup 只允许你引入 ES Module, 这个插件能够帮助你从 JSON 文件中导入数据，还会剔除没有被使用过的字段（如果你阅读过 Rollup 的教程部分那你对这个插件一定不陌生）

- `@rollup/plugin-commonjs`

这个插件让 Rollup 能够处理那些使用 CommonJS 模块系统（这是 Node.js 中使用的模块系统）编写的代码。即类似 `const fs = require('fs')` 的写法。

上述插件都是为了拓展 Rollup 的导入能力，还有许多其他类似的插件，用于导入图片，CSS 等等资源
。

- `@rollup/plugin-node-resolve`

协助 Rollup 定位并打包第三方 Node.js 模块。例如，当你在代码中输入`import _ from 'lodash-es'`，Rollup 默认只会在项目的本地文件中进行搜索，而不会去`node_modules` 目录中寻找。这时候就需要这个插件来帮助 Rollup 找到 `lodash-es`。

- `@rollup/plugin-terser`

用于压缩和优化你的 JavaScript 代码，它能够删除未使用的代码，对代码进行压缩以及混淆。这个插件在构建生产环境的代码时非常有用。

- `@rollup/plugin-replace`

这个插件的主要功能是在你的源代码中查找并替换特定的字符串或者模式。它在构建过程中非常有用，因为它可以帮助你动态地修改代码。比如，你可能想在开发环境和生产环境中使用不同的配置，或者你可能想在代码中插入当前的构建时间或者版本号。下面是一个简单的例子，`process.env.NODE_ENV`将会被替换为字符串 `'production'`

```js
import replace from "@rollup/plugin-replace";

rollup({
  input: "main.js",
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      __buildDate__: () => new Date(),
      __buildVersion: 15,
    }),
  ],
});
```

- `rollup-plugin-typescript2`

让你能够在 Rollup 打包过程中使用 TypeScript。你可以自定义 TypeScript 编译选项，例如指定一个 `tsconfig.json` 文件，又或者动态覆盖`tsconfig.json`中的内容。

```js
import typescript from "rollup-plugin-typescript2";

rollup({
  ...
  plugins: [
    typescript({
      tsconfig: resolve("tsconfig.json"),
        tsconfigOverride: {
          compilerOptions: {
          target: isBrowserBuild ? "es5" : "es6",
         },
      },
    })
  ],
});
```

## 📚 浅析 Vue 构建过程

Vue3 源码仓库地址：

<LinkCard link="https://github.com/vuejs/core" desc="Vue.js/core | Github" />

与构建相关的代码： `rollup.config.js` 和 `scripts/build.js`

- `build.js`：首先解析命令行参数，随后使用 `execa` 调用 `rollup` 打包命令，并将动态构建的环境变量传递给 `rollup` 使用，最后还检查文件的大小并计算压缩后的大小。
- `rollup.config.js`：根据传入的环境变量配置插件，入口文件，导出信息等等。

与常规的打包过程相比，Vue 还使用了一个额外的文件 `build.js` 去参与整个打包过程。它的作用其实可以用一句话来概括，就是向配置文件传递环境变量。

至于为什么不直接使用 Rollup 命令行的 `--environment` 参数，这是直接因为 Rollup 命令行不够灵活，在某些需求下，环境变量可能具有多个不同的取值，我们想要动态的构造环境变量，又或者说对传入的环境变量进行解析，验证以及类型的转换。我们需要一个专门的脚本文件去达成上述的个性化需求。
