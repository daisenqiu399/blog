---
updateTime: "2025-04-22 10:43"
desc: "React常用的15个Hooks"
tags: "ReactHooks"
outline: deep
---
## ReactHooks

### uesState

`useState` 是一个 React Hook，允许函数组件在内部管理状态。

组件通常需要根据交互更改屏幕上显示的内容，例如点击某个按钮更改值，或者输入文本框中的内容，这些值被称为状态值也就是(state)。

**使用方法**

`useState` 接收一个参数，即状态的初始值，然后返回一个数组，其中包含两个元素：当前的状态值和一个更新该状态的函数

```ts
const [state, setState] = useState(initialState)
```

**注意事项**

`useState` 是一个 Hook，因此你只能在 `组件的顶层` 或自己的 `Hook` 中调用它。你不能在循环或条件语句中调用它。

在严格模式中，React 将 `两次调用初始化函数`，以 帮你找到意外的不纯性。这只是开发时的行为，不影响生产

**调用 `set` 函数更新 `state` 将会`重新渲染组件`。React 会存储新状态，使用新值重新渲染组件，并更新 UI。**

**用法**

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}

```



### useEffect

`useEffect` 是 React 中用于处理`副作用`的钩子。并且`useEffect` 还在这里充当生命周期函数，在之前你可能会在类组件中使用 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 来处理这些生命周期事件。

**什么是副作用函数，什么是纯函数？**

**这个问题在面试中也会被经常被问到。**

**纯函数**

1. 输入决定输出：相同的输入永远会得到相同的输出。这意味着函数的行为是可预测的。
2. 无副作用：纯函数`不会修改外部状态`，也不会依赖外部可变状态。因此，纯函数内部的操作不会影响外部的变量、文件、数据库等。

**例子(纯函数)**

```ts
const add = (x: number, y: number) => x + y
add(1,2) //3
```

**副作用函数**

1. 副作用函数 指的是那些在执行时会改变外部状态或依赖外部可变状态的函数。
2. 可预测性降低但是副作用不一定是坏事有时候副作用带来的效果才是我们所期待的
3. 高耦合度函数非常依赖外部的变量状态紧密

- 操作引用类型
- 操作本地存储例如`localStorage`
- 调用外部API，例如`fetch` `ajax`
- 操作`DOM`
- 计时器

**useEffect用法**

```ts
useEffect(setup, dependencies?)
```

**参数**

- setup：Effect处理函数,可以返回一个清理函数。组件挂载时执行setup,依赖项更新时先执行cleanup再执行setup,组件卸载时执行cleanup。
- dependencies(可选)：setup中使用到的响应式值列表(props、state等)。必须以数组形式编写如[dep1, dep2]。不传则每次重渲染都执行Effect。

**返回值**

useEffect 返回 `undefined`

```tsx
let a = useEffect(() => {})
console.log('a', a) //undefined
```

**基本使用**

副作用函数能做的事情`useEffect`都能做，例如操作`DOM`、网络请求、计时器等等。

**操作DOM**

```tsx
import { useEffect } from 'react'

function App() {
  const dom = document.getElementById('data')
  console.log(dom) //null
  useEffect(() => {
    const data = document.getElementById('data')
    console.log(data)
  }, [])
  return <div id='data'>戴森球</div>
}
```

**网络请求**

```tsx
useEffect(() => {
  fetch('http://www.daisenqiu.top')
}, [])
```



**执行时机**

**组件挂载时执行**

根据我们下面的例子可以观察到，组件在挂载的时候就执行了`useEffect`的副作用函数。

类似于`componentDidMount`

```tsx
useEffect(() => {
  console.log('组件挂载时执行')
})
```

**组件更新时执行**

- 无依赖项更新

根据我们下面的例子可以观察到，当有响应式值发生改变时，`useEffect`的副作用函数就会执行。

类似于`componentDidUpdate` + `componentDidMount`

```tsx
 useEffect(() => {
      console.log('执行了', count, name)
   })
```

- 有依赖项更新

根据我们下面的例子可以观察到，当依赖项数组中的`count`值发生改变时，`useEffect`的副作用函数就会执行。而当`name`值改变时,由于它不在依赖项数组中,所以不会触发副作用函数的执行。

```tsx
  useEffect(() => {
      console.log('执行了', count, name)
   }, [count]) //当count发生改变时执行 
