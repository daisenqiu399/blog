---
outline: deep
updateTime: "2023-10-20 22:05"
tags: "Vue/渲染器"
desc: "《Vue.js设计与实现》第三篇“渲染器”的读书笔记，介绍了 Vue 的渲染流程以及 diff 算法的实现"
---

以下是笔者在阅读《Vue.js 设计与实现》第三篇“渲染器”部分时的心得体会 ✏️。

## 🦄 虚拟 DOM

在正式讲解 Vue 的渲染流程之前，我们需要先来了解一下虚拟 DOM(`Virtual DOM`)这个概念。

**🍦 什么是虚拟 DOM?**

实际上，虚拟 DOM 是对真实 DOM 节点的抽象，在 Js 中表现为一个轻量级的 `object` 对象，通常具有标签名 `type`，子元素对象 `children`，属性值 `props` 以及对应的真实 DOM `el`等属性。

**✨ 为什么需要虚拟 DOM?**

1. **声明式编程**：使用虚拟 DOM，开发者只需要关注数据（状态）的变化，而不需要关心如何操作 DOM。当数据改变时，Vue.js 会负责比较新旧虚拟 DOM ，并计算出最小的更新步骤来更新真实 DOM。这使得代码更易于理解和维护。
2. **组件化**：虚拟 DOM 使得 Vue.js 能够提供强大的组件系统。每个 Vue 组件都有自己的虚拟 DOM，这使得组件的状态和逻辑能够被封装和重用。
3. **跨平台**：虚拟 DOM 是一个跨平台的概念，它不仅可以表示浏览器中的 DOM，也可以表示其他平台的 UI，比如 Native mobile 或 Desktop apps。这使得 Vue.js 能够用于构建跨平台应用。
4. **更高效的 DOM 更新**：直接操作 DOM 的代价是非常昂贵的，因为每次修改都可能导致浏览器重新计算布局、重新绘制等操作，这被称为重排（reflow）和重绘（repaint）。虚拟 DOM 允许 Vue.js 在内存中进行所有的更改，然后一次性将最终的更改应用到实际的 DOM 中。这样可以减少不必要的重排和重绘，从而提高性能。

## 📚 总体渲染流程

Vue 的总体渲染过程（精简版）可以概括为以下步骤：

1. **🚄 渲染入口**：`render(vnode,container)` 函数对新旧虚拟 DOM (`vnode` 与 `container._vnode`)进行比较。如果新虚拟 DOM 存在，那么就会进入 `patch` 函数进行打补丁操作。如果新 DOM 不存在而旧 DOM 存在，则会进入 `unmount` 函数进行卸载操作。此时，容器的 `_vnode` （旧虚拟 DOM）也会被更新。

2. **卸载操作**：`unmount(vnode)` 函数主要负责卸载已挂载 🔨 的 DOM 节点。它会获取当前虚拟 DOM 对应的真实 DOM (`vnode.el`)，然后获取其父容器，并在父容器中使用原生 API `removeChild` 将其移除。我们不直接使用 `innerHTML = ''` 是因为该方法无法移除绑定在 DOM 上的事件。

3. **打补丁操作**：`patch(oldVNode,newVNode)` 函数首先会判断新旧节点的 `type` 是否相同。如果不相同，就会先卸载旧的 DOM，然后挂载新的 DOM。🔮 如果类型相同，那么就会根据不同的虚拟 DOM 类型进行不同的处理操作：

   - 字符串类型：这意味着是普通的标签元素 😊，会进行 `patchElement` 或 `mountElement`（如果旧 DOM 不存在）处理。
   - Text 类型：这意味着是文本节点。如果旧 DOM 不存在，就会新建文本节点并插入到容器中；如果已经存在，就会通过设置旧 DOM 的 `nodeValue` 属性来覆盖。
   - Fragment 类型：这意味着是多根节点模板 😮。如果旧 DOM 不存在，就会遍历新 DOM 的子节点，并使用 `patch(null,child)` 挂载；如果存在，则会进行子节点的对比更新，调用 `patchChildren` 函数处理。
   - object 类型：这意味着是组件，会进行 `patchComponent` 或 `mountComponent`（如果旧 DOM 不存在）处理。

