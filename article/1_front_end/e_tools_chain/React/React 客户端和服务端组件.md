# [客户端组件](https://zh-hans.react.dev/reference/rsc/use-client)



# [服务端组件](https://zh-hans.react.dev/reference/rsc/use-server) 

# 流程

打包时, 服务器组件和客户端组件通常会分开打包, 你需要分开部署它们.

- 使用 next.js 这样的工具, 就会分开打包服务器组件和客户端组件.

**对于客户端组件:**

客户端组件就是普通的 React 组件, 一个普通的 React 组件其实就是一个 js 函数, 

此函数将会运行在浏览器环境中, 所以可以调用浏览器提供的 API, 如: DOM. 

再由 React 将此函数调用并构建成一个可交互的 HTML.

所以客户端组件, 只需要放在一个可以提供加载静态资源的服务器上就行, 

然后用户访问网页, 请求服务器时, 服务器将静态资源发到浏览器端, 

然后浏览器再执行 js 代码(一个组件, 或者说是一个函数), 通过已经提前就加载好的 React 代码 (就是普通的 js 代码), 

执行组件 (一个普通函数), 构建成一个可交互的 HTML, 然后渲染到页面的指定地方.

**对于服务端组件:**

服务端组件也是一个 js 函数, 但是此函数不能调用具有浏览器 API 的代码, 如: 不能调用 DOM 等.

因为此函数将运行在服务器环境上, 自然没有浏览器相关的 API.

这也意味着: 服务端组件需要一个能执行 js 代码的服务器环境来运行它, 如: 用 node 作为服务的运行环境.

- 服务器组件不能部署在 nginx 这类环境中, 因为 nginx 是一个提供静态资源托管的网页服务器工具, 

  它不能执行 JavaScript 代码

当用户访问一个路由 (网页地址)时, 如: `/about`, 如果此路由对应的组件是一个服务器组件, 

且服务器组件被正确部署在支持运行 js 环境的服务器中, 比如: node 服务器, 

那么浏览器发送请求到 node 服务器上时, node 服务器将调用此服务器组件, 

并通过其他代码 (如: [next.js](https://nextjs.org/docs/getting-started/installation) ) 将服务器组件处理成 HTML 内容, 然后发送到用户的浏览器, 

浏览器接收到 html 后, React 不会先处理 html, 而是让浏览器直接进行渲染,

React 将会在后台对此 HTML 字符串内容进行[水合](https://zh-hans.react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)操作, 使得此 HTML 内容具有可交互性 (比如: 单击, 双击事件等).

而这样就完成由服务端渲染 HTMl, 浏览器水合的这一套流程, 而这套流程被称之为 [SSR](https://github.com/reactwg/react-18/discussions/37).

- 值得注意的是: 服务器组件是 SSR 的一部分

  SSR: 表示服务端渲染技术.

  服务器组件: SSR 技术下的一个实现.

  就像 ajax 技术和 fetch, XHR 实现一样.