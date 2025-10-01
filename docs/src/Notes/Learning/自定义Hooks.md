---
updateTime: "2025-04-22 11:38"
desc: "React自定义hook"
tags: "ReactHooks"
outline: deep
---

## 自定义Hooks

React提供了很丰富的Hooks,但在实际开发中，React内置的Hooks并不能满足我们所有的需求，比如一些复杂的业务场景，需要我们自己定义hooks实现。

自定义hooks规则

1、自定义hooks必需以`use`开头

2、自定义hooks可以调用其他hooks(内置的hooks和自定义的hooks)

下面将通过一个水印案例介绍自定义hooks

#### 1、导入必要的钩子

```tsx
import { useEffect, useState } from "react"
```

这里导入了 React 的 `useEffect` 和 `useState` 钩子。`useState` 用于在函数组件中创建和管理状态，`useEffect` 用于处理副作用，例如在组件挂载、更新或卸载时执行某些操作。

#### 2、定义水印选项接口

```tsx
export interface WatermarkOptions {
    content: string // 水印文本
    width?: number  // 水印宽度
    height?: number // 水印高度
    fontSize?: number // 水印字体大小
    fontColor?: string // 水印字体颜色
    zIndex?: number // 水印层级
    rotate?: number // 水印旋转角度
    gapX?: number // 水印横向间距
    gapY?: number // 水印纵向间距
}
```

`WatermarkOptions` 是一个 TypeScript 接口，定义了水印的各种配置选项。其中 `content` 是必填项，其他选项都是可选的。

#### 3、定义默认配置函数

```tsx
// 默认配置
const defaultOptions = (): Partial<WatermarkOptions> => {
    const { width, height } = document.documentElement.getBoundingClientRect()
    return {
        width: width,
        height: height,
        fontSize: 16,
        fontColor: 'black',
        zIndex: 9999,
        rotate: -30,
        gapX: 200,
        gapY: 100
    }
}
```

`defaultOptions` 函数返回一个包含默认水印配置的对象。它通过 `document.documentElement.getBoundingClientRect()` 获取当前文档的宽度和高度，并将其作为水印的宽度和高度。其他默认值包括字体大小、字体颜色、层级、旋转角度、横向间距和纵向间距。



#### 4、定义`useWatermark`自定义Hook

```tsx
export const useWatermark = (options: WatermarkOptions) => {
    const [watermarkOptions, setWatermarkOptions] = useState<WatermarkOptions>(options)
    const opts = Object.assign({}, defaultOptions(), watermarkOptions)
    const updateWatermark = (newOptions: Partial<WatermarkOptions>) => {
        setWatermarkOptions(prev => ({
            ...prev,
            ...newOptions
        }))
    }
```

- `useState`：创建一个名为 `watermarkOptions` 的状态变量，初始值为传入的 `options`。
- `Object.assign`：将默认配置和传入的配置合并到 `opts` 对象中，确保每个配置项都有值。
- `updateWatermark`：一个用于更新水印配置的函数。它接受一个包含部分配置选项的对象 `newOptions`，并将其合并到当前的 `watermarkOptions` 状态中。

#### 5、使用`useEffect`处理水印的创建和销毁

```tsx
useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = opts.gapX!
    canvas.height = opts.gapY!
    //默认
    ctx.translate(opts.gapX! / 2, opts.gapY! / 2) 
    ctx.rotate((opts.rotate! * Math.PI) / 180) 
    ctx.font = `${opts.fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = opts.fontColor!
    ctx.globalAlpha = 0.15
    ctx.fillText(opts.content, 0, 0)
    const watermarkDiv = document.createElement('div')
    watermarkDiv.id = 'watermark'
    watermarkDiv.style.position = 'fixed'
    watermarkDiv.style.top = '0'
    watermarkDiv.style.left = '0'
    watermarkDiv.style.width = `${opts.width}px`
    watermarkDiv.style.height = `${opts.height}px`
    watermarkDiv.style.pointerEvents = 'none'
    watermarkDiv.style.zIndex = `${opts.zIndex}`
    watermarkDiv.style.overflow = 'hidden'
    watermarkDiv.style.backgroundImage = `url(${canvas.toDataURL()})`
    watermarkDiv.style.backgroundSize = `${opts.gapX}px ${opts.gapY}px`
    document.body.appendChild(watermarkDiv)
    
    return () => {
        document.body.removeChild(watermarkDiv)
    }
}, [opts])
```

- **创建画布并绘制水印**：
  - 创建一个 `canvas` 元素，并获取其 2D 上下文。
  - 设置画布的宽度和高度为 `opts.gapX` 和 `opts.gapY`。
  - 使用 `translate` 和 `rotate` 方法对画布进行平移和旋转。
  - 设置字体、文本对齐方式、填充颜色和透明度。
  - 使用 `fillText` 方法在画布上绘制水印文本。
- **创建水印容器并添加到页面**：
  - 创建一个 `div` 元素作为水印容器。
  - 设置容器的样式，包括位置、大小、层级、背景图像等。
  - 将 `canvas` 转换为数据 URL，并将其作为容器的背景图像。
  - 将容器添加到 `document.body` 中。
- **清理函数**：
  - `useEffect` 的返回值是一个清理函数，用于在组件卸载时移除水印容器。

#### 6、返回更新函数和配置对象

```tsx
return [updateWatermark, opts] as const
```



#### 7、在组件中使用

```tsx
import React from 'react'
import  {useWatermark} from './hooks/useWatermark'; //根据自定义hook的目录
const App:React.FC=()=>{
    //const App: React.FC = () =>：使用箭头函数定义一个名为 App 的函数组件，React.FC 是 React 函数组件的类型注解，用于明确该组件是一个 React 函数组件
    const [updateWatermark,opts]=useWatermark({
        content:'戴森球'
    })
    const update=()=>{
        updateWatermark({
            content:'戴森球集团'
        })
    }
    return<>
    <div>{JSON.stringify(opts)}</div>
    <button onClick={update}>更新水印</button>
    </>
}
export default App;
```

:::danger
本片文章参考[小满zs]: ​ https://juejin.cn/post/7461656087109976074  感谢作者
:::