4. **🐳 挂载元素**：`mountElement(vnode,container,anchor)` 函数将虚拟 DOM 转换为真实 DOM 并插入到父容器中。首先根据虚拟 DOM 的类型创建对应的 HTML 元素。然后分析其子节点是文本节点还是虚拟 DOM 组成的数组。如果是文本节点则直接设置其内容，如果是数组，则依次遍历数组并进行 `patch(null,child)` 挂载。处理完子节点后，需要根据 `vnode.props` 设置自身的属性，包括 `id /class` 以及绑定的事件等，这一步需要 `patchProps` 函数的帮助。

5. **🍧 属性处理**：`patchProps` 函数处理 HTML Attributes 与 DOM properties 的区别，动态 class 的语法增强处理，布尔属性的空字符串值处理，以及事件类型的属性处理。

6. **🍏 更新元素**：`patchElement` 函数首先调用 `patchProps` 更新自身的属性值，然后删除冗余的属性，最后调用 `patchChildren` 比较子节点的差异。

7. **子节点差异比较**：`patchChildren(oldVNode,newVNode,container)` 函数根据新旧子节点的类型进行不同的处理。如果新子节点为文本或空，直接覆盖或清空其文本内容；如果旧子节点为数组，依次遍历并进行卸载操作；如果新旧子节点都为数组，则需要进行 diff 🎯 算法（具体实现详见后文）的比较。

8. **组件处理**：`patchComponent` 函数用于处理组件，但由于该部分内容属于第四篇“组件化”，所以这部分内容将在后续进行讨论 🚧。

## diff 算法

### 🦄 Vue2.x 中的双端 diff

算法主要步骤如下：

1. 获取新旧节点的头尾四个下标。
2. 在循环中开始更新元素 😵：
   - 比较新旧节点头部元素 key 值是否相同：如果相同，调用 patch 更新元素，并更新下标。
   - 比较新旧节点尾部元素 key 值是否相同：如果相同，调用 patch 更新元素，并更新下标。
   - 比较新节点头部与旧节点尾部元素 key 值是否相同：如果相同，调用 patch 更新元素，并将旧节点尾部元素插入到当前旧节点头部元素之前，然后更新下标。
   - 比较新节点尾部与旧节点头部元素 key 值是否相同：如果相同，调用 patch 更新元素，并将旧节点尾部元素插入到当前旧节点尾部元素之后，然后更新下标。
   - 更为一般的情况：在旧节点中寻找与当前新节点头部元素 key 值相同的元素下标，如果存在则进行更新，并插入到当前旧节点头部元素之前。如果不存在则直接挂载到当前旧节点头部元素之前，然后标记该旧节点 key 值为已访问。

> 头头比较 => 尾尾比较 => 头尾比较 => 普遍情况

3. 处理循环后剩余的节点，如果新节点有剩余则直接挂载，如果旧节点有剩余则直接卸载。

:::details 点击查看代码实现

