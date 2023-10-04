---
updateTime: "2023-10-04 16:09"
desc: "从零开始的 TypeScript 生活。本文记录了基本的 TypeScript 语法，帮助你快速轻松上手TypeScript （赶鸭子上架！） "
tags: "TypeScript/手册"
outline: deep
---

## 🍏 什么是 TypeScript？

TypeScript 是 JavaScript 的一个超集，也就是在 JavaScript 的基础上增加了一些新的特性和功能。

在 JavaScript 中，我们可以随时给一个变量赋予任何类型的值，而不会报错。但是这样就有可能会出现一些预期之外的错误，比如我们原本希望一个变量是数字，但是缺不小心赋值成了数字字符串，那么在后面的计算过程中就可能出错。而 TypeScript 的出现就是为了解决这样的问题，它能够在我们编写代码的时候就检查出上例中的错误。除此之外，TypeScript 还增加了一些其他的特性来提高代码的可读性与可维护性。

简而言之，TypeScript 就是一个更加强大、更加严谨的 JavaScript🍧.

## ✨ 基本语法

🚄 首先让我们来了解一下**类型注解**。

类型注解在 TypeScript 中是一种重要的语法，它可以明确地告诉编译器我们期望的数据类型，从而帮助我们在编译阶段发现潜在的问题。众所周知 JavaScript 是一门弱类型语言，TypeScript 就是通过类型注解的方式来提升我们编写代码时的严谨性。

类型注解的基本语法是在变量名后面加上冒号和类型。例如： `let isDone: boolean = false`. 在这个例子中`: boolean` 就是类型注解，它告诉编辑器 `isDone` 应该是一个布尔值，那么当我们试图对 `isDone.length` 时就会报错，因为布尔类型不存在 `length` 这个方法。

::: tip
当我们指定了变量的类型之后，就不能再把其他类型的值赋值给该变量了。

```ts
let str: string = "Hello";
str = 123; // Error: 不能将类型“number”分配给类型“string”。
```

:::

### 常见的静态类型

都写在代码和注释里啦，自己看吧！🤓

```ts
// 字符串
let str: string = "Hello Typescript";

// 数字
let num: number = 2333;

// 布尔值
let isDone: boolean = true;

// 数组
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// 元组：用于表示长度固定的数组，数组内类型不必相同
let tuple: [number, string] = [1, "hello"];
// Enum 枚举类型：常用于定义常量
enum Color {
  Red,
  Green,
  Blue,
}
let color: Color = Color.Blue;

// Any 任意类型
let notSure: any = 4;
notSure = false;

// Void 类型：常用于表示函数没有返回值
function log(msg: string): void {
  console.log(msg);
}

// Null & Undefined
let u: undefined = undefined;
let n: null = null;

// Never 类型: 表示那些永远不存在的值的类型
function error(message: string): never {
  throw new Error(message);
}
```

### 接口 - interface

在 JavaScript 中，对象是动态的，可以随时添加和删除属性。这就容易导致一些奇怪的问题发生。例如我想要修改 obj 的 name 属性，但是由于手误写成了 `obj.nmae = 'xxx' `，这并不会引起编译器报错，因为它认为我们在给对象添加一个新的属性。

在 TypeScript 中，我们通常希望对象具有一定的形状，即对象的属性以及属性的类型是固定的。这时我们就可以使用接口 `interface` 来描述对象的形状。

**基础操作**

- 定义接口：使用 `interface` 关键字，后跟接口名称。
- 使用接口：直接当作与 `string` 与 `number` 类似的类型使用。

```ts
// 定义接口
interface Person {
  name: string;
  age: number;
  // eat 表示一个没有参数与返回值的函数
  eat: () => void;
}
// 使用接口
let tom: Person = {
  name: "Tom",
  age: 20,
  eat: () => console.log("Tom is eating"),
  //   不能缺少或是增加类型,否则会报错.
  phone: "...",
};
```

**只读属性 & 可选属性**

有的使用我们希望对象的某个属性不存在也不影响基本功能...

而有的时候我们又希望对象的某个属性再初始化后就不能再变更了（例如学生的学号）

```ts
interface Person {
  readonly name: string;
  age: number;
  phone?: string;
}
// 缺少 phone 属性也不会报错
let tom: Person = {
  name: "Tom",
  age: 20,
};
// Error: 无法分配到 "name" ，因为它是只读属性。
tom.name = "John";
```

**继承 & 实现**

- 使用 `extends` 可以实现接口的继承:
- 类可以使用 `implements` 去实现接口，实现接口时，类需要实现接口中定义的所有属性和方法。

```ts
interface Animal {
  name: string;
  move(): void;
}

// Dog 同时具有 move 与 bark 方法.
interface Dog extends Animal {
  bark(): void;
}

// Error: 类型 "smallDog" 中缺少属性 "bark"，但类型 "Dog" 中需要该属性。
class smallDog implements Dog {
  name: string = "White";
  move(): void {
    console.log(this.name);
  }
}
```
