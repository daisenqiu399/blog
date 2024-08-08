---
updateTime: "2024-03-10 11:24"
desc: "Vue 八股文の个人理解，包括响应式原理、Pinia 原理与简单实现、router 简要原理"
tags: "八股/Vue"
outline: deep
---

## Vue3 生命周期

![](https://cn.vuejs.org/assets/lifecycle_zh-CN.FtDDVyNA.png)

## V-if 与 V-show 的区别

- `v-if` 是真正 🌟 的条件渲染，当条件值为 false 时，组件不会被渲染，即不会在 DOM 中存在。它确保了在切换时，条件区块内的事件监听器和子组件都会被销毁与重建，这意味着如果切换带有输入框的表单，你将会丢失所有的已输入内容。
- `v-show` 则是简单的 CSS 属性切换，当条件值为 false 时，组件也会被渲染，只是 CSS 的 display 属性会被设置为 none 👻。

总的来说，`v-if` 具有更高的切换开销，而 `v-show` 具有更高的初始渲染开销。**如果需要频繁切换，更推荐使用 `v-show`🚀**；如果在运行时条件很少改变，则推荐使用 `v-if`。

## SPA 和 SSR 的区别

**SPA**: 单页面应用，在首次请求时，服务端会返回一个 HTML 文件，其中只包含了一个根节点，也就是我们 Vue 应用的挂载点。随后，浏览器会根据这个 HTML 文件去请求 js、css 等静态资源，这些资源会被浏览器缓存起来，当我们跳转到其他页面时，浏览器不会再次向服务端发起请求，而是直接从缓存中读取资源，然后根据路由去渲染页面。这个过程通常需要借助 `window.history` 对象或者 `location.hash` 来实现。

- 优点：用户体验好，页面切换快，不需要向服务端发起请求，只需要加载静态资源即可。
- 缺点：由于需要加载整个应用的静态资源，所以首屏加载时间会比较长。由于 HTML 中的内容是动态生成的，不利于搜索引擎优化。

**SSR**: 服务器端渲染。网页是通过服务器渲染生成后输出给客户端，客户端拿到的是已经渲染好的 HTML 文件。当用户在应用中跳转时，会产生新的 HTTP 请求，服务端会根据请求的路径重新渲染页面并返回给客户端。

- 优点：首屏加载快，无需等待所有 JavaScript 代码加载完毕。有利于搜索引擎优化，因为搜索引擎可以直接解析服务器返回的 HTML
- 缺点： 服务器压力大；每次页面跳转需要重新加载，用户体验不佳。

## 响应式原理

在描述 Vue 的响应式原理之前，我们首先需要明白什么是响应式。所谓响应式，就是我们希望一个数据变更之后，所有与之有关的地方都能同步这个更改。比如现在页面中渲染了一个元素代表用户的昵称，那么当我们使用 js 修改了这个昵称的时候，我们希望页面中也能同步修改。这就是响应式。那么根据上面的描述中，我们可以知道，实现响应式需要解决三个问题，第一，我们需要知道哪个数据被修改了；第二，我们需要知道与这个数据相关的地方有哪些；第三，我们需要能够通知这些地方，数据发生了变化。

这里就要介绍一个副作用函数的概念，假如说某一个函数的运行会影响其他函数的运行或是改变应用状态，那么我们将其称之为副作用函数。例如有一个函数，它的功能是设置网页 body 内容为用户昵称，这改变了应用的状态，它就是一个副作用函数。我们希望当用户昵称发生改变时，网页能够重新渲染，也就是说这个函数能够重新执行一遍。也就是说，当响应式数据发生变化时，所有与之相关的副作用函数都应该重新执行。

那么问题来了，如何收集与之相关的副作用函数呢？Vue 给出的方案是利用 Proxy 劫持数据的读取操作。当某个函数读取了响应式数据的值时，会被 Proxy 所劫持，在这个过程中我们可以用一个容器来存储这个函数。这就建立了数据与副作用函数之间的依赖关系。

那么当数据发生变化时，如何通知这些副作用函数重新执行呢？这时候需要借助 Proxy 劫持数据的设置操作。当某个代码企图修改响应式数据的值时，会被 Proxy 所劫持，在这个过程中，我们可以从容器中取出与该数据有关的所有副作用函数，并且让他们重新执行一遍。

总而言之，Vue 响应式系统的原理就是利用 Proxy 劫持对数据的读取与设置操作，在读取时收集或者说跟踪所有的副作用函数，在设置时重新执行与之相关的副作用函数。这就是 Vue 响应式系统的基本概念。在具体实现上，还有更多的内容可以探讨。如果你感兴趣我可以继续说一说。

好的，在之前我说到，在跟踪依赖的时候，我们会将副作用函数放入一个容器之中，那么这个容器具体的数据结构是怎样的呢？最外层是一个 WeakMap，键是被代理的对象，值是一个 Map；这个 Map 的键是代理对象的属性，值是一个 Set；这个 Set 存放了与该对象该属性相关的所有副作用函数。

接着我们再来讲讲收集依赖和触发更新的具体过程。我们谈到，利用 Proxy 劫持数据的读取和设置操作。那么到底什么操作算是读取，什么操作算是设置呢？

我们先来看读取操作，常规的读取方式包括:访问属性，会被 get 所拦截；利用 in 操作符判断属性是否存在于对象上，会被 has 所拦截；使用 for...in 遍历对象，会被 ownKeys 所拦截。

再看到设置操作，常规的设置操作包括：通过赋值操作设置属性，会被 set 所拦截；通过 delete 删除属性，会被 deleteProperty 所拦截。

在读取操作的拦截器中我们跟踪副作用函数，在设置操作的拦截器中我们触发副作用函数的重新执行。这就是 Vue 响应式系统的基本原理。

更复杂的内容包括：副作用函数的嵌套，分支切换导致的副作用依赖变化，数组的响应式等等。还有响应式系统的可调度行，computed 于 watch 的实现等等。

### Vue2 与 Vue3 的响应式原理的区别

Vue2 的响应式原理是基于 Object.defineProperty 实现的，而 Vue3 的响应式原理是基于 Proxy 实现的。Proxy 相比 Object.defineProperty 具有更多的优势，例如：

- Proxy 可以直接监听对象而非属性，所以我们不需要为每个属性都写一遍 set 和 get；
- Proxy 有不仅可以监听对象的读写操作，还可以监听对象的扩展、删除、枚举等操作。
- Proxy 返回的是一个新对象，我们可以只操作新的对象达到目的对象的效果，而 Object.defineProperty 只能遍历对象属性直接修改。
- Proxy 进行深层次代理时，只有深层次的属性被访问时才会触发代理，而 Object.defineProperty 需要一次性递归完对象的所有属性，这意味着 Proxy 的初始化开销更小。

简而言之，Proxy 更加灵活易用，在处理深层次对象时性能更好。

### Vue3 响应式中用到了 Reflect, 它有什么作用

- Reflect 与 Proxy 总是搭配使用的，他们具有的陷阱方法是一一对应的。
- Reflect 更加健壮，当我们设置一个对象上不存在的属性时，Proxy 会抛出错误，而 Reflect 会返回 false，这意味着我们可以更加灵活的处理这种情况。
- Reflect 的某些方法具有一个 `receiver` 参数，这个参数通常用来指定 Proxy 的执行上下文，在一些场景下会更加灵活，例如对象继承中 this 的指向。

```js
const person = {
  _name: "Person",
  get name() {
    return this._name;
  },
};
const proxyPerson = new Proxy(person, {
  get: (target, key, receiver) => {
    console.log("[get]: ", key);
    return Reflect.get(target, key, receiver); // 17 行将会打印 Tom
    return target[key]; // 17行将会打印 Person
  },
});
const tom = { _name: "Tom" };
Object.setPrototypeOf(tom, proxyPerson);
console.log(tom.name);
```

## Pinia 原理

Pinia 是 Vue 的专属状态管理库，允许用户跨界面共享状态。其主要的 API 有两个，一个是 `createPinia`，用于创建一个 Pinia 实例；另一个是 `defineStore`，用于定义一个状态仓库。

- 在创建 Pinia 全局对象时，我们会借助 Vue 提供的 `provide` API 将该实例注入到根组件中，每一个子组件都可以通过 `inject` API 来获取这个实例。这个实例上具有一个 `_s` 属性，这是一个 Map 类型的变量，用于存储所有的状态仓库。
- 在使用 `defineStore` 时，我们通常会传入状态仓库的名称以及 `state, actions, getters` 等属性。在这个函数内部，我们首先会利用 `reactive` API 创建一个空的响应式对象，随后我们会将 `state, actions, getters` 等属性挂载到这个对象上。最后我们将会通过 `inject` API 获取到 Pinia 实例，然后在实例的 `_s` 属性中存储这个状态仓库。

总的来说，Pinia 的原理就是利用 Vue 的 `provide` 和 `inject` API 来实现状态仓库的全局共享，利用 `reactive` API 来实现状态仓库的响应式。

::: details miniPinia 实现代码

```typescript
import { computed, inject, reactive } from "vue";
const piniaSymbol = Symbol("pinia");

interface Pinia {
  _s: Map<string, any>;
}

export const createPinia = () => {
  const pinia = {
    _s: new Map(),
    install(app: any) {
      app.provide(piniaSymbol, pinia);
    },
  };
  return pinia;
};

type StoreAction = {
  [key: string]: (...args: any[]) => void;
};

interface StoreOption {
  state: () => any;
  actions?: StoreAction;
  getters?: any;
}

export const defineStore = (id: string, options: StoreOption) => {
  const store = reactive<Record<string, any>>({});

  const { state, actions, getters } = options;

  if (state && typeof state === "function") {
    const _state = state();
    for (const key in _state) {
      store[key] = _state[key];
    }
  }

  if (getters && Object.keys(getters).length) {
    for (const getter in getters)
      store[getter] = computed(getters[getter].bind(store, store));
  }

  function warpAction(methodName: string) {
    return (...args: any[]) => {
      actions![methodName].apply(store, args);
    };
  }

  if (actions && Object.keys(actions).length) {
    for (const action in actions) {
      store[action] = warpAction(action);
    }
  }

  return () => {
    const pinia: Pinia = inject(piniaSymbol)!;
    if (!pinia._s.has(id)) {
      pinia._s.set(id, store);
    }
    const _store = pinia._s.get(id);
    return _store;
  };
};
```

:::

## Vue-Router 原理

> 简而言之，Vue-Router 的原理就是监听 URL 的变化，根据 URL 的变化来动态渲染 UI。
> 在 hash 模式下，我们可以监听 `hashchange` 事件；
> 在 history 模式下，我们可以监听 `popstate` 事件并利用 `history.pushState` 方法来改变 URL。

对于单页面应用来说，路由描述的是 URL 与 UI 之间的映射关系，我们希望根据 URL 的变化来动态渲染 UI 而不用向服务器发起请求。那么要实现前端路由，需要解决两个核心问题：

1. 如何改变 URL 而不引起页面的刷新？
2. 如何检测 URL 是否发生了变化？

在使用 Vue-Router 时，我们可以选择两种模式，一种是 hash 模式，另一种则是 history 模式。这两个模式的区别就在于 URL 的表现形式不同。在 hash 模式下，URL 会带有 `#` 号，而在 history 模式下则不会。这两种模式的实现原理也不同。我们分情况进行讨论。

### hash 模式

什么是 hash ？ hash 是 URL 中 `#` 号后面的部分，常用作锚点在页面内进行导航，改变 URL 中的 hash 不会引起页面的刷新，这个特性正好符合我们的需求。至于第二个问题，如何检测 URL 是否发生了变化，我们可以在 `window` 上监听 `hashchange` 事件。

```js
const contentEl = document.getElementById("content");
const routes = {
  "/user": "<h1>User</h1>",
  "/about": "<h1>About</h1>",
  "/home": "<h1>Home</h1>",
};
window.addEventListener("hashchange", () => {
  const path = window.location.hash.slice(1);
  contentEl.innerHTML = routes[path];
});
```

### history 模式

在点击 a 标签时会触发浏览器的默认行为，即跳转到目标页面，这个过程会引起页面的刷新。我们可以使用 `e.preventDefault()` 来阻止这个默认行为，然后使用 HTML5 提供的 `history.pushState` 方法来改变 URL。这个方法接受三个参数，分别是状态对象、标题、URL。这样我们就可以改变 URL 而不引起页面的刷新。在 a 标签的点击事件中，我们显然知道 URL 发生了变化，所以我们可以在这个时候进行 UI 的更新。然而 URL 的改变还可能是因为浏览器的前进后退按钮，这时候我们可以监听 `popstate` 事件。

```js
// 处理浏览器的前进后退按钮
window.addEventListener("popstate", () => {
  contentEl.innerHTML = routes[window.location.pathname];
});

window.addEventListener("DOMContentLoaded", () => {
  contentEl.innerHTML = routes[window.location.pathname];
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // 阻止默认跳转行为
      history.pushState(null, "", e.target.href); // 手动改变 URL
      contentEl.innerHTML = routes[e.target.pathname]; // 更新 UI
    });
  });
});
```
