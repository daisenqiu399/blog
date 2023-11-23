---
updateTime: "2023-11-23 23:49"
desc: "现代 CSS 的博大精深！好想成为 CSS 高手😭，切最酷的图！本文试图全面记录 CSS 在面试中的考点，探索那些微小但重要的细节。"
tags: "八股/CSS"
outline: deep
---

## 【0.5px】问题

> 现在，可爱的美工妹子【哆啦】觉得 1px 的边框还是太粗了，她想要你实现 0.5px 的边框，你可以做到吗？

**解题要点**: <Badge>transform</Badge><Badge>transform-origin</Badge><Badge>伪元素</Badge>

**问题分析**:

我们知道 CSS 的最小尺寸为 1px,想要实现 0.5px 的边框，显然不能通过直接设置尺寸来实现，我们需要借助一点其他的工具———`transform`的`scale`函数.

但需要注意的是，`transform` 的对象是整个盒子，无法指定某个特定的属性去放缩。当我们对某个 div 盒子使用 `scale` 放缩的时候，无论是边框还是内容大小都会发生改变。例如本例中当我们试图通过 `scale(0.5)` 去获得 0.5px 的边框时，盒子内容大小(长宽、字体大小等属性)也会变为原来的一半。

这时我们可以考虑使用**伪元素**，将伪元素的长宽设为原来的 200%(因为后面缩小为了 50%)，并设置 `border` 为 1px 以及, 随后再对伪元素进行`transform`操作，这样就不会影响到原来的内容了。

至此我们已经能得到 0.5px 的边框了，但是它的位置与预期效果还存在较大差距。

1. 我们需要利用定位的方式将其覆盖在原来的内容上。

2. 我们还需要随后呢还需要调整 `transform-origin` 的取值，具体取值其实与定位的设置有关.

这里给出我的参考代码

```html{11,14,15,16,18-22}
<div class="box thin-border">0.5px边框</div>

<style>
    .box{
        width: 200px;
        height: 200px;
        line-height: 200px;
        text-align: center;
    }
    .thin-border{
        position: relative;
    }
    .thin-border::after{
        position: absolute;
        left: 0;
        top: 0;
        content: "";
        border: 1px solid red;
        width: 200%;
        height: 200%;
        transform: scale(0.5);
        transform-origin: top left;
    }
</style>
```

## 小知识大智慧 🤓

### 物理像素与逻辑像素

1. 物理像素： 在设备生产后就确定且不能改变的像素，也称之为`设备像素`，通常用 `dp` 表示.我们常说的屏幕分辨率就是物理像素。
2. 逻辑像素：也被称为独立像素或 CSS 像素，它是在软件编程中使用的像素单位，与物理硬件设备的具体像素密度无关。逻辑像素的大小可以根据设备的分辨率、屏幕大小、系统设置等因素进行调整，以提供更好的用户体验。比如，在高分辨率的设备上，为了避免界面元素过小，系统可能会将一个逻辑像素映射到多个物理像素上。
