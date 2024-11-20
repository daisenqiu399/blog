---
updateTime: "2023-08-30 23:02"
desc: "HTTP深入浅出"
tags: "HTTP"
outline: deep
---

# HTTP实用指南

## 1、初识

问题引入，当浏览器输入域名以后，会发生生么？

**大致流程**

**1、URL解析，2、DNS查询，3、TCP连接，4、处理请求，5、接受响应，6、渲染页面**

### URL解析

首先浏览器会判断你输入的是一个合法的URL还是一个待搜索的关键字，并且根据你输入的内容进行自动检查，字符编码等操作，还会有一些其他操作，比如安全检查，访问限制等

检查缓存

<!-- ![image-20241113164139705](C:\Users\戴森球\AppData\Roaming\Typora\typora-user-images\image-20241113164139705.png) -->



### DNS查询：

DNS的内容感兴趣可自行百度，本质是一个域名解析到ip,DNS也会检查缓存，浏览器会先检查是否有缓存，没有则调用系统库函数进行查询，操作系统也有自己的DNS缓存，但在这之前，会向检查域名是否存在本地的Hosts文件里，没有则向DNS服务器发送查询请求



### TCP连接

TCP/IP有四层概念模型，应用层，传输层，网络层，数据链路层

**应用层**：发送HTTP请求，在前面的步骤通过DNS查询我们已经可以得到服务器的ip地址，浏览器会开始构造一个http报文，包括请求报文，请求方法，URL,请求主体

**传输层**：传输层会发起一条到达服务器的TCP连接，在建立连接前，会先进行TCP三次握手

**网络层**：IP协议查询Mac地址，将数据打包，并加入源及目标的IP地址，并且负责寻找传输线路。判断目标地址是否与当前地址处于同一网络中，是的话直接根据Mac地址发送，否则使用路由表查找下一条地址，以及使用ARP协议查询他的Mac地址

**链路层**：以太网协议

根据以太网协议将数据分为以帧为单位的数据包，每一帧分为两个部分，标头（数据包的发送者，接受者，数据类型）和数据（数据包具体内容）



### 处理请求：

接受TCP报文后，会对连接进行处理，对HTTP协议进行解析

### 浏览器接受响应

浏览器接收到来自服务器的响应资源后，会对资源进行分析。首先查看 Response header，根据不同状态码做不同的事，如果响应资源进行了压缩（比如 gzip），还需要进行解压。然后，对响应资源做缓存。



### 渲染页面

浏览器会下载html,css,JavaScript文件，浏览器解析是从上往下一行一行解析的，

**HTML解析**（解码，预解析，符号化，构建树）

**CSS解析**（匹配规则，渲染树，计算，级联，渲染阻塞，布局与绘制，回流与重绘）

**JavaScript编译执行**（词法分析，预编译，创建执行上下文，执行）



上面说明了一个完整的请求，那什么是HTTP呢，HTTP是一种超文本传输协议，基于TCP协议

## 2、协议分析

### **报文分析（Method)**

| GET     |                                      |
| ------- | ------------------------------------ |
| POST    | GET请求用于获取数据                  |
| PUT     | 用于提交数据，如表单                 |
| DELETE  | 删除指定的资源                       |
| HEAD    | 与GET一样，但没有响应体              |
| CONNECT | 建立一个由目标资源标识的服务器的隧道 |
| OPTIONS | 用于描述目标资源的通信选项           |
| TRACE   | 沿着目标资源路径执行消息环回测试     |
| PATCH   | 用于对资源应用部分修改               |



### **状态码分析**

1xx:指示信息，表示请求已经接收，继续处理

2xx:成功

3xx:重定向，要完成请求必须进行跟进一步的操作

4xx:客户端错误,请求由错误

5xx:服务期错误



**常用响应头**

<!-- ![image-20241113172953764](C:\Users\戴森球\AppData\Roaming\Typora\typora-user-images\image-20241113172953764.png) -->



### **cookie**

<!-- ![image-20241113173149294](C:\Users\戴森球\AppData\Roaming\Typora\typora-user-images\image-20241113173149294.png) -->