```ts
function v2Diff(n1: VNode, n2: VNode, container: Container | null) {
  const oldChildren = n1.children as VNode[];
  const newChildren = n2.children as VNode[];
  const visited = Symbol("visited");
  // 四个索引值
  let oldStartIdx = 0,
    oldEndIdx = oldChildren.length - 1,
    newStartIdx = 0,
    newEndIdx = newChildren.length - 1;
  // 对应的 vnode 节点
  let oldStartVNode = oldChildren[oldStartIdx],
    oldEndVNode = oldChildren[oldEndIdx],
    newStartVNode = newChildren[newStartIdx],
    newEndVNode = newChildren[newEndIdx];

  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
    // 跳过已处理节点
    if (oldStartVNode.key === visited) {
      oldStartVNode = oldChildren[++oldStartIdx];
      continue;
    }
    if (oldEndVNode.key === visited) {
      oldEndVNode = oldChildren[--oldEndIdx];
      continue;
    }

    // 比较
    if (oldStartVNode.key === newStartVNode.key) {
      // 头头比较
      patch(oldStartVNode, newStartVNode, container);
      oldStartVNode = oldChildren[++oldStartIdx];
      newStartVNode = newChildren[++newStartIdx];
    }
    // 尾尾比较
    else if (oldEndVNode.key === newEndVNode.key) {
      patch(oldEndVNode, newEndVNode, container);
      oldEndVNode = oldChildren[--oldEndIdx];
      newEndVNode = newChildren[--newEndIdx];
    }
    // 头尾比较
    else if (oldStartVNode.key === newEndVNode.key) {
      patch(oldStartVNode, newEndVNode, container);
      insert(oldStartVNode.el, container, oldEndVNode.el?.nextSibling);
      oldStartVNode = oldChildren[++oldStartIdx];
      newEndVNode = newChildren[--newEndIdx];
    }
    // 尾头比较
    else if (oldEndVNode.key === newStartVNode.key) {
      patch(oldEndVNode, newStartVNode, container);
      insert(oldEndVNode.el, container, oldStartVNode.el);
      oldEndVNode = oldChildren[--oldEndIdx];
      newStartVNode = newChildren[++newStartIdx];
    }
    // 非理想状况
    else {
      const idxInOld = oldChildren.findIndex((node) => node.key === newStartVNode.key);
      if (idxInOld > 0) {
        const VNodeToMove = oldChildren[idxInOld];
        patch(VNodeToMove, newStartVNode, container);
        insert(VNodeToMove.el, container, oldStartVNode.el);
        oldChildren[idxInOld].key = visited; // 标记已访问
      } else patch(null, newStartVNode, container, oldStartVNode.el);
      newStartVNode = newChildren[++newStartIdx];
    }
  }

  // 添加新的节点
  if (newStartIdx <= newEndIdx) {
    for (let i = newStartIdx; i <= newEndIdx; i++)
      patch(null, newChildren[i], container, oldStartVNode?.el || null);
  }
  // 卸载旧的节点
  if (oldStartIdx <= oldEndIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      unmount(oldChildren[i]);
    }
  }
}
```

:::

### 🚀 Vue3 中的 fast diff

算法主要步骤如下：

1. 更新相同的前置节点。
2. 更新相同的后置节点（注意处理边界，避免第一步更新后重复更新）。
3. 如果新节点有剩余，则依次挂载。
4. 如果旧节点有剩余，则依次卸载。

对于都有节点剩余的情况，处理起来更为复杂 😭：

> 初始化 source => 构造索引表 => 找出可复用 DOM 并更新 => 构造最长上升子序列移动或新增 DOM

首先 🏃‍♀️，初始化一个 source 数组，所有元素设为 -1。

然后 🏐，用新节点建立一个索引表。接着遍历旧节点，对于每个旧节点，在索引表中查找是否有相同的新节点。

- 如果没有找到，则说明当前旧节点应当被卸载；
- 如果找到了（假设为 `k`），则说明该节点需要进行更新甚至移动。

我们首先调用 patch 进行更新，然后更新 `source[k-newStart] = 当前枚举到的节点下标`。接着，我们需要借助一个 `lastMaxIndex` 来判断是否需要进行移动。如果 `k < lastMaxIndex`，说明存在逆序对，需要进行 DOM 移动。

旧节点遍历完成后，我们开始进行 DOM 移动操作 🏹。首先，我们根据 source 数组构造出最长递增子序列的下标数组 `seq`。然后，我们开始双指针遍历，利用 `sIdx` 倒叙遍历 `seq` 数组，利用 `i` 倒叙遍历新节点。

- 如果 `source[i]===-1`，说明是新增节点，直接挂载即可，挂载锚点与之后移动操作类似；
- 如果 `i!==seq[sIdx]`，说明当前 DOM 需要移动，我们开始构造移动锚点，**由于倒叙遍历，所以在当前节点之后的节点此时已经处于正确的位置上了**，所以我们以当前节点后一个节点的真实 DOM 为插入锚点 ⚓。
- 如果 `i === seq[sIdx]`，则说明不需要更新，只需移动 `sIdx` 即可。

