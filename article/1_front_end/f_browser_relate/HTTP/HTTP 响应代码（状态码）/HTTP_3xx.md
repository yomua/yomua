# [302](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Status/302)

## 概述

表示请求的资源已临时移动到 [`Location`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Headers/Location) 标头中的 URL。

这时候, 浏览器默认存在两种情况: 

1. 导航请求被重定向到指定资源
2. 一般请求被重定向到指定资源

## 导航请求被重定向

导航请求:

- 用户直接在地址栏访问 URL
- 用户点击 `<a href="...">`
- `<form action="...">` 提交
- `window.location.href = '...'`

通过导航请求访问某个资源, 该资源返回 302 重定向到 Location - URL 时,  浏览器将会自动重定向(即: 跳转) 到此 URL.

相当于直接在浏览器输入框中输入 Location - URL 重定向过去.

## 一般请求被重定向

一般请求 (以及通过这两种请求方式而包装的各种方法):

- [XMLHttpReuqest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
- [Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

通过一般请求访问某个资源, 该资源返回 302 重定向到 Location - URL 时, 浏览器不会跳转到此 URL, 而是会在原页面使用此 URL 发送请求.

这时候会有两种情况: 

1. 如果指向的是同源 URL, 则可以通过 JS 获取到 Response

   你可以通过 Response 获取到 Location - URL, 并通过代码进行跳转.

2. 如果指向的是跨域 URL, 则不可以通过 JS 获取到 Response

   但如果使用 [`Fetch - Redirect`](https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect) [`RequestInit - Redirect`](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#redirect) 可以通过使用 `redirect: 'manual'` 强行获取到 Response, 不过此时的 Response 的值可能不会如你所想:

   ```js
   Response: {
     status: 0, // 如果是同源 URL, 则是 302
     // 首次请求资源时, 被返回 302 的请求
     url: 首次发起的请求地址 ,
     type: 'opaqueredirect'
   }
   ```

   想要强行重定向调转到跨域的 Location - URL, 也有个**邪修**操作: 

   通过 `type: 'opaqueredirect'` 来获取到此次请求是否为重定向请求,

   然后通过 `location.href = response.url` 将此源请求变成导航请求, 从而让浏览器去跳转到 Location - URL.