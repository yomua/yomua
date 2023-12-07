# 快速开始

1. **任意位置创建一个项目**

2. **在项目根目录创建一个名为 [`manifest.json`](https://developer.chrome.com/docs/extensions/mv2/manifest/) 的文件**

3. **使用任意 IDE 通过 JavaScript 进行项目开发**

4. **将项目打包成 `.crx` 文件安装到 Google 中**

   1. Google 中搜索：`chrome://extensions/` 打开扩展程序
   2. 右上角开启开发者模式
   3. 点击打包扩展程序并将对应的项目文件夹打包。

   **或直接使用文件夹的形式安装到 Google 中**

   1. Google 中搜索：`chrome://extensions/` 打开扩展程序
   2. 右上角开启开发者模式
   3. 点击加载已解压的扩展程序并选择对应的项目文件夹

现在你可以在 Google 中使用你的扩展程序了

# 前言

Chrome 扩展经常不严谨的被称之为：Chrome 插件，因为真正意义上的Chrome插件是更底层的浏览器功能扩展，可能需要对浏览器源码有一定掌握才有能力去开发。 

所以在以下的文章中，我将严谨的称之为：Chrome 扩展。且**本文将按照 Manifest V2 来讲解说明**，如果你需要 V3 的，请参见：[Welcome to Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)

…

对于现在开发 Chrome 扩展来说，是非常简单的一件事情，其只需要使用 JavaScript 即可开发，并且 Chrome 官方对你如何开发 Chrome 扩展程序并没有严格要求，

只需要在你项目的根目录保证存在 `mainfest.json` 文件即可，该文件是用来配置所有和插件相关的配置，必须放在根目录，它就相当于 webpack 的入口文件。

[manifest.json 配置详情](https://developer.chrome.com/docs/extensions/mv2/manifest/)



# manifest.json 字段介绍

## :heavy_exclamation_mark: 称呼规定

- **contentScripts 在本节中指：**使用 `content_scripts` 字段配置的脚本文件。
- **injectJS / inject-\***：在 contentScripts 中向指定页面注入的脚本文件。
- **popup**：使用 `browser_action` 或 `page_action` 字段的选项 `default_popup` 配置的页面

## [EN-background](https://developer.chrome.com/docs/extensions/mv2/background_pages/) | [CN](https://github.com/sxei/chrome-plugin-demo#background)

### What's the background?

background 通常翻译为：后台。

它是一个常驻的页面，其生命周期是扩展中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭。

所以**它的作用的通常是**：把需要**一直运行**的、**启动就运行**的以及**全局代码**放里面去执行。

并且 background 的权限非常高，几乎可以调用所有的 Chrome 扩展 API（除了 devtools），而且它可以无限制跨域，也就是可以跨域访问任何网站而无需要求对方设置 `CORS`。

> 经过测试，其实不止是 background，所有的直接通过 `chrome-extension://id/xx.html` 这种方式打开的网页都可以无限制跨域。
>
> 所以通常我们可以使用 chrome.extension API 的 [getUrl()](https://developer.chrome.com/docs/extensions/reference/extension/#method-getURL) 将项目中的相对路径转为完成的 URL，通常会被转为这样的格式：chrome-extension://xx.xx
>
> 而正也正好使得相对路径所对应的 .js 或 .html 文件可以无限制跨域。

### 语法

```js
{ 
    "background":{
        // page 和 scripts 二选一
        "page"?:"background.html",
            
        // 项目中的任意脚本
        "scripts"?:[
            "background.js",
            "xx.js"?,
            "..."?
        ],
        
        // 可选；设置该 background（后台）是否是持久化的，通常是 false（默认值）
        "persistent"?: false
    }
}
```

- `page`：指定一个 .html 文件
   `scripts`：指定一个 .js 文件

  若你使用 scripts，则 chrome 会自动为该脚本生成一个默认网页

- 使用 `page` 的好处在于：你可以配置 background（后台）的页面

- 不论是使用 `page` 或者是 `scripts`，它们都能搭配使用 `persistent`；

  也可以忽略不使用 `persistent`，它的默认值为：false


### background 在 Chrome 的何处？

1. 在 Chrome 搜索：`chrome://extensions/`
2. 在跳转的页面右上角打开**开发者模式**，
3. 在任意已启用的扩展程序中你可以看见蓝色字体显示的：【背景页】或【background page】字段，
4. 点击【背景页】或【background page】字段，就会弹出一个供开发者调试的 background 页面。

而这就是我们在 `manifest.json` 的 `background` 字段配置的 .html 或 .js。

### note

- 通过点击【背景页】显示的 background 页面（后台页面）和真正在运行的 background 并非同一个，

  弹出的后台页面只是供你调试用的，参见：[此处](https://github.com/sxei/chrome-plugin-demo#background)

- 只有处于开发者模式下且启用了的扩展程序才能查看 【background page】

- 通常来说 `background` 字段选项 `persistent` 的值通常为 **false**，参见：[此处](https://developer.chrome.com/docs/extensions/mv2/background_migration/) 

- 若你不主动查看 background.js，则即使它报错导致程序崩溃，它也并不会主动提示任何信息。

## page_action | browser_action | app（discard）

### 介绍

`manifest.json` 中包含以下三个字段：

1. page_action
2. browser_action
3. app

但是这三个字段**只能选择，也必须选择 1 个使用**，不可选择多个，否则 Chrome 将会加载失败。

### [EN-page_action](https://developer.chrome.com/docs/extensions/reference/pageAction/) 

当某些特定页面打开才显示的图标。

```js
{
	"page_action": {
        "default_popup": "html/pageaction.html",
        "default_title": "鼠标移动到扩展程序时将提示的信息",
        "default_icon": "./picture/sds.png",
        // 也可以选择多张图片，可以为不同的比例设置不同的图片，将自动应用！
        "default_icon": {
            "16": "./picture/sds.png",
            "32": "./picture/sds.png",
            "48": "./picture/sds.png",
            "128": "./picture/sds.png"
        }
    }
}
```

[Tips](https://developer.chrome.com/docs/extensions/reference/pageAction/#tips)：

For the best visual impact, follow these guidelines:

- **Do** use page actions for features that make sense for only a few pages.
- **Don't** use page actions for features that make sense for most pages. Use [browser actions](https://developer.chrome.com/docs/extensions/browserAction/) instead.
- **Don't** constantly animate your icon. That's just annoying.

### [EN-browser_action](https://developer.chrome.com/docs/extensions/reference/browserAction/) 

其用处类似于 `page_action` 字段，但是 `browser_action` 可以显示在任何页面！

```js
{
	"browser_action": {
        "default_popup": "html/browseraction.html",
        "default_title": "鼠标移动到扩展程序时将提示的信息",
		"default_icon": "./picture/icon.png",
        // 也可以选择多张图片，可以为不同的比例设置不同的图片，将自动应用！
        "default_icon": {                    
          "16": "images/icon16.png",       
          "24": "images/icon24.png",       
          "32": "images/icon32.png"         
        }
    }
}
```

### [app（已被弃用）](https://developer.chrome.com/docs/apps/manifest/app/) 

### page_action 和 browser_action 有什么用？

`page_action` 和 `browser_action` 两个字段用来设置扩展程序在用户的”眼中”是什么样子的。

即：设置扩展程序【向外展示的图标（头像）】、【点击扩展程序弹出的页面】以及【鼠标移动到扩展程序时弹出的提示】是什么。

> 在扩展程序界面（`chrome://extensions/`）显示的图标是 `icons` 字段配置的。

![](./picture/what-is-use-browser-action.png)

（what-is-use-browser-action）

以上图片各个弹出框在 `page_action` 或 `browser_action` 字段中的对应选项如下所示：

- `browser_action` 所在的弹出框则是 `"default_popup"` 选项配置的（popup）。
- `鼠标移动到扩展程序时将提示的信息` 弹出框则是由：`"default_title"` 选项配置。
- 红色圆圈括起来的“礼物盒“就是 `"default_icon"` 选项配置的；

### popup

#### 概念

`popup` 是点击 `browser_action` 或者 `page_action` 图标时打开的一个小窗口网页，焦点离开网页就立即关闭，一般用来做一些临时性的交互，

对于 `browser_action` 和 `page_action` 来说，default_popup 选项无疑是非常重要的，它是配置 popup 的关键。

你可以在 <a href='#page_action 和 browser_action 有什么用？'>page_action 和 browser_action 有什么用？</a> 一节中找到有关于 popup 的描述。

在 `popup` 可以包含任意你想要的 HTML 内容，并且会自适应大小。这意味着你完全可以在 popup 中加载一些指定的脚本文件，来执行一些命令。

#### 如何设置 popup？

有两种方法：

1. `default_popup`字段来指定 popup（推荐）
2. 调用 `setPopup()` 方法。

#### popup 的权限

在权限上，它和 background 非常类似——几乎可以调用所有的  Chrome 扩展 API（除了 devtools），而且它可以无限制跨域；

它们之间最大的不同是生命周期的不同，popup中可以直接通过 `chrome.extension.getBackgroundPage()` 获取 background 的 window 对象。

## [EN-content_scripts](https://developer.chrome.com/docs/extensions/mv2/content_scripts/) | [CN](https://github.com/sxei/chrome-plugin-demo#content-scripts) 

### 配置选项格式

```js
{
	// 需要直接注入页面的JS
	"content_scripts": 
	[
		{
			// 指定注入的页面地址（必要）
			"matches": [
                "<all_urls>"?, // 表示匹配所有地址，配置了这个就没必须要配置其他的
                "http://www.whyhw.com/" // 指定注入的页面，注：最后面的 '/' 是必要的
			],
            
			// 多个 JS 按顺序注入（可选）
			"js": ["js/jquery-1.8.3.js", "js/content-script.js"],
            
            // 多个 CSS 按顺序注入（可选）
			"css": ["css/custom.css","css/xx.css"],
            
			// 代码注入的时间（可选）
			"run_at": "document_start"
		},
        
		// 这里仅仅是为了演示content-script可以配置多个规则
		{
			"matches": ["*://*/*.png", "*://*/*.jpg", "*://*/*.gif", "*://*/*.bmp"],
			"js": ["js/show-image-content-size.js"]
		}
	],
}
```



### What's the content_scripts?

contentScripts 是在网页上下文中运行的文件。通过使用标准的[文档对象模型](http://www.w3.org/TR/DOM-Level-2-HTML/)（DOM），contentScripts 能够读取浏览器访问的网页的详细信息，对其进行更改并将信息传递给其父扩展。

`manifest.json` 的 `content_scripts` 字段的作用是：把**脚本**和 **CSS** 注入到**指定**页面。

### contentScripts 的缺陷及解决方法

#### 缺陷

contentScripts 虽然运行在指定网页的上下文中，可以访问**指定页面**的 DOM，但是却无法访问**指定页面**的其他脚本文件；指定页面的 DOM 也无法主动调用 contentScripts 中的代码。

=> 比如：

```html
<!-- a.html，指定页面 -->
<body> <button onclick="func()">点我</button> </body>
<script>
    const func = () => cs() // 任意一个页面的 DOM 通过事件绑定主动调用 contentScripts 中的函数
</script>
<!-- contentScripts.js，content_scripts 配置的文件 -->
const cs = () => console.log('contentScripts')
```

- 当我们执行 a.html 并点击其中的按钮时，

  并**不会在控制台打印 contentScripts**，而是**会报错**，cs 函数未定义

这是由于 contentScripts 不会被真正注入到页面中（它不会存在于页面），导致无法在 DOM 中主动通过绑定事件的方式调用 `content-script` 中的代码，

包括直接写 `onclick`和`addEventListener` 2种方式都不行；但是，“在页面上（a.html）添加一个按钮并调用指定插件的扩展API”是一个很常见的需求，

> 比如：你想为一个指定域名的网站设置指定扩展，此时：你可以让网站”配合“你，从而为它定制出一个独特的 Chrome 扩展。

所以这就需要一个解决方法，详见：<a href='#contentScripts 缺陷的解决方法'>contentScripts 缺陷的解决方法</a>

#### contentScripts 缺陷的解决方法

解决方法的理论也很简单，即：**在 contentScripts 中，通过某种方式向指定页面注入一个 / 多个脚本文件（*或是其他的一些什么*）**，

这样你就可以在页面上主动的调用注入到页面的脚本或访问页面中的其他脚本，因为此时，你注入的脚本文件就属于指定页面了，而并非单纯的如同 contentScripts 中那样，是运行在网页的上下文中。

如：

```js
// contentScripts

// 向页面注入 inject.js
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var tempScript = document.createElement('script');
    tempScript.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    // 目的是：这种格式的的地址可以无限制跨域，详见：What's the background?
    tempScript.src = chrome.extension.getURL(jsPath);
    document.head.appendChild(tempScript); // 将指定 js 注入（添加）指定页面中
    // 当注入的脚本加载完毕后移除它
    tempScript.onload = function () {
	// 得到当前注入的脚本所在的父节点，并将它从父节点移除，因为放在页面不太好看。
        this.parentNode.removeChild(this);
    };
}
/** 
 * HTML被完全加载以及解析时，DOMContentLoaded 事件触发，而不必等待样式表，图片或者子框架完成加载。
 * 这时候，我们才将之注入到页面，否则会因为 HTML 未加载，脚本就注入完成，导致 DOM 获取失败。
 */
document.addEventListener('DOMContentLoaded', () => {injectCustomJs()}) 
```

```js
// inject.js
const cs = () => console.log('inject.js')
```

在做完往如上配置后，还必须在 `manifest.json` 中显示配置：

```json
{	
    // 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
    "web_accessible_resources": ["js/inject.js"], // 在这里配置你注入的任意脚本！
}
```

该字段表示：**想要在 web 中直接访问插件中的资源的话必须显示声明**，否则会报错。

当一切都搞定后，此时，当我们点击 `a.html` 中的按钮时，控制台将会打印 inject.js；这就表明我们已经成功解决指定页面的 DOM 无法调用扩展的脚本。

更多信息，参见：[inject-scripts](https://github.com/sxei/chrome-plugin-demo#injected-script) 

#### injectJS 不能访问 contentScripts?

虽然在 <a href='#contentScripts 缺陷的解决方法'>contentScripts 缺陷的解决方法</a> 一节中，我们解决了指定页面的 DOM 访问扩展的脚本以及 contentScripts 访问页面的其他脚本问题，

但是该解决方法存在一个问题，即：injectJS 无法访问 contentScripts，这是因为二者是不同的，injectJS 就相当于页面上的脚本，而 contentScripts 仍然是运行在网页的上下文中；

contentScripts 访问不了页面的其他脚本文件，也自然无法访问 injectJS，反过来也是一样的：injectJS 无法通过普通方式访问 contentScripts。

那么该怎么解决呢？

参见：[消息通信之 injectJS 和 contentScripts](https://github.com/sxei/chrome-plugin-demo#injected-script%E5%92%8Ccontent-script) 

详见：injecteJS 和 contentScripts 通信方法

### note

- **contentScripts 将先于指定页面加载**

  这意味着你需要首先在 contentScripts 中判断当前要注入 contentScripts 的 HTML 是否加载完毕，你才能获取到 DOM 元素（如：`document.head` 等）

## [EN-permissions](https://developer.chrome.com/docs/extensions/reference/permissions/) 

`manifest.json` 的 `permission` 字段用来请求当前扩展程序运行时所需要的权限。

即：当你使用 [Chrome API](https://developer.chrome.com/docs/extensions/reference/) 时，可能需要访问或使用一些资源，如：`storage`、`notifications` 等，但是若你未在 `permission`  字段去请求使用这些权限，那么你所使用的 `API` 是无法成功执行的。

```js
{
	"permissions": [
		"contextMenus",
		"tabs",
		"notifications",
		"webRequest",
		"webRequestBlocking",
		"storage",
		"http://*/*",
		"https://*/*",
        ...
	],
}
```

当你配置了权限后，你可以在 Chrome 的如下位置找到扩展程序所需要的权限说明：

1. 打开扩展程序界面（`chrome://extensions/`）
2. 点击右上角开发者模式
3. 点击任意的一个扩展程序的详细信息
4. 找到【权限】字段

在【权限】字段将显示所必需的权限：

![](./picture/permissions.png)

（permissions）

## [EN-homepage_url](https://developer.chrome.com/docs/extensions/mv2/manifest/homepage_url/) 

`manifest.json` 的 `homepage_url` 字段用来配置扩展程序的主页。

其位置在 Chrome 的：

1. 打开扩展程序界面（`chrome://extensions/`）
2. 点击右上角开发者模式
3. 点击任意的一个扩展程序的详细信息
4. 找到【打开扩展程序网站】字段

而这就是我们使用 `homepage_url` 字段配置的扩展程序主页在 Chrome 浏览器的位置。

TIP：若是没配置扩展程序主页，则无法找到【打开扩展程序网站】字段。

```js
{
	"homepage_url": "http://www.whyhw.com"
}
```

![](./picture/homepage-url.png)

（homepage-url）

## [EN-DevTools](https://developer.chrome.com/docs/extensions/mv3/devtools/) | [CN](https://github.com/sxei/chrome-plugin-demo#devtools%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7) 

### What's the devtools?

devtools 指的是打开开发者工具，所弹出来的每个面板，如：Element、Console、Network 等，每一个面板都是都是一个 devtools 页面。

而我们在 manifest.json 中使用 `devtools_page` 字段即可为 Chrome 自定义一个开发者工具当中的面板，诸如 Vue，React 这些框架的调试工具都是使用该字段来自定义的。

![](./picture/devtools_page_Vue.png)

(devtools_page_Vue.png)

除了可以添加一个/多个和 `Elements`、`Console`、`Sources `等同级别的面板之外，

Chrome 还允许扩展自定义侧边栏，目前只允许为 `Elements` 面板添加自定义的侧边栏。

### 语法

```json
{
  "devtools_page": "devtools.html" // 只能指向一个 HTML 文件，不能是JS文件
}
```

### 使用

1. 先为 `manifest.json` 添加 `devtools_page` 字段：

   ```json
   {"devtools_page": "html/devtools.html" // 只能指向一个 HTML 文件，不能是JS文件}
   ```

2. 添加 `devtools.html` 文件

   ```html
   <!DOCTYPE html>
   <html>
   <head></head>
   <body>
   	<script type="text/javascript" src="js/devtools.js"></script>
   </body>
   </html>
   ```

   聪明的你应该发现了，该文件中除了引入一个 JS 之外，其他都是默认生成，真正代码是 `devtools.js`,

   至于为什么 html 文件显得多余，emmm，可能是 Chrome 设计人员有其他考虑吧。

3. 向 `devtools.js` 添加一些代码，下面我给出最基本的创建面板的侧边栏的代码：

   ```js
   // 创建自定义面板，同一个插件可以创建多个自定义面板
   chrome.devtools.panels.create('MyPanel', 'img/icon.png', 'mypanel.html', panel => {
   	console.log('自定义面板创建成功！'); // 注意这个log一般看不到
   });
   // 创建自定义侧边栏
   chrome.devtools.panels.elements.createSidebarPane("Images", sidebar => {
   	// sidebar.setPage('../sidebar.html'); // 指定加载某个页面
       // 通过表达式来指定
   	sidebar.setExpression('document.querySelectorAll("img")', 'All Images'); 
   	//sidebar.setObject({aaa: 111, bbb: 'Hello World!'}); // 直接设置显示某个对象
   });
   ```

   以上代码的 API，参见：[chrome.devtools.panels](http://www.kkh86.com/it/chrome-extension-doc/extensions/devtools.panels.html) 

4. 此时，你任意打开一个页面，打开开发者工具（F12/ctrl+shift+i）都能看见如以下图示的面板和侧边栏：

   ![](./picture/devtools_page_MyPanel.png)

   （面板）

   ![](./picture/devtools_page_sidebar.png)

   （侧边栏）

### 调试技巧

修改了devtools 页面的代码时，需要先在 chrome://extensions 页面按下 `Ctrl+R` 重新加载插件，然后关闭再打开开发者工具即可，无需刷新页面（而且只刷新页面不刷新开发者工具的话是不会生效的）。

由于devtools本身就是开发者工具页面，所以几乎没有方法可以直接调试它，

直接用 `chrome-extension://extid/devtools.html"` 这种方式打开页面肯定报错，因为不支持相关特殊API，

只能先自己写一些方法屏蔽这些错误，调试通了再放开。

## [EN-message passing](https://developer.chrome.com/docs/extensions/mv2/messaging/) |  [CN](https://github.com/sxei/chrome-plugin-demo#%E6%B6%88%E6%81%AF%E9%80%9A%E4%BF%A1) 

### 互相通信概览

消息通信：popup.js、background.js、inject.js、contentScripts.js、devtools.js 之间的通信（访问）

注：`-` 表示不存在或者无意义，或者待验证。

|                 | content-script                              | injected-script                       | popup-js                                          | background-js                                     |
| --------------- | ------------------------------------------- | ------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| injected-script | window.postMessage                          | -                                     | -                                                 | -                                                 |
| content-script  | -                                           | window.postMessage                    | chrome.runtime.sendMessage chrome.runtime.connect | chrome.runtime.sendMessage chrome.runtime.connect |
| popup-js        | chrome.tabs.sendMessage chrome.tabs.connect | -                                     | -                                                 | chrome.extension.getBackgroundPage()              |
| background-js   | chrome.tabs.sendMessage chrome.tabs.connect | -                                     | chrome.extension.getViews                         | -                                                 |
| devtools-js     | -                                           | chrome.devtools. inspectedWindow.eval | chrome.runtime.sendMessage                        | chrome.runtime.sendMessage                        |

如何查看以上信息？如：

- popup 访问 background   通过 chrome.extension.getBackgroundPage()  
- background 访问 popup 通过 chrome.extension.getViews

即：**左边**（popup） **访问 顶部**（background） 通过 xxx（chrome.extension.getBackgroundPage()  ）

总结：

- `chrome.runtime.sendMessage` 和 `chrome.runtime.connect`

  **使得 [contentScripts 和 devtoolos] 向 [popup 和 background] 发送消息。** 

- `window.postMessage` 

  **使得 injectJS 和 contentScripts 互相发送消息。** 

- `chrome.tabs.sendMessage` 和 `chrome.tabs.connect` 

  **使得 [popup 和 background] 向 contentScripts 发送消息。 ** 

- `chrome.extension.getBackgroundPage()` 

  **使得 popup 能获取到 background 的 JS Window 对象。** 

### popup 和 background 相互通信方法

- popup 访问 background   通过 chrome.extension.getBackgroundPage()  返回正在运行的 background 的 JS Window 对象。如果扩展程序没有后台网页则返回 null。

- background 访问 popup 通过 chrome.extension.getViews() 返回一个数组，并通过该数组指定获取 popup 的JS Window 对象。

  TIP：获取时，必须保持 popup 处于激活状态。

#### popup 访问 background

- [chrome.extension.getBackgroundPage()](http://www.kkh86.com/it/chrome-extension-doc/extensions/extension.html#method-getBackgroundPage) 

  返回运行在当前扩展程序中的后台网页的 JavaScript window 对象。

  如果扩展程序没有后台网页则返回 null。

```js
// popup.js 或 popup.html 的 script 中
var bg = chrome.extension.getBackgroundPage();
console.log(bg.bgPopup()) // 将在 background 页面打印 background 中的 popup 方法
```

```js
// background.js（/ background.html)
function bgPopup() {return 'background 中的 popup 方法'}
```

NOTE：

- `const bgPopup = () => 'background 中的 popup 方法`   这样形式的函数方法，无法存在于 Window 对象中。

  即：bg.bgPopup() 将为 undefined

#### background 访问 popup

- [chrome.extension.getViews( { type:'tab' | 'inforbar' | 'notification' | 'popp'}? )](http://www.kkh86.com/it/chrome-extension-doc/extensions/extension.html#method-getViews) 

  返回一个数组，含有每一个在当前扩展程序中运行的页面的 JavaScript window 对象。

  参数：一个对象，表示指定要获取的视图类型。

  如果省略，则返回所有视图（包括后台页面和标签页）。

  有效值为："tab"（标签页）、"infobar"（信息栏）、"notification"（通知）、"popup"（弹出窗口）。

```js
// background.js
var views = chrome.extension.getViews({ type: 'popup' });
// popup 处于激活状态才执行，因为我们已经指定获取 popup Window，若它未激活，则 length = 0
if (views.length > 0) {
    console.log(views[0]); // popup 的 Window 对象
    console.log(views[0].p()); // 将输出：background 将调用本方法
}
```

```js
//  popup.js
function bgPopup() {return 'background 将调用本方法'}
```

Note：

- 当 background 访问 popup 时，popup 必须处于激活状态，否则将获取不到 popup 的 Window 对象

### [injecteJS 和 contentScripts 通信方法](https://github.com/sxei/chrome-plugin-demo#injected-script%E5%92%8Ccontent-script) 

#### 介绍

contentScripts 和页面内的脚本（inject JS 也属于页面内的脚本）通信存在两种方法：

1. 通过 `window.postMessage` 和 `window.addEventListener` 来实现二者消息通讯
2. 通过自定义 DOM 事件实现

TIP：它们二者之间唯一共享的东西就是页面的DOM元素。

#### [`postMessage`](https://developer.chrome.com/docs/extensions/reference/runtime/#type-Port-postMessage) 和 `addEventListener('message',handle)` 实现

1. ```js
   // 如果 message 为 object，则建议是 JSON 格式。
   postMessage(message: any) => {...}
   ```

```js
// inject.js
window.postMessage({"test": "你好"}, '*'); // window 是可选的。
postMessage('Yomau');
// 以上做法，会发送两个信息
```

```js
// contentScripts.js
[window.]addEventListener('message',(e)=>{ // window 是可选的
	console.log(e); // MessageEvent {...}
    console.log(e.data); // 从 inject.js 中发送的数据
}})
/** 输出两个信息（省略输出 (e) ）：
 * {"test": "你好"}
 * Yomau
 */
```

以下为监听到的 message 事件的对象。

![](./picture/postMessageANDaddEventListener.png)

（postMessageANDaddEventListener）

#### 通过自定义 DOM 事件实现

```js
// inject.js
// 创建一个自定义事件 myCustomEvent，并将事件对象（实例）赋值给 customEvent，可冒泡但是不可取消
var customEvent = 
    new Event("hiddenDiv", { "bubbles": true, "cancelable": false });
(function fireCustomEvent(data) {
    hiddenDiv = document.getElementById('myCustomEventDiv');
    hiddenDiv.innerText = data;
    // 当单击页面上的某个按钮时，才会触发自定义事件（开始通信）
    hiddenDiv.querySelector('.btn').addEventListener('click', () => {
        // 向指定的事件目标派发一个事件，注意：派发的事件要为该事件的事件对象
        div.dispatchEvent(customEvent); // 使得 div 元素触发事件 myCustomEvent 
    })
  
})('你好，我是普通JS！')
```

```js
// contentScripts.js
document.addEventListener('DOMContentLoaded', () => {
	var hiddenDiv = document.getElementById('myCustomEventDiv');
	if (!hiddenDiv) { // 若页面中不存在元素则先创建一个。
		hiddenDiv = document.createElement('div');
		hiddenDiv.setAttribute('id', 'myCustomEventDiv')
        hiddenDiv.style.display = 'none';
        document.body.appendChild(hiddenDiv);
    }
    // 监听元素的 myCustomEvent 事件并添加事件监听器。
    hiddenDiv.addEventListener('myCustomEvent', function () {
        var eventData = document.getElementById('myCustomEventDiv').innerText;
        console.log('收到自定义事件消息：' + eventData);
    });
    injectCustomJs(); // 将 inject.js 注入到页面的方法。
})
```

**准备通信流程：**

1. 创建一个自定义事件（inject.js）

2. 使得某个元素 （hiddenDiv）[达到某个条件时]（可选）触发自定义事件（inject.js）

   *这里的某个条件是：点击页面上的某个按钮时。*

3. 监听自定义事件，并为之添加处理器。（contentScripts.js）

**开始通信流程：**

1. 点击页面上的某个按钮，触发它的单击事件（inject.js）
2. 使得 hiddenDiv 触发自定义事件 myCustomEvent（inject.js）
3. myCustomEvent 的事件处理器执行（contentScripts.js）

### popup 或 background 向 contentScripts 发送消息-短链接

#### 大致流程

1. 在 popup 中使用 [`chrome.tabs.query`](http://www.kkh86.com/it/chrome-extension-doc/extensions/tabs.html#method-query) 判断当前标签页是否活动且是否存于当前窗口

2. 若判断成功，则调用 [chrome.tabs.sendMessage(integer tabId, any message, function responseCallback)](http://www.kkh86.com/it/chrome-extension-doc/extensions/tabs.html#method-sendMessage) 
   向指定的 contentScripts（以 ID 作为标识） 发送信息；

   并在指定的 contentScripts 响应后执行对应的回调函数 => 接收的第一个参数为：contentScripts 响应的数据。

3. 在 contentScripts  中使用 [chrome.runtime.onMessage.addListener(callback)](http://www.kkh86.com/it/chrome-extension-doc/extensions/runtime.html#event-onMessage) 监听 'message' 事件。

   即：当 popup 向 contentScripts 发送消息时，将触发 'message' 事件，这就会导致 contentScripts 的事件处理器执行

   注：callback 的第二个参数必须要能序列化成 JSON 格式。

4. 并在事件处理器中通过 [sendResponse(任意可以序列化成 JSON 的对象)](http://www.kkh86.com/it/chrome-extension-doc/extensions/runtime.html#property-onMessage-sendResponse)  响应信息给 popup.

#### 示例代码

```js
// popup.js
function sendMessageToContentScript(message, callback) {
    // 当 popup 激活（用户点击了扩展程序小图标）于 Chrome 当前窗口中的活动标签页中，就执行对应的回调函数。
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(`popup 将向 ID=${tabs[0].id} 的标签发送消息：{ 
					cmd:'${message.cmd}',value:'${message.value}'}`)
        // 向 tabs[0].id 标签（相当于当前标签）中的 contentScripts 发送 message 信息，
        // 当 id 为 tabs[0].id 的 contentScritps 响应时就执行 callback（用来接收响应）
        // response：响应返回的数据
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}
console.log('popup 准备向 contentScripts 发送消息。')
sendMessageToContentScript({ cmd: 'test', value: '你好，我是popup！' }, (response) => {
    console.log('收到来自 content 的响应：' + response);
});
```

```js
// contentScripts

// 监听 'message' 事件；当消息从扩展程序或者内容脚本中发送时，就执行对应的事件处理器。
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(`contentScripts 成功接收到消息：{ cmd:'${message.cmd}',value:'${message.value}'}`)
    
    // 当 popup 发送信息过来到 contentScripts 时，这里返回一个响应内容给 popup
    // 数据将由 sendMessage() 的第三个参数：callback function 的第一参数接收。
    sendResponse('contentScripts 已成功接收，现重新响应给发送者（popup）');
});
```

双方通信直接发送的都是JSON对象，不是JSON字符串，所以无需解析，很方便（当然也可以直接发送字符串）。

**NOTE：**

1. [sendResponse()](http://www.kkh86.com/it/chrome-extension-doc/extensions/runtime.html#property-onMessage-sendResponse)：当您产生响应时调用（最多一次）的函数，且参数必须是可转化为 JSON 的对象。

   若您在同一个文档中有一个以上的 onMessage 事件处理函数，只有其中一个可以发送响应。

   且当事件处理函数返回时，该函数将失效，除非您在事件处理函数中返回 true，

   表示您希望通过异步方式发送响应（这样，与另一端之间的消息通道将会保持打开状态，直到调用了 sendResponse）。

2. [sendMessage(integer tabId, any message, function responseCallback)](http://www.kkh86.com/it/chrome-extension-doc/extensions/tabs.html#method-sendMessage)：

   1. integer tabId：contentScripts 的 id
   2. any message：任何类型的消息数据
   3. function responseCallback：当 contentScripts 响应后，就执行的回调函数，其第一参数接收响应过来的数据

3. 使用 sendMessage() 发送消息时，当前扩展程序在指定标签页中的**每一个内容脚本都会收到** runtime.onMessage 事件

4. 网上有些老代码中用的是 `chrome.extension.onMessage`，没有完全查清二者的区别（貌似是别名），但是建议统一使用 `chrome.runtime.onMessage`。

#### 示例图片

1. **首先在任意一个网页标签（存在 url）激活扩展程序（点击扩展程序的图标）**

   ![](./picture/popup-to-contentscripts-activepopup.png)

   （popup-to-contentscripts-activepopup）

2. **右键弹出的界面，点击检查，调出 popup 的控制台。**

   ![](./picture/popup-to-contentscripts-popuprightkey.png)

   （popup-to-contentscripts-popuprightkey）

3. 此时你能在**控制台中**，**看到**你在 popup.js 中的输出内容（console.log()），

   并执行 chrome.tab.xx 时输出的内容

   ![](./picture/popup-to-contentscripts-popupconsole.png)

   （popup-to-contentscripts-popupconsole）

4. 打开你**激活扩展程序时，所处的网页（标签）的控制台（F12），**

   在 Console 中你就**可以看到**你在 contentScripts **已经成功接收**到消息，并且可以输出它。

   同时我们也会**使得 contentScripts 向 popup 发送响应。**

   ![](./picture/popup-to-contentscripts-contentscripts-receivemessage.png)

   （popup-to-contentscripts-contentscripts-receivemessage.png）

5. 当 **contentScripts 接收并发送响应**（必要的，虽然没有发送响应不会运行扩展基本运行）**后，**

   popup 中的 sendMessage 的第三个参数 **callback 将会执行并且第一个参数接收来自 contentScripts 的响应。**

   ![](./picture/popup-to-contentscripts-popup-receiveresponse.png)

   （popup-to-contentscripts-popup-receiveresponse）

### [content-script 发送消息给 background 或 popup-短链接](https://github.com/sxei/chrome-plugin-demo/blob/master/README.md#content-script%E4%B8%BB%E5%8A%A8%E5%8F%91%E6%B6%88%E6%81%AF%E7%BB%99%E5%90%8E%E5%8F%B0) 

和 <a href='#popup 或 background 向 contentScripts 发送消息-短链接'>[popup 或 background] 向 contentScripts 发送消息-短链接</a> 这节有点类似，

不过本节将使用 [`chrome.runtime.sendMessage`](http://www.kkh86.com/it/chrome-extension-doc/extensions/runtime.html#method-sendMessage) 发送消息和 [`chrome.runtime.onMessage.addListener`](http://www.kkh86.com/it/chrome-extension-doc/extensions/runtime.html#event-onMessage) 接收消息

TIP：这里是 **chrome.runtime** API，而非 **chrome.tabs** API

#### 大致流程

1. contentScripts 通过 [`chrome.runtime.sendMessage`](http://www.kkh86.com/it/chrome-extension-doc/extensions/runtime.html#method-sendMessage) 发送消息到 background 或 popup

2. 在 background 或 popup 中通过 [`chrome.runtime.onMessage.addListener`](http://www.kkh86.com/it/chrome-extension-doc/extensions/runtime.html#event-onMessage) 监听 'message' 事件，

   并接收消息和响应消息。

#### 示例代码

```js
// contentScripts.js
console.log('即将发送消息给 background 或 popup')
chrome.runtime.sendMessage('你好，background or popup！我是 contentScripts.', (response) => {
	console.log('收到来自 background or popup 的回复：' + response);
});
```

```js
// background.js 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`收到来自 contentScripts 的消息：${request}`);
    sendResponse('你好，contentScripts！我是 background.')
});

// popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`收到来自 contentScripts 的消息:${request}`);
    sendResponse('你好，contentScripts！我是 popup.')
});
```

#### 示例图片

1. **发送消息到  background 和 popup**

   ![](./picture/contentscripts-to-background-willsendmessage.png)

   （contentscripts-to-backgroundorpopup-willsendmessage.png）

2. **background 成功接收消息**

   ![](./picture/contentscripts-to-background-backgroundreceive.png)

   **popup 成功接收消息**

   ![](./picture/contentscripts-to-popup-popupreceive.png)

3. **contentScritps 成功接收到 background 的回复。**

   ![](./picture/contentscripts-to-backgroundandpopup-contentscriptsreceivebackground.png)

   **contentScritps 成功接收到 popup 的回复。**  

   ![](./picture/contentscripts-to-popup-contentscriptsreceivepopup.png)

### [长连接和短链接的互相通信](https://github.com/sxei/chrome-plugin-demo/blob/master/README.md#%E9%95%BF%E8%BF%9E%E6%8E%A5%E5%92%8C%E7%9F%AD%E8%BF%9E%E6%8E%A5)

其实上面已经涉及到了，这里再单独说明一下。Chrome插件中有2种通信方式，一个是短连接（`chrome.tabs.sendMessage`和`chrome.runtime.sendMessage`），一个是长连接（`chrome.tabs.connect`和`chrome.runtime.connect`）。

短连接的话就是挤牙膏一样，我发送一下，你收到了再回复一下，如果对方不回复，你只能重新发，而长连接类似`WebSocket`会一直建立连接，双方可以随时互发消息。

短连接上面已经有代码示例了，这里只讲一下长连接。

popup.js：

```js
getCurrentTabId((tabId) => {
	var port = chrome.tabs.connect(tabId, {name: 'test-connect'});
	port.postMessage({question: '你是谁啊？'});
	port.onMessage.addListener(function(msg) {
		alert('收到消息：'+msg.answer);
		if(msg.answer && msg.answer.startsWith('我是'))
		{
			port.postMessage({question: '哦，原来是你啊！'});
		}
	});
});
```

content-script.js：

```js
// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
	if(port.name == 'test-connect') {
		port.onMessage.addListener(function(msg) {
			console.log('收到长连接消息：', msg);
			if(msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
		});
	}
});
```

TIP:两个长连接，它们的监听器都为：chrome.runtime.onConnect()，[tabs.connect](https://crxdoc-zh.appspot.com/extensions/tabs#method-connect) 和 [runtime.connect](http://www.kkh86.com/it/chrome-extension-doc/extensions/runtime.html#method-connect) 它们都是靠 runtime.onConnect() 监听，区别是它们可以访问的地方不同。

# 示例代码

## [创建右键菜单](http://www.kkh86.com/it/chrome-extension-doc/extensions/contextMenus.html)

```js
// background 中才能创建右键菜单

// 扩展第一次安装时才创建右键菜单，否则会重复创建 id 相同的右键菜单
chrome.runtime.onInstalled.addListener(() => { 
  chrome.contextMenus.create({
    id: "click",
    title: '点击我',
  });
});

// 右击弹出菜单-点击所创建的选项时（这里是“点击我”），扩展程序将触发该事件监听器
chrome.contextMenus.onClicked.addListener(function (data, tabs) {
	// 执行代码
});

```

# 调试方法

下面介绍如何对 injectJS、contentScripts、popup、background 以及 devtools 进行调试。

| JS类型          | 调试方式                 | 图片说明                                                     |
| --------------- | ------------------------ | ------------------------------------------------------------ |
| injected script | 直接普通的F12即可        | 懒得截图                                                     |
| content-script  | 打开Console,如图切换     | [![img](https://camo.githubusercontent.com/e25af0a2756d9351fcfdbce2f91cd267f967e6f804f83a08df0c355b51853021/687474703a2f2f696d6167652e6c69757869616e616e2e636f6d2f3230313631322f32303136313232305f3130353532365f3632395f383533332e706e67)](https://camo.githubusercontent.com/e25af0a2756d9351fcfdbce2f91cd267f967e6f804f83a08df0c355b51853021/687474703a2f2f696d6167652e6c69757869616e616e2e636f6d2f3230313631322f32303136313232305f3130353532365f3632395f383533332e706e67) |
| popup-js        | popup页面右键审查元素    | [![img](https://camo.githubusercontent.com/74c839c32d2cd12acda85579f58f517276a075f55679fb60071edfdc791f0e8f/687474703a2f2f696d6167652e6c69757869616e616e2e636f6d2f3230313631322f32303136313232305f3130353731365f3137385f363930302e706e67)](https://camo.githubusercontent.com/74c839c32d2cd12acda85579f58f517276a075f55679fb60071edfdc791f0e8f/687474703a2f2f696d6167652e6c69757869616e616e2e636f6d2f3230313631322f32303136313232305f3130353731365f3137385f363930302e706e67) |
| background      | 插件管理页点击背景页即可 | [![img](https://camo.githubusercontent.com/f41a7940a92a9e6ba7d07573ff243acdb3c1a6c8148006bbd88ea5c94040de80/687474703a2f2f696d6167652e6c69757869616e616e2e636f6d2f3230313631322f32303136313232305f3130353831315f3932325f353632312e706e67)](https://camo.githubusercontent.com/f41a7940a92a9e6ba7d07573ff243acdb3c1a6c8148006bbd88ea5c94040de80/687474703a2f2f696d6167652e6c69757869616e616e2e636f6d2f3230313631322f32303136313232305f3130353831315f3932325f353632312e706e67) |
| devtools-js     | 暂未找到有效方法         | -                                                            |

# 注意点

- 在 background 中请不要使用 `const popup = () => {}` 这样形式声明的方法，它可能不会被识别，请使用 `function popup() {}`，至于为什么？作者并不知道，这只是亲身实践。

# Reference

## Doc

- [Chrome 官方入门文档](https://developer.chrome.com/docs/extensions/mv2/getstarted/)
- [sxei-Chrome 扩展入门文档-Github](https://github.com/sxei/chrome-plugin-demo)

## API

- [Chrome 官方 API 参考](https://developer.chrome.com/docs/extensions/reference/)
- [非官方中文版 API 参考](http://www.kkh86.com/it/chrome-extension-doc/extensions/api_index.html)