```

- 依赖项空值

根据我们下面的例子可以观察到，当依赖项为空数组时，`useEffect`的副作用函数只会执行一次，也就是组件挂载时执行。

适合做一些`初始化`的操作例如获取详情什么的。

```tsx
useEffect(() => {
    console.log('执行了', count, name)
   }, []) //只会执行一次
```

**组件卸载时执行**

`useEffect`的副作用函数可以返回一个清理函数，当组件卸载时，`useEffect`的副作用函数就会执行清理函数。

确切说清理函数就是副作用函数运行之前，会清楚上一次的副作用函数。

根据我们下面的例子可以观察到，当组件卸载时，`useEffect`的副作用函数就会执行。

类似于`componentWillUnmount`

```jsx
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```



### useReducer

`useRender`是React提供的一个高级Hook,没有它我们也可以正常开发，但是useReducer可以使我们的代码具有更好的可读性，可维护性。

useRenucer跟useState一样的都是帮我们管理组件状态的，但是呢与useState不同的是useReducer是集中式的管理状态

**用法**

```jsx
const [state,dispatch]=useReducer(reducer,initiaArg,init?)
```

**参数**

reducer是一个处理函数，用于更新状态，reducer里面包含了两个参数，第一个参数是state,第二个参数是action,reducer会返回一个新的state.

initialArg是state的初始值

init是一个可选的函数，用于初始化state,如果编写init函数，则默认值使用init函数的返回值，否则使用initialArg

**案例**

```jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}

```



### useSyncExternalStore

`usesYNCExternalStore`是React18引入的一个Hook,用于从外部存储（例如状态管理库，浏览器API等）获取状态并在组件中同步显示，这对于需要跟踪外部状态的应用非常有用

**场景**

1、订阅外部store,例如（redux,Zustand)

2、订阅浏览器API，例如(online,storage,location)等

3、抽离逻辑，编写自定义hooks

4、服务端渲染支持

**用法**

```jsx
const res=useSyncExternalStore(subscribe,getSnapshot,getServerSnapshot?)
```

subscribe:用来订阅数据源的变化，接受一个回调函数，在数据更新时调用该回调函数

getSnapshot:获取当前数据源的快照（当前状态）

getServerSnapshot?:在服务端渲染时用来获取数据源的快照

返回值：该res的当前快照，可以在你的渲染逻辑中使用

```jsx
const subscribe=(callback:()=>void)=>{
    //订阅
    callback()
    return ()=>{
        //取消订阅
    }
}
const getSnapshot=()=>{
    return data
}
const res=useSyncExternalStore(subscribe,getSnapshot)
```

**案例**

**1、订阅浏览器APII实现自定义hook(useStorage)**

我们实现一个useStorage Hook,用于订阅localStorage数据，这样做的好处是，我们可以确保组件在localStorage数据发生变化时，自动更新同步。

实现代码

我们创建一个useStorage Hook，能够存储数据到localStorage,并在不同的浏览器标签页之间同步这些状态，此Hook接收一个键值参数用于存储数据的键名，还可以接受一个默认值应用于在无数据时的初始化

```tsx
import { StrictMode, useSyncExternalStore } from "react";

export const useStorage=(key:any,defaultValue?:any)=>{
    const subscribe=(callback:()=>void)=>{
        window.addEventListener('storage',(e)=>{
            console.log('触发了',e),
            callback()
    })
    return ()=>window.removeEventListener('storage',callback)
    }
    const getSnapshot=()=>{
        return (localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)!):null)||defaultValue
    }
    //修改数据
    const setStorage=(value:any)=>{
        localStorage.setItem(key,JSON.stringify(value))
        window.dispatchEvent(new StorageEvent('storage'))
    }
    //返回数据
    const res=useSyncExternalStore(subscribe,getSnapshot)
    return [res,setStorage]
}
```



### useTransition

`useTransition`是React 18中引入的一个Hook,用于管理UI中的过度状态，特别是在处理长时间运行的状态更新时，它允许你将某些更新标记为过度状态，这样React可以优先处理更重要的更新，比如用户输入，同时延迟处理过渡更新

**用法**

```jsx
const [isPending,startTransiton]=useTransition();
```

**参数**

`useTransition`不需要任何参数

**返回值**

useTransition返回一个数组，包含两个元素

1、isPending(boolean),告诉你是否存在待处理的transiton.

2、startTransition(function)函数，你可以使用此方法将状态更新标记为transition

**优先级**

(一般) 不是很重要，因为在实际工作中应用`较少`

**案例**

App.js

```jsx
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

Item.js

```jsx
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, call the callback in startTransition.
    startTransition(async () => {
      action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}

```

Total.js

```jsx
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}

```

api.js

```jsx
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}

```



### useDeferredValue

`useDeferredValue`用于延迟某些状态的更新，直到主渲染任务完成，这对于高频更新的内容（如输入框，滚动）非常有用，可以让UI更加流畅，避免由于频繁更新而导致的性能问题

**关联问题：useTransition 和 useDeferredValue 的区别？**

`useTransition` 和 `useDeferredValue` 都涉及延迟更新，但它们关注的重点和用途略有不同：

- useTransition主要关注点是`状态的过渡`。它允许开发者控制某个更新的延迟更新，还提供了过渡标识，让开发者能够添加过渡反馈。
- useDeferredValue主要关注点是`单个值`的延迟更新。它允许你把特定状态的更新标记为低优先级。

**用法**

```jsx
const deferredValue=useDeferredValue(value)
```

**参数**

value:延迟更新的值(支持任意类型)

**返回值**

- deferredValue: 延迟更新的值,在初始渲染期间，返回的延迟值将与您提供的值相同

**案例**

一种常见的替代 UI 模式是*推迟*更新结果列表，并继续显示以前的结果，直到新结果准备就绪。调用以向下传递查询的延迟版本：`useDeferredValue`

```jsx
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

**注意**

- `useDeferredValue` 并不是防抖,防抖是需要一个固定的延迟时间，譬如1秒后再处理某些行为，但是useDeferredValue并不是一个固定的延迟，它会根据用户设备的情况进行延迟，当设备情况好，那么延迟几乎是无感知的



### **useLayoutEffect**

**陷阱**

`useLayoutEffect`可能会损害性能。尽可能使用 `useEffect`

useLayoutEffect是React中的一个Hook,用于在浏览器重新绘制屏幕之前触发，与useEffect类似。

**用法**

```jsx
useLayoutEffect(()=>{
    return ()=>{
        
    }
},[dependencies]);
```

**参数**

setup：Effect处理函数,可以返回一个清理函数。组件挂载时执行setup,依赖项更新时先执行cleanup再执行setup,组件卸载时执行cleanup。

dependencies(可选)：setup中使用到的响应式值列表(props、state等)。必须以数组形式编写如[dep1, dep2]。不传则每次重渲染都执行Effect。



**应用场景**

- 需要同步读取或更改DOM：例如，你需要读取元素的大小或位置并在渲染前进行调整。
- 防止闪烁：在某些情况下，异步的useEffect可能会导致可见的布局跳动或闪烁。例如，动画的启动或某些可见的快速DOM更改。
- 模拟生命周期方法：如果你正在将旧的类组件迁移到功能组件，并需要模拟 componentDidMount、componentDidUpdate和componentWillUnmount的同步行为。

**案例**

可以记录滚动条位置，等用户返回这个页面时，滚动到之前记录的位置。增强用户体验。

```jsx
import React, { useLayoutEffect, useRef } from 'react';

function App() {
   useLayoutEffect(() => {
      const list = document.getElementById('list') as HTMLUListElement;
      list.scrollTop = 900
   }, []);

   return (
      <ul id="list" style={{ height: '500px', overflowY: 'scroll' }}>
         {Array.from({ length: 500 }, (_, i) => (
            <li key={i}>Item {i + 1}</li>
         ))}
      </ul>
   );
}

export default App;

```



### useRef

当你在React中需要处理DOM元素或需要在组件渲染之间保持持久性数据时，便可以使用useRef

```jsx
import {useRef} from 'react';
const refValue=useRef(initialValue)
refValue.current //访问ref的值
```

通过Ref操作DOM元素

**参数**

- initialValue：ref 对象的 current 属性的初始值。可以是任意类型的值。这个参数在首次渲染后被忽略。

**返回值**

- useRef返回一个对象，对象的current属性指向传入的初始值。 `{current:xxxx}`

**注意**

- 改变 ref.current 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。
- 除了 初始化 外不要在渲染期间写入或者读取 ref.current，否则会使组件行为变得不可预测。

**数据存储**

我们实现一个保存count的新值和旧值的例子，但是在过程中我们发现一个问题，就是num的值一直为0，这是为什么呢？

因为等`useState`的 `SetCount`执行之后，组件会重新rerender,num的值又被初始化为了0，所以num的值一直为0。

```jsx
import React, { useLayoutEffect, useRef, useState } from 'react';

