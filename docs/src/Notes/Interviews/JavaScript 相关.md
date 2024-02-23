---
updateTime: "2023-11-27 10:55"
desc: "教练，我想成为前端高手！JavaScript 是世界上最好的语言！(雾"
tags: "八股/JavaScript"
outline: deep
---

## 数据类型相关

- 基本类型：Number, String, Boolean, Symbol, BigInt, null, undefined
- 引用类型：Object(Array, Function, Set, Map...)

### null 与 undefined

1. `null` 可以理解为: 对象不存在. 当某个方法返回值是一个对象，但对象不存在时返回的就是 `null`.

例如: `document.querySelector()`返回的是 DOM 对象，当没有查询到时返回的就是 `null`.

2.  `undefined` 可以理解为: 缺少值.

    - 变量定义了但是没有赋值
    - 访问对象中不存在的属性
    - 函数没有返回值时的默认值

### 弱等于和强等于

- 弱等于 `==`：只进行值比较，在比较时会先进行类型转换。
- 强等于 `===`: 先进行类型判断，如果类型不同，直接返回 false，如果类型相同，再进行值的比较。
- `Object.is()`:

### 类型转换规则

![类型转换规则](./img/类型转换规则.jpg)

## 原型与原型链

在 JavaScript 中，每个构造函数都具有 prototype 属性，它是一个指向原型对象的指针，原型对象上存放着一些公有的方法和属性。

当我们使用构造函数去创建一个对象实例时，这个实例的 `__proto__` 属性就指向了构造函数的 prototype 属性。

当我们访问实例的某个属性或者方法时，如果实例本身不存在这个方法或者属性，那么就会去它的 **proto** 属性所指向的原型对象上去查找，如果原型对象上还是不存在，那么就会去原型对象的 **proto** 属性所指向的原型对象上去查找，这样一层一层的查找下去，就形成了原型链。值得一提的是，原型链的终点是 null，它是所有对象的根原型。

根据原型链的这个特性，我们可以实现继承，比如说我们可以让一个构造函数的 prototype 属性指向另一个构造函数的实例，这样一来，这个构造函数的实例就可以访问另一个构造函数的实例上的属性和方法了。

```js
function Person(name, age) {
  (this.name = name), (this.age = age);
}
const tom = new Person("tom", 18);
console.log(tom.__proto__ === Person.prototype); // true
```

例如我们查找一个对象 tom 的属性 tom.phone 的流程如下:

```js
/*
 * tom
 * -> tom.__proto__(即 Person.prototype)
 * -> tom.__proto__.__proto__(即 Function.prototype)
 * -> tom.__proto__.__proto__.__proto__(即 Object.prototype)
 * -> tom.__proto__.__proto__.__proto__.__proto__(即 null)
 */
```

原因是 `tom = new Person()` 时, `tom` 的隐式原型指向了 `Person.prototype`, 而 `Person` 函数是通过 `new Function()` 创建的,所以 `Person.prototype` 的隐式原型指向了 `Function.prototype`,同理 `Function.prototype` 的隐式原型指向了 `Object.prototype`,而 `Object.prototype` 的隐式原型指向了 `null`.

:::info TIP
如果希望只在当前对象上查找属性，而不沿着原型链进行查找，可以使用 `hasOwnProperty()` 方法
:::

## new 一个对象的过程

1. 创建一个空对象 `{}`
2. 将空对象的隐式原型 `_proto_` 指向构造函数的原型 `prototype`（在这一步箭头函数无法完成）
3. 将构造函数的 `this` 指向第一步创建的空对象
4. 执行构造函数代码
5. 没有返回对象则返回 `this`

简易实现：

```js
function myNew(constructor, ...args) {
  // 1. 创建新对象
  let obj = {};
  // 2. 设置原型
  Object.setPrototypeOf(obj, constructor.prototype);
  // 3. 绑定 this 执行构造函数
  let result = constructor.apply(obj, args);
  // 4. 返回对象
  return result && typeof result === "object" ? result : obj;
}
```

## 函数

### 箭头函数与普通函数的区别

首先明确一点,箭头函数引入是为了更简洁的函数以及 `this` 的指向问题

1.  箭头函数的语法更加简单,`()=>{}` 与 `function(){}` 的区别
2.  箭头函数没有自己的 `this`,它的 `this` 是继承外层的 `this`
3.  箭头函数没有原型对象,所以不能作为构造函数.
4.  箭头函数不绑定 `arguments`.

## 闭包

## 事件循环

## Promise

## 垃圾回收
