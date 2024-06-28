# 名词注解

- repo -> repository

# 什么是 Monorepo？

Monorepo 是一种用来管理项目代码（不仅是前端）的方案，它的本质是：**将所有代码（每个项目）放到一个仓库。**

让笔者来解释一下这句话的意思：现在你有6个或更多的项目，通常人们会为每个项目创建一个仓库，每个仓库只有一个项目，但是若使用 Monorepo 管理，你就必须得将每个项目都放入一个仓库中，该仓库将包含所有项目。

听起来让你很诧异，这不是会很乱吗？不是的，这并不代表每个项目的代码都是杂乱无章的放在 `src/` 中，相反使用 monorepo 的公司可能通过  Buck / Bazel 等将代码划分到一个个小的模块中或是其他方式。

Tips：在 React 中，每个项目都是	 src/package/ 的一个包，每个包都是一个完整的项目，[看这](https://zh-hans.reactjs.org/docs/codebase-overview.html#multiple-packages)。

# 什么时候用 monorepo

你有一个项目，比如：`react`，但是此项目需要的东西很多，于是你将一些功能拆分成包方便维护：`react-dom`, `react-client ` 等，

`react` 需要依赖于这些包，而这些包又可能相互依赖；

对于这种相互依赖、有关系的包，就可以使用 monorepo 这种方式来管理。

# 利与弊

## [利](https://danluu.com/monorepo/) 

<u>简化工作流</u>：所有项目和依赖的其他项目都在一个仓库中，利于浏览。

<u>更容易的更改</u>：一个 API 的更新只需要一次 commit 即可，若多个项目放入多个仓库，它们相互依赖，某个仓库的项目中的某个 API 被更改后，其他项目可能需要做对应的改变，而这就可能会需要换一个工作空间去修改，随着项目的增加，更换工作空间也会增加，这可能让你疲于在切换工作空间中。

> 在传统的多项目多代码仓库的公司，每个代码仓库都有自己的发布规则，比如每周发布一个新的版本，再让依赖它们的其他项目在新版本发布后慢慢升级。似乎一顿操作猛如虎地忙，但是搞了一个半月，只是把一个函数加了个参数罢了。在 monorepo 中，这种假工作是不存在的。因为所有人用的都是公司里别人最新的库，完全不存在版本升级的问题。需要修改函数参数的话，只需要一个新的 commit 就能解决了。

<u>简单的重构代码</u>：由于是一个仓库管理所有项目，这就使得共享代码更加容易。重构某个项目的代码几乎不需要考虑它的更改是否会造成其他依赖它的项目无法运行之类的，因为这很容易更新 -> 依赖共享，如果两个项目有相同的依赖，但是该依赖的版本有较大冲突也无需担心，[yarn](https://classic.yarnpkg.com/en/docs/workspaces/) 和 [lerna](https://github.com/lerna/lerna/blob/main/README.md#about) 都可以解决它！

<u>新人上手快</u>：在非 monorepo 管理的公司中，若一个新员工进来可能需要一个星期-大半个月去熟悉公司的项目，才能真正开始干活，这其中最浪费时间的通常是：有很多的部落知识（Tribe Knowledge）并没有写下来，需要手把手地教

其中一项，就是怎么把项目的所有依赖从网上拉下来，配置好开发环境，可以干活。之后，还要教为什么提交的修改不应该包含一些配置修改之类的，或者为什么要用祖传数年前的依赖版本。而这些如果用 monorepo 的话都不是问题 => 所有项目一目了然，升级依赖也很快（因为依赖共享）。

<u>依赖共享</u>： 共同依赖可以提取至 root，版本控制更加容易，依赖管理会变的方便。

## 弊

<u>依赖膨胀（爆炸）</u>：项目如果变的很庞大，那么 git clone、安装依赖、构建都会是一件耗时的事情（React 的 node_moudles + 项目本身大约有 2G）。

<u>安装依赖的依赖导致的错误</u>：<a href='#yarn 如何管理 monorepo 方案的'>yarn 如何管理 monorepo 方案的？</a> 

<u>代码易泄漏</u>：由于所有项目都在一个仓库，那么如果一个人具有该仓库权限，意味着每个项目TA都可以看见。简单的解决方法是：分配权限。（但是只要开发者需要编写代码，你就无法阻止代码泄漏，因为TA必须看代码）

# Reference

- [What monorepo?-官网](https://www.perforce.com/blog/vcs/what-monorepo) 
- [Monorepo 好处](https://danluu.com/monorepo/) 
- [Monorepo-知乎](https://zhuanlan.zhihu.com/p/77577415) 
- [Monorepo VS Multiple repo](https://translate.google.com/translate?hl=en&sl=zh-CN&tl=en&u=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000039814987&anno=2&prev=search)  
- [What lerna](https://github.com/lerna/lerna/blob/main/README.md#about) 