function App() {
   let num = 0
   let [count, setCount] = useState(0)
   const handleClick = () => {
      setCount(count + 1)
      num = count;
   };
   return (
      <div>
         <button onClick={handleClick}>增加</button>
         <div>{count}:{num}</div>
      </div>
   );
}

export default App;

```

**如何修改？**

我们可以使用useRef来解决这个问题，因为useRef只会在初始化的时候执行一次，当组件reRender的时候，useRef的值不会被重新初始化。

```jsx
import React, { useLayoutEffect, useRef, useState } from 'react';

function App() {
   let num = useRef(0)
   let [count, setCount] = useState(0)
   const handleClick = () => {
      setCount(count + 1)
      num.current = count;
   };
   return (
      <div>
         <button onClick={handleClick}>增加</button>
         <div>{count}:{num.current}</div>
      </div>
   );
}

export default App

```



### useImperativeHandle

可以在子组件内部暴露给父组件`句柄`，那么说人话就是，父组件可以调用子组件的方法，或者访问子组件的属性。 如果你学过Vue，就类似于Vue的`defineExpose`

**用法**

```jsx
useImperativeHandle(ref,()=>{
    return{
        
    }
},[deps])
```

**参数**

ref:父组件传递的ref对象

createHandle:返回值，返回一个对象，对象的属性就是子组件暴露给父组件的方法或属性

deps?:[可选]依赖项，当依赖项发生变化时，会重新调用createHandle函数，类似于useEffect的依赖项

>注意：
>
>从React19开始，ref可以作为prop使用，在React18及更早版本中，需要使用forwardRef

**用法**

**向父组件公开自定义ref句柄**

要将DOM节点公开给父元素，请将prop传递给该节点，ref

```js
import {useRef,useImperativeHandle} from 'react';
function MyInput({ref,...props}){
    const inputRef=useRef(null);
    useImperativeHnadle(ref,()=>{
        return {
            focus(){
                inputRef.current.focus();
            },
            scrollIntoView(){
                inputRef.current.scrollIntoView();
            },
        };
    },[]);
    return <Input {...props} ref={inputRef}/>
};
 export default MyInput;
```

在父组件中调用

```js
import {useRef} from 'react';
import MyInput from './MyInput.js';
export default function Form(){
    const ref=useRef(null);
    function handleClick(){
        ref.current.focus();
    }
    return (
        <form>
         <MyInput placeholder='Enter your name' ref={ref}/>
          <button type='button' onCLick='handleClick'>
              Edit
          </button>
        </form>
    );
}
```



### useContext

`useContext`提供了一个无需为每层组件手动添加props,就能在组件树间进行数据传递的方法，设计的目的就是解决组件树间数据传递的问题。

**参数**

context:是createContext创建出来的对象，他不保持信息，是信息的载体，声明了可以从组件获取或者给组件提供信息

返回值

返回传递的Context的值，并且是只读的，如果context发生变化，React会自动重新渲染读取context的组件

**用法:改变主题**

```js
import React, { useContext, useState } from 'react';
// 创建上下文
const ThemeContext = React.createContext<ThemeContextType>({} as ThemeContextType);
// 定义上下文类型
interface ThemeContextType {
   theme: string;
   setTheme: (theme: string) => void;
}
const Child = () => {
    // 获取上下文
   const themeContext = useContext(ThemeContext);
   const styles = {
      backgroundColor: themeContext.theme === 'light' ? 'white' : 'black',
      border: '1px solid red',
      width: 100 + 'px',
      height: 100 + 'px',
      color: themeContext.theme === 'light' ? 'black' : 'white'
   }
   return <div>
      <div style={styles}>
         child
      </div>
   </div>
}

