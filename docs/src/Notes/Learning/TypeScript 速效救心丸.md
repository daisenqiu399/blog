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

// 联合类型
let numberOrString: number | string = "123";
numberOrString = 123; // 不会报错
```

### 类型别名 & 类型断言

**类型别名**

有的时候一个变量的类型可能有多种情况，例如当我们想要获取一个 DOM 元素时，它的返回值可能是 HTMLElement 也可能是 null. 此时我们可以通过上面提到的联合类型来为其进行类型注解。然而当 DOM 元素多起来时，这么长一串字符写起来不免有些麻烦 😤，这时就可以用到**类型别名**来简化代码.

```ts
// 联合类型
const btn: HTMLElement | null = document.getElementById("btn");
const submit: HTMLElement | null = document.getElementById("submit");

// 类型别名
type HTMLOrNull = HTMLElement | null;

const btn: HTMLOrNull = document.getElementById("btn");
const submit: HTMLOrNull = document.getElementById("submit");
```

**类型断言**

有的时候在编译器看来某个变量可能为 null 类型，但是你明确地知道这种情况是不会发生的，这时候你就可以使用**类型断言**来告诉编译器它一定是某个类型 ✔️。我们来看一个简单的例子：

```ts
const btn: HTMLOrNull = document.getElementById("btn");
// Error: btn 可能为 null, null 并不具有 innerHTML 属性
btn.innerHTML = "...";

// 类型断言
(btn as HTMLElement).innerHTML = "...";
// 二者等价
(<HTMLElement>btn).innerHTML = "...";
```

在上面的例子中， 由于 btn 可能不存在，所以当我们直接调用 `btn.innerHTML = "...";` 编译器会提示我们错误 ❌，但是作为代码作者的你 😎 很清楚 btn 一定存在，这时候就可以通过类型断言语法来告诉编译器从而忽略这个错误。

有两种形式的类型断言：`<Type>value` 和 `value as Type`.

同时还有一种常见的断言语法：非空断言 `!` ，用于告诉编译器一个变量一定不会为空。上述例子采用非空断言我们可以这么写：

```ts
const btn: HTMLOrNull = document.getElementById("btn");
btn!.innerHTML = "..."; // 注意 !.
```

### 接口 - interface

在 JavaScript 中，对象是动态的，可以随时添加和删除属性。这就容易导致一些奇怪的问题发生。例如我想要修改 obj 的 name 属性，但是由于手误 😭 写成了 `obj.nmae = 'xxx' `，这并不会引起编译器报错，因为它认为我们在给对象添加一个新的属性。

在 TypeScript 中，我们通常希望对象具有一定的形状，即对象的属性以及属性的类型是固定的。这时我们就可以使用接口 `interface` 来描述对象的形状 🐑。

**⚙️ 基础操作**

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

**📚 只读属性 & 可选属性**

有的使用我们希望对象的某个属性不存在也不影响基本功能...

而有的时候我们又希望对象的某个属性再初始化后就不能再变更了（例如学生的学号）

对于前者，我们可以使用 `?` 来实现可选属性；对于后者，我们可以使用 `readonly` 前缀来实现只读属性。

```ts
interface Person {
  // 使用 readonly 前缀修饰只读属性
  readonly name: string;
  age: number;
  // 使用 ? 表示可选属性
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

**👨‍🦳 继承 & 实现**

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

### 泛型

泛型是指在定义函数、接口或者类的时候，不预先指明具体的类型，而在使用时再指定类型，其实有点类似 C++ 中的模板函数 🎨

**定义 & 使用**

在函数、接口或是类的名称后面加上 `<T>` 来定义一个泛型，`T` 代表一个泛型变量，用于捕获用户传入的类型，然后就可以在函数中使用这个类型（不叫 `T` 也行，只是占位符的名称）.

```ts
// 定义
function identify<T>(arg: T): T {
  return arg;
}
// 自动识别类型
let a = identify(2333);
// 人为指定类型
let b = identify<string>("2333");
```

在上面的例子中，`identify` 函数接收一个任意类型的参数，该参数的类型用 `T` 来表示，同时该函数返回值的类型也为 `T` ,这意味着该函数返回值的类型需要与传入参数的类型一致。

**泛型约束**

在之前的讨论中，我们了解到泛型变量可以代表任何类型。然而，在某些情况下，我们可能希望泛型变量遵从某些特定的规则或约束。这就引出了**泛型约束**的概念。让我们通过一个简单的例子来理解这个概念：

```ts
interface Person {
  name: string;
  age: number;
}

// 泛型约束语法
function logPersonInfo<T extends Person>(person: T): void {
  console.log(person.name);
}
```

在这个例子中，函数 `logPersonInfo` 接收一个类型为 `T` 的参数 `person`，并打印出 `person` 的 `name` 属性。但是，如果我们传入的参数没有 `name` 属性，那么这将导致编译错误。为了避免这种情况，我们可以使用泛型约束 `T extends Person`，以确保传入的参数 `person` 符合 `Person` 接口的形状，即 `person` 必须具有 `name` 和 `age` 属性。

因此，只要一个对象具有 `name` 和 `age` 属性，**无论它具有什么其他的属性或方法**，都可以被传递给 `logPersonInfo` 函数。

再来看一个泛型约束的其他语法: `extends keyof`

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

console.log(getProperty(x, "a")); // 输出 1

// 错误: 参数 'm' 不是 'a' | 'b' | 'c' | 'd' 中的一个
console.log(getProperty(x, "m"));
```

上述例子中存在两个泛型变量 T 和 K, 其中 `K extends keyof T` 是一个泛型约束，它表示 K 必须是 T 的键的类型。当我们调用 `getProperty(x, "m")` 时，会先检查 "m" 是不是 `x` 的一个键，如果不是的话编译器就会报错。

---

::: warning 🚧 TODO

配置文件

:::