:::details 点击查看代码实现

```ts
/**
 * 比较两个虚拟节点数组的差异，并更新
 * @param n1 - 旧 VNode 数组
 * @param n2 - 新 VNode 数组
 * @param container - 父元素容器
 */
function fastDiff(n1: VNode, n2: VNode, container: Container | null) {
  const oldChildren = n1.children as VNode[];
  const newChildren = n2.children as VNode[];

  // 更新相同的前置节点
  let prevIndex: number = 0;
  let oldEnd: number = oldChildren.length - 1;
  let newEnd: number = newChildren.length - 1;

  let oldVNode: VNode = oldChildren[prevIndex];
  let newVNode: VNode = newChildren[prevIndex];
  while (prevIndex <= oldEnd && prevIndex <= newEnd && oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container);
    prevIndex++;
    oldVNode = oldChildren[prevIndex];
    newVNode = newChildren[prevIndex];
  }
  // 更新相同的后置节点

  oldVNode = oldChildren[oldEnd];
  newVNode = newChildren[newEnd];
  while (prevIndex <= oldEnd && prevIndex <= newEnd && oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container);
    oldVNode = oldChildren[--oldEnd];
    newVNode = newChildren[--newEnd];
  }

  // 新VNode剩余：挂载
  if (prevIndex <= newEnd && prevIndex > oldEnd) {
    const anchorIndex = newEnd + 1;
    const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el! : null;
    while (prevIndex <= newEnd) patch(null, newChildren[prevIndex++], container, anchor);
  }

  // 旧VNode剩余：卸载
  else if (prevIndex <= oldEnd && prevIndex > newEnd) {
    while (prevIndex <= oldEnd) {
      unmount(oldChildren[prevIndex++]);
    }
  }
  // 同时剩余
  else if (prevIndex <= oldEnd) {
    // 1.构造 source
    const count: number = newEnd - prevIndex + 1;
    const source: number[] = new Array(count).fill(-1);

    // 2.构造索引表
    const oldStart: number = prevIndex;
    const newStart: number = prevIndex;
    let lastMaxPos: number = 0;
    let moved: boolean = false;

    const keyIndex: any = {};
    for (let i = newStart; i <= newEnd; i++) {
      keyIndex[newChildren[i].key] = i;
    }
    // 3.更新节点 & 判断是否需要移动
    let patched = 0;
    for (let i = oldStart; i <= oldEnd; i++) {
      oldVNode = oldChildren[i];
      if (patched < count) {
        const k = keyIndex[oldVNode.key];
        // 在索引表中存在说明没有被移除
        if (k !== undefined) {
          newVNode = newChildren[k];
          patch(oldVNode, newVNode, container);
          patched++;
          source[k - newStart] = i;

          if (k < lastMaxPos) moved = true;
          else lastMaxPos = k;
        }
        // 不在索引表中则应当被卸载
        else {
          unmount(oldVNode);
        }
      }
      // 已更新节点数大于需要更新的节点数，则后续节点都应被卸载，性能优化的小手段
      else {
        unmount(oldVNode);
      }
    }

    // 4. 构造最长递增子序列进行移动
    if (moved) {
      const seq = getLISIndex(source);
      let s = seq.length - 1;
      let i = count - 1;
      for (i; i >= 0; i--) {
        // 新增的节点
        if (source[i] === -1) {
          const pos = i + newStart;
          const newVNode = newChildren[pos];
          const anchor = pos + 1 < newChildren.length ? newChildren[pos + 1].el : null;
          patch(null, newVNode, container, anchor);
        }
        // 需要移动的节点
        else if (i !== seq[s]) {
          const pos = i + newStart;
          const newVNode = newChildren[pos];
          const anchor = pos + 1 < newChildren.length ? newChildren[pos + 1].el : null;
          insert(newVNode.el, container, anchor);
        }
        // 不需要移动
        else {
          s--;
        }
      }
    }
  }
}
```

:::

## 组件化

::: warning TODO 🚧
组件化
:::