const Parent = () => {
    // 获取上下文
   const themeContext = useContext(ThemeContext);
   const styles = {
      backgroundColor: themeContext.theme === 'light' ? 'white' : 'black',
      border: '1px solid red',
      width: 100 + 'px',
      height: 100 + 'px',
      color: themeContext.theme === 'light' ? 'black' : 'white'
   }
   return <div>
      <div style={styles}>
         Parent
      </div>
      <Child />
   </div>
}

function App() {
   const [theme, setTheme] = useState('light');
   return (
      <div>
         <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>切换主题</button>
         <ThemeContext.Provider value={{ theme, setTheme }}>
            <Parent />
         </ThemeContext.Provider>
      </div >
   );
}

export default App;


```



### useMemo

`useMemo`用法

```jsx
import React,{useMemo,useState} from "react";
const App=()=>{
    const [count,setCount]=useState(0);
    const memoizedValue=useMemo(()=>count,[count]);
    return <div>{memoizedValue}</div>
}
```

**参数**

回调函数：Function:返回需要缓存的值

依赖项Array:依赖项发生变化时，回调函数会重新执行，执行实际跟useEffect类似）

返回值：返回需要缓存的值(返回之后就不是函数了)

下面的例子当我们使用 `useMemo` 缓存后，只有 goods 发生变化时， `total` 才会重新计算, 而 search 发生变化时， `total` 不会重新计算。

```tsx
import React,{useMemo,useState} from "react";
function App(){
    const [search,setSearch]=useState('');
    const [goods,setGoods]=useState([
        {id:1,name:'苹果',price:10,count:1},
        {id:2,name:'香蕉',price:20,count:1},
        {id:3,name:'橘子',price:30,count:1},
    ]);
    const handleAdd=(id:number)=>{
        setGoods(goods.map(item=>item.id===id?{...item,count:item.count+1}:item));
    }
    const handleSub=(id:number)=>{
        setGoods(goods.map(item=>item.id===id?{...item,count:item.count-1}:item));
    }
    const total=useMemo(()=>{
     console.log('total');
     return goods.reduce((total,item)=>total+item.price*item.count,0)
    },[goods]);

    return (
        <div>
            <h1>父组件</h1>
            <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} />
            <table border={1} cellPadding={5} cellSpacing={0}>
             <thead>
                <tr>
                    <th>商品名称</th>
                    <th>商品价格</th>
                    <th>商品数量</th>
                </tr>
             </thead>
             <tbody>
                {goods.map(item=><tr key={item.id}>
                 <td>{item.name}</td>
                 <td>{item.price*item.count}</td>
                 <td>
                    <button onClick={()=>handleAdd(item.id)}>+</button>
                    <button onClick={()=>handleSub(item.id)}>-</button>
                 </td>
                </tr>)}
             </tbody>
            </table>
            <h2>总价:{total}</h2>
        </div>
    );
}
export default App;
```

**useMemo 执行时机(依赖项)**

1. 如果依赖项是个空数组，那么 `useMemo` 的回调函数会执行一次
2. 指定依赖项，当依赖项发生变化时， `useMemo` 的回调函数会执行
3. 不指定依赖项，不推荐这么用，因为每次渲染和更新都会执行

**useMemo 总结**

**使用场景**：

- 当需要缓存复杂计算结果时
- 当需要避免不必要的重新计算时
- 当计算逻辑复杂且耗时时

**优点**：

- 通过记忆化避免不必要的重新计算
- 提高应用性能
- 减少资源消耗

**注意事项**：

- 不要过度使用，只在确实需要优化的组件上使用
- 如果依赖项经常变化，useMemo 的效果会大打折扣
- 如果计算逻辑简单，使用 useMemo 的开销可能比重新计算还大



### useCallBack

`useCallBack`用于优化性能，返回一个记忆化的回调函数，可以减少不必要的重新渲染，也就是说它是用于缓存组件内的函数，避免函数的重复创建。

在React中，函数组件的重新渲染会导致组件内的函数被重新创建，这可能会导致性能问题，useCallback通过缓存函数，可以减少不必要的重新渲染，提高性能。

**用法**

```jsx
const memoizedCallback=useCallback(()=>{
    dosomething(a,b);
},[a,b]);
```

**参数**

callback:回调函数

deps：依赖数组，当以来数组发生变化时，回调函数会被重新创建，跟useEffect一样

**返回值**

返回一个记忆化的回调函数，可以减少函数的创建次数，提高性能

**总结**

useCallback的使用需要有所节制，不要盲目地对每个方法应用useCallback，这样做可能会导致不必要的性能损失。useCallback本身也需要一定的性能开销。

useCallback并不是为了阻止函数的重新创建，而是通过依赖项来决定是否返回新的函数或旧的函数，从而在依赖项不变的情况下确保函数的地址不变。



### useDebugValue

`useDebugValue`是一个专门为开发者调试自定义Hook而设计的React Hook。它允许你在React开发者工具中为自定义Hook添加自定义的调试值。

**用法**

```jsx
const debugValue=useDebugValue(value)
```

**参数**

value:要在React DevTools中显示的值

formatter:可选，格式化函数：

作用：自定义值得显示格式

调试时机：仅在React DevTools打开时才会调用，可以进行复杂得格式化操作

参数：接收value作为参数

返回：返回格式化后得显示值



**useId**

`useId`是React18新增得一个Hook,用于生成稳定得唯一标识符，主要用于解决SSR场景下的ID不一致问题，或者需要为组件生成唯一ID的场景

**使用场景**

为组件生成唯一ID

解决SSR场景下的ID不一致问题

无障碍交互唯一ID

**用法**

```jsx
const id=useId()
```



### useOptimistic

`useOptimistic`是一个React Hooks，可以乐观的更新UI

**用法**

```jsx
const [optimisticState,addOptimistic]=useOptimistic(state,updateFn);
```

`useOptimistic`是一个 React Hook，它允许你在异步 action 进行时显示不同的状态。它接受某个状态作为参数，并返回该状态的副本，该副本在异步作（如网络请求）的持续时间内可能会有所不同。您提供了一个函数，该函数采用当前状态和作的输入，并返回要在作挂起时使用的乐观状态。

此状态称为 “乐观” 状态，因为它通常用于立即向用户显示执行作的结果，即使该作实际上需要一些时间才能完成。

**参数**

- `state`：最初和没有待处理作时返回的值。
- `updateFn(currentState, optimisticValue)`：一个函数，它接受当前状态和传递给的乐观值，并返回生成的乐观状态。它必须是一个纯函数。 接受两个参数。和 .返回值将是 和 的合并值。`addOptimistic``updateFn``currentState``optimisticValue``currentState``optimisticValue`

**返回**

- `optimisticState`：生成的乐观状态。它等于 除非作处于待处理状态，在这种情况下，它等于 返回的值。`state``updateFn`
- `addOptimistic`： 是 Optimistic Update 时要调用的调度函数。它接受一个任何类型的参数 ，并将调用 with 和 。`addOptimistic``optimisticValue``updateFn``state``optimisticValue`

**用法**

Hook 提供了一种在后台作（如网络请求）完成之前乐观地更新用户界面的方法。在表单上下文中，此技术有助于提高应用程序的响应速度。当用户提交表单时，界面会立即更新为预期结果，而不是等待服务器的响应反映更改。`useOptimistic`

例如，当用户在表单中键入消息并点击“发送”按钮时，Hook 允许消息立即出现在列表中，并显示“正在发送...”标签，甚至在邮件实际发送到服务器之前。这种“乐观”的方法给人的印象是速度和响应能力。然后，表单会尝试在后台真正发送消息。服务器确认已收到邮件后，“Sending...”标签被删除。`useOptimistic`

>actions.js

```jsx
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}

```



>App.js

```jsx
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}

```



### useActionState

`useActionState`是一个Hook,允许你根据表单的结果更新state。

```jsx
const [state,formAction,isPending]=useActionState(fn,initialState,permallink?);
```

在组件的顶层调用 以创建在调用表单作时更新的组件状态。您传递现有的表单作函数和初始状态，它会返回您在表单中使用的新作，以及最新的表单状态以及该作是否仍处于待处理状态。最新的表单状态也会传递给您提供的函数。`useActionState``useActionState`

表单状态是上次提交表单时作返回的值。如果尚未提交表单，则它是您传递的初始状态。

如果与服务器函数一起使用，则允许服务器提交表单的响应甚至在冻结完成之前显示。`useActionState`

**用法**

>actions.js

```jsx
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}

```

>App,js

```jsx
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

