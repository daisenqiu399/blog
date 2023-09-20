---
updateTime: "2023-09-19 20:15"
desc: " Echarts 中同时设置 triggerEvent 与 tooltip 可能会出现奇怪的显示问题，文中给出了一个简单的解决方案并记录了 radar 雷达图组件多级数据的一个应用场景."
tags: "Echarts"
outline: deep
---

## 【Echarts】事件触发与富文本的奇妙反应.

在前几天使用 Echarts 的雷达图时，遇到了一个奇怪的问题，当 `radar` 设置了 `triggerEvent:true` 并且 `axisName` 使用的是富文本标签时，会出现下图中的情况.

![echartsTragger0](./img/echartsTragger0.jpg)

### 解决方案

设置 `radar` 中的 `tooltip:{show:false}`. 该设置并不会影响到数据的 `tooltip`.

部分配置代码如下:

```js{2,5,7,14}
title: { text: "综合评估雷达图" },
tooltip: {},
radar: {
    shape: "circle",
    tooltip: { show: false },
    axisName: {
        formatter: (item) => `{a|${item}}`,
        rich: {
            a: {
                color: '#0a67ca',
                ...
            }
        },
        triggerEvent: true,
    },
    indicator: [...],
},
series: [{type: "radar",data:[...]}]
```

> 解决这个问题时绕了很多弯路,当时认为是 `triggerEvent` 导致鼠标悬浮在 `axisName` 上时触发了对应的时间，于是打算利用 `dispatchAction` 去拦截，但是因为缓动动画的存在会导致抖动，随寻找到了这个方法.

同时在此记录一下，雷达图组件一个应用场景的解决方案.

### 多层级雷达图

需求场景如下：现在有一组树形结构的数据（多级指标），例如 A 指标下又有 B,C,D 三个指标，我们希望雷达图展示时，点击具体的指标（例如指标A），可以显示该指标的详细信息（例如B,C,D）.

1. 实现点击 `indicator` (上述的“指标”) 渲染更深层次的数据

首先我们会发现直接监听点击事件是不行的，我们首先要给 `radar`下的`axisName`设置 `triggerEvent:true`.这样我们才能监听到指标的点击事件.可以参考下面的代码

```js
echartsContainer.on('click', "radar", (params)=>{
    // ...相关逻辑
})
```

其中第二个参数是一个过滤器,即只监听 `radar` 组件触发的点击操作,可以参考官方文档 [Documentation - Echarts](https://echarts.apache.org/zh/api.html#echartsInstance.on)

至于具体的逻辑实现，此处仅口述一下思路：点击指标后，要改变的地方有三个.

   1. **标题**: 当前处于什么指标之下,不是顶级指标就显示返回符号（可以通过富文本标签设置背景图片实现）. 可以通过记录前缀链来实现
   2. **指标名称**: 当前指标下又有哪些细分指标. 如何变更应参考具体的数据结构,结合被点击的指标名称来实现.
   3. **对应数据**：细分指标的数据分别是什么.这一点和【指标名称】的获取类似.

需要注意的是边界条件的处理：

- 到了最底层再点击就直接返回
- 有的指标是这样的 `A:{B:{C,D,E}}` 那当我们点击指标 A 时，最好能直接显示 `{C,D,E}` 而不是只显示一个 `B`. 

2. 实现点击标题返回上一级指标并重新渲染

同样是变更标题、指标、数据三个地方,处理方法基本一致,此处不再赘述.

```js
echartsContainer.on('click', "title", () => {
    // ...相关逻辑
})
```