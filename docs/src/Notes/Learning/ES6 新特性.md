---
updateTime: "2023-09-16 22:00"
desc: "ES6新特性记录，来源于蓝桥杯备赛课程"
tags: "ES6"
outline: deep
---



## 1.数组

### [find]

[find()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 方法是用于从数组中寻找一个符合指定条件的值，该方法返回的是第一个符合条件的元素，如果没找到，则返回 undefined.

语法格式: `array.find(callback(value, index, arr), thisValue);`

参数说明如下:

+ `callback` 是数组中每个元素执行的回调函数。
+ `value` 是当前元素的值，它是一个必须参数。
+ `index` 是数组元素的下标，它是一个可选参数。
+ `arr` 是被 find() 方法操作的数组，它是一个可选参数。
+ `thisValue` 是执行回调时用作 this 的对象，它是一个可选参数。

> findIndex()方法类似,只不过返回值为元素下标

### [fill]

[fill()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill) 方法是用指定的值来填充原始数组的元素。

语法格式:`array.fill(value, start, end);`

其参数说明如下：

+ `value` 是用来填充数组的值，它是一个必须参数。
+ `start` 是被填充数组的索引起始值，它是一个可选参数。
+ `end` 是被填充数组的索引结束值，它是一个可选参数。

### 遍历方法

+ `entries()`方法以**键/值对**的形式返回数组的 [index,value]，也就是索引和值。

+ `keys()`方法只返回数组元素的键值也就是元素对应的索引，不会返回其值。

+ `values()`方法返回的是每个键对应的值。

可通过如下代码遍历上述方法的返回结果: `for(let term in arr.keys() )`

### 拓展运算符[...]

+ 可以使用扩展运算符将一个对象的全部属性插入到另一个对象中，来创建一个新的对象。
+ 可以使用扩展运算符给对象添加属性。
+ 可以使用扩展运算符合并两个新对象。

## 2.函数

+ 在函数中直接设置默认值 / 使用函数作为默认值
+ 解构参数
+ rest 参数(与拓展运算符写法相同),用 rest 来获取函数的多余参数,接收可变的参数列表.
+ 箭头函数: 箭头函数的 this 指向是其上下文的 this，没有方法可以改变其指向.

## 3.类

+ 使用 `class` 关键字来声明类。
+ 使用 `extends` 和 `super` 关键字来实现类的继承。
+ 使用 `static` 关键字来定义静态属性和静态方法，使用 `#` 来定义私有属性和私有方法。
+ 使用 `new.target` 来判断构造函数的调用方式。

> 当我们想写不能被实例化，必须在继承后才能使用的类时，我们可以用 `new.target` 属性，做为限制其不能被实例化（new）的条件。

## 4.对象

+ 对象字面量：
  + 属性的简洁表示法: 属性值的变量名与属性名想用可省略
  + 方法的简洁表示法: 可直接写方法,不用再写function关键字
  + 属性名表达式: 可以用表达式 / 模板字面量(即反引号)作为属性名.
+ 对象的扩展运算符: 与数组类似，能实现拷贝 / 合并 / 添加属性等操作
+ 对象的新增方法
  + `Object.is`：判断两个值是否相等。 比`===`更精确一点
  + `Object.assign`：合并多个对象。（同名属性会被覆盖，且为浅拷贝）

## 5.[Set] 和 [Map]

+ Set 是一个可以存储数据的对象，你可以在其中添加或者删除数据，并循环访问 Set。但是 Set 中没有索引，也不能存放重复的值，数组与之相反。
+ Map 可以创建任意数据类型的键值对，打破了对象键名类型限制的局限性。
+ Set 通过`add`添加元素,Map 通过`set`添加元素,通过`get`获取值
+ 通用方法: `delete(),has(),clear(),forEach()`

## 6.异步编程

+ `Promise(reslove,reject)`
+ `async`关键字修饰的函数将返回一个Promise对象,`await`关键字会等异步请求完成后才执行.

## 7.模块化

+ 输出接口: `export {name}`
+ 输入接口: `import {} form "url"`

## 8.Proxy

ES6中的`Proxy`是一种元编程机制，它允许开发人员拦截和自定义对象的访问和行为。它可以用来创建一个代理对象，它可以代替另一个对象作为被访问对象，从而控制对被代理对象的访问。

常用的四种拦截方法：

+ `get(target, propKey, receiver)`：拦截对象属性的读取。
+ `set(target, propKey, value, receiver)`：拦截对象属性的设置。
+ `has(target, propKey)`：拦截 propKey in proxy 的操作。
+ `ownKeys(target)`：拦截 Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in 循环。