**HTTP/2概述**，更快，更稳定，更简单，帧是HTTP/2通信的最小单位，交错发送，接收方重组织，HTTP/2的连接都是永久的，而且仅需要每一个来源的连接

**HTTPS概述**：经过TSL/SSL加密，更安全

对称加密：加密和解密都是使用同一个密钥

非对称加密：加密和解密需要使用两个不同的密钥：公钥和私钥

## 3、常见场景

### 跨域问题

跨域问题是因为浏览器的同源策略（Same origin policy, SOP）是一种约定，由Netscape公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。所谓同源策略是指“协议+域名+端口”三者相同。

解决跨域方案：CORS,代理服务器，iframe

安装cors

```javascript
npom install cors
```

### cors响应头部 Access-Control-Allow-Headers

```javascript
//允许客户端额外向服务器发送content-type请求头和x-custom-header请求头
//注意，多个请求头之间用英文逗号进行分隔
res.setHeader('Access-Control-Allow-Headers','Content-Type','X-Custom-Header')
```



默认情况下，cors仅支持客户端发起GET,POST,HEAD请求，如果客户端希望通过PUT,DELETE等方式请求服务器的资源，则需要在服务器端，通过Access-Control-Allow-Methods来指明实际请求所允许使用的HTTP方法

```javascript
//只允许使用POST,GET,DELETE,HEAD请求方法
res.setHeader('Access-Control-Allow-Methods','POST,GET,DELETE,HEAD')
//允许所有的HTTP请求方法
res.setHeader('Access-Control-Allow-Methods','*')
```



### 鉴权

服务器端渲染推荐使用session认证机制

前后端分离推荐使用JWT认证机制

### session认证机制

http协议的无状态性

在web开发中的专业术语叫做cookie

#### 什么是cookie

cookie是存储在用户浏览器中的一般不超过4kb的字符串，它由哟个名称，一个值和其他几个用于控制cookie有效期，安全性，使用范围的可选属性组成

cookie的极大特性，自动发送，域名独立，过期时限

cookie在身份中的作用

客服端第一次请求服务器的时候，服务器通过响应头的形式，向客户端发送一个cookie,客户端会自动将cookie保存在浏览器中

cookie不具有安全性

提高身份认证的安全性

## session认证

express-session中间件安装成功后，需要通过app.use()来注册session中间件，示例代码如下

```javascript
//导入session中间件
var session=require('express-session')
//配置session中间件
app.use(session({
    secret:'keyboard cat', //secret属性的值可以为任意字符
    resave:false, //固定写法
    saveUninitialized:true //固定写法
    
}))
```



#### 向session中存数据

当express-session中间件配置成功后，即通过req.session来访问和使用session对象，从而存储用户的关键信息

```javascript
app.post('/api/login',(req,res)+>{
    //判断用户提交的登录信息是否正确
   if(req.body.usename!=='admire'||res.body.password!=='0000'){return res.send({status:1,msg:'登录失败'})
                                                              }
    res.session.user=req.body //将用户的信息，存储到session中
    res.session.islogin=true //将用户的登录状态，存储到session中
    res.send({status:0,msg:'登录成功'})
})
```





### 从session中取数据

可以直接从req.session对象上获取之前存储的数据，示例代码如下

```javascript
//获取用户姓名的接口
app.get('/api/username',(req,res)=>{
    //判断用户是否登录
    if(!req.session.islogin){
        return res.send({status:1,msg:'fail'})
    }
    res.send({status:0,msg:'success',usename:req.session.user.username})
})
```





### 清空session

```javascript
//退出登录的接口
app.post('/api/logout',(req,res)=>{
    //清空当前客户端对应的session信息
    req.session.destroy()
    res.send({
        status:0,
        msg:'退出登录成功'
    })
})
```





### JWT认证机制，了解session认证的局限性

session认证机制需要配合cookie才能实现，

当前端请求后端接口不存在跨域问题时，推荐使用session身份认证机制

当前端需要跨域请求后端接口时，不推荐session身份认证机制，推荐使用JWT认证机制



## 安装JWT相关的包

运行如下命令，安装如下两个JWT相关的包

```javascript
npm install jsonwebtoken express-jwt
```

jsonwebtoken用于生成jwt字符串

express-jwt用于将jwt字符串解析还原成json对象

## 前后端的身份认证

在express中使用jwt

定义select密钥

为了保证jwt字符串的安全性，防止jwt字符串在网络传输过程中被别人破解，我们需要专门定义一个用于加密和解密的select密钥

当生成jwt字符串的时候，需要使用select密钥对用户信息进行加密，最终得到加密好的jwt字符串

当把jwt字符串解析还原成json对象的时候，需要使用select密钥进行加密

```javascript
//secret密钥的本质，就是一个字符串
const secretKey='itheima No1'
```



### 单点登录

单点登录(SingleSignOn，SSO)，就是通过用户的一次性鉴别登录。当用户在上登录一次以后，即可获得访问单点登录系统中其他关联系统和应用软件的权限，同时这种实现是不需要管理员对用户的登录状态或其他信息进行修改的，这意味着在多个应用系统中，用户只需一次登录就可以访问所有相互信任的应用系统。这种方式减少了由登录产生的时间消耗，辅助了用户管理，是比较流行的



## 4、实际应用

## XHR

```js
  <script>
        document.querySelector('.reg-btn').addEventListener('click',()=>{
            const xhr=new XMLHttpRequest()
        xhr.open('POST','http://hmajax.itheima.net/api/register')
        xhr.addEventListener('loadend',()=>{
            console.log(xhr.response)
        })
        // 设置请求投-告诉服务器
        xhr.setRequestHeader('Content-Type','application/json')
        const useObj={
            username:'itheima006',
            password:'7654321'
        }
        const useStr=JSON.stringify(useObj)

        //携带请求体数据
        xhr.send(useStr)

        })

    </script>
```



### async,await

```js
 <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script>
    /**
     * 目标：掌握async和await语法，解决回调函数地狱
     * 概念：在async函数内，使用await关键字，获取Promise对象"成功状态"结果值
     * 注意：await必须用在async修饰的函数内（await会阻止"异步函数内"代码继续执行，原地等待结果）
    */
   async function getDate() {
    try{
        const pObj=await  axios({
        url:'http://hmajax.itheima.net/api/province', 
    })
    const pname=pObj.data.list[0]
    console.log(pname)
  const cObj= await axios ({url:'http://hmajax.itheima.net/api/city',params:{pname}})
  const cname=cObj.data.list[0]
    console.log(pObj)
    console.log(cname)
    const areaObj=await axios({url:'http://hmajax.itheima.net/api/area',params:{pname,cname}})
    const anaem=areaObj.data.list[0]
    console.log(anaem)
    document.querySelector('.province').innerHTML=pname
    document.querySelector('.city').innerHTML=cname
    document.querySelector('.area').innerHTML=anaem

    }catch(error){
        console.dir(error)
    }
   }
   getDate()
  
  </script>
```





### Promise

```js
 <p class="my-p"></p>
    <script>
        const p =new Promise((reslove,reject)=>{
            //执行XHR
            const xhr=new XMLHttpRequest()
         xhr.open('GET','http://hmajax.itheima.net/api/province')
            xhr.addEventListener('loadend',()=>{
                if(xhr.status>=200&&xhr.status<300){
                    reslove(JSON.parse(xhr.response))
                }
                else{
                    reject(new Error(xhr.response))
                }
            })
               //没有请求体
            xhr.send()
        })
        p.then(result=>{
            // console.log(result.list.join('<br>'))
            document.querySelector('.my-p').innerHTML=result.list.join('<br>')
        }).catch(error=>{
            //错误对象要用console.dir打印
            // console.dir(error)
            document.querySelector('.my-p').innerHTML=error.message
        })

    </script>
```



## 5、了解更多

### WebStoke

浏览器与服务器进行全双工通讯的网络科技

典型场景：实时性要求高，例如聊天室

URL使用ws://或wss://等开头





### QUIC

类似于TCP的可靠传输

类似于TLS的加密传输