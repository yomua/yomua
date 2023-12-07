[TOC]



# 定义

其具体相关请看＜JS帮助文档＞

ES5严格模式是采用具有限制性JavaScript变体的一种方式，从而使代码显示的脱离"马虎模式/稀松模式/懒散模式",即sloppy模式.

严格模式其产生是为了形成与正常代码不同的语义,而不仅仅是一个ES的子集.

- 这里说的是ES,而不是JS，`'use strict';`是ES自己实现了一种功能,而不是JS实现的,但是JS可以用也就是了,因为JS实现了ES嘛.



## 其文档说明

 严格模式对正常的JavaScript语义做出了一些修改

1. 严格模式通过抛出错误来消除一些原有的静默错误

2. 严格模式修复了一些导致JavaScript引擎难以执行优化的缺陷:

   ​	有时候,相同的代码,严格模式下可以比非严格模式下运行的更快.

3. 严格模式禁用了在ES的未来版本中可能会定义的一些语法.

## 其直白解释

1. `'use strict';`定义的JavaScript代码应该以"严格模式"执行.
2.  严格模式以规范的行为去解释JS代码,而不是为了更好的让"小白"理解它从而让JS在执行时用一些[静默]方式去编译,然后不报错.

# 支持性

## 描述

在不支持严格模式和支持严格模式的浏览器中,它们若都在执行严格模式下的代码时,会采用不同的行为.

所以所以在没有对运行环境展开**特性测试**来验证对于严格模式相关方面支持的情况下，就算采用了严格模式也不一定会取得预期效果。

严格模式代码和非严格模式代码可以共存! 所以一个非严格模式代码的项目可以渐进的改变称为严格模式下的代码.

但是不要盲目依赖严格模式,因为2020/1/14,在现在的市场上仍然只有部分浏览器支持严格模式甚至很多浏览器都不支持(比如IE10之前的版本).

## 为什么Browser支持的少

严格模式改变了语义。

依赖这些改变可能会导致没有实现严格模式的浏览器中出现问题或者错误。谨慎地使用严格模式，通过检测相关代码的功能保证严格模式不出问题。

最后，记得在支持或者不支持严格模式的浏览器中测试你的代码。

如果你只在不支持严格模式的浏览器中测试，那么在支持的浏览器中就很有可能出问题，反之亦然。

## 如何过渡非严格→严格

请注意,严格模式是被仔细设计过的,这很重要,因为非严格模式代码可以逐渐的向严格模式代码进行转换.

你可以分别改变各个文件,甚至以函数级粒度进行严格模式的迁移工作!



# 如何使用



## 描述

严格模式由于被详细设计过,且能进行函数粒度的迁移工作,所以严格模式理当可以应用到整个脚本或者个别函数中,显然的,ES也是这么做的．

若你在封闭 `{}`大括号中使用 `'use strict;'`那么这样若此若做,严格模式并不会辐射到其封闭的 `{}`以外的地方.

## 为脚本开启严格模式

```js
'use strict';
....
```

- ​    将 `'use strict';` 写到脚本的最开头(如同定义全局变量那样),其作用域会辐射到整个脚本,即拥有全局作用域.

  ​	这样会使整个脚本都变成严格模式代码.

- ​    请注意,这样做(这种语法)存在陷阱. 

  ​    即用一个严格模式下的脚本合并一个非严格模式下的脚本(或用一个非严格模式合并严格模式) 会可能产生问题,

  ​	例如语义错误/本来没有错甚至严格模式下运行也是对的代码合并就产生错误,诸如此类的问题.

  ​	所以若要消除合并的问题,可以使用更小的粒度进行书写 `'use strict';` ,并不一定要写在脚本最开头.

## 为函数开启严格模式

```js
function strict() {
    'use strict';
    function nested() {
        return 'And so am I';
    }
    return 'Hi,I am  a strict mode function' + nested();
}

function noStrict() {
    return "I'am not a strict mode function";
}

	console.log(strict());
	console.log(noStrict());

/* 
    Hi!  I'm a strict mode function!  And so am I!
    use strict.html:29 I'm not strict.
*/
```

- 显然的,为函数开启严格模式,也只需要在主函数的最开头使 `'use strict';` 辐射到整个函数的作用域即可.

# 严格模式下的变化

## 七种变化

1. 严格模式下无法再创建意外的全局变量

   ```js
   'use strict';
   anyVariable = 12;
   /*
   	假如有一个变量名为anyVar的,anyVarialble的,则若像以上这么写,会意外的创建一个全局变量,还不会报错.
   	但是在严格模式下,会直接报错
   		Reference Error
   */
   ```

2. 严格模式下会使引起静默失败的赋值操作抛出异常

   ​	静默操作: 即silently fail,不报错也没有任何效果的代码.

   ```js
   'use strict';
   NaN = 12;
   /*
   	Uncaught TypeError: 
   	Cannot assign to read only property 'NaN' of object
   */
   ```

   - 在严格模式下,它会报错,即不能指定对象的只读属性NaN

   - 在正常模式下,给NaN赋值完全没问题,因为这没有任何效果,开发者也得不到任何的反馈.

   - NOTICE: 任何正常模式下引起的静默失败的赋值操作,皆会在严格模式下报错,即抛出异常,这其实也代表可以使用try..catch..finally语句处理.

     其中有: 

     - 给不可写属性赋值,
     - 给只读属性(getter-only)赋值赋值
     -  给不可扩展对象([non-extensible](https://developer.mozilla.org/zh-CN/JavaScript/Reference/Global_Objects/Object/preventExtensions) object)的新属性赋值

3. 严格模式下, 试图删除不可删除的属性时会抛出异常

   ​	在正常模式时这种操作不会产生任何效果.

   ```js
   "use strict";
   delete Object.prototype; 
   /* 
   	抛出TypeError错误
   	正常模式不会有任何报错行为
   */
   ```

4. ​    在Gecko版本34之前，严格模式要求一个对象内的所有属性名在对象内必须唯一

   ​    正常模式下重名属性是允许的，最后一个重名的属性决定其属性值。

   ​	因为只有最后一个属性起作用，当代码要去改变属性值而不是修改最后一个重名属性的时候，复制这个对象就产生一连串的bug。

   ​	在严格模式下，重名属性被认为是语法错误：

   ```js
   "use strict";
   var o = { p: 1, p: 2 }; 
   /*
   	语法错误
   	但是这个问题已经在ES5得到修复,不复存在了.
   */
   ```

5. ​     严格模式要求函数的参数名唯一

   ​	在正常模式下, 最后一个重名参数名会掩盖之前的重名参数. 之前的参数仍然可以通过 `arguments[i] 来访问`, 还不是完全无法访问. 

   ​	然而, 这种隐藏毫无意义而且可能是意料之外的 (比如它可能本来是打错了), 所以在严格模式下重名参数被认为是语法错误

   **function** **sum**(a, a, c) { *// !!! 语法错误*  **"use strict"**;  **return** a + a + c; *// 代码运行到这里会出错* }

   ```js
   function sum(a, a, c) { // !!! 语法错误
     "use strict";
     return a + a + c; // 代码运行到这里会出错
   }
   ```

6. ​    严格模式禁止八进制数字语法

   ​	 ECMAScript并不包含八进制语法, 但所有的浏览器都支持这种以零(`0`)开头的八进制语法: `0644 === 420` 还有 `"\045" === "%"`.

   ​	在ECMAScript 6中支持为一个数字加"`0`o"的前缀来表示八进制数.

   ​	

   ```js
   let a = 0o10; // ES6中的八进制表示
   ```

   ​	有些新手开发者认为数字的前导零没有语法意义, 所以他们会用作对齐措施.

   ​	但其实这会改变数字的意义! 八进制语法很少有用并且可能会错误使用, 所以严格模式下八进制语法会引起语法错误

   ```js
   "use strict";
   var sum = 015 + // !!! 语法错误 八进制
             197 +
             142;
   ```

7. ​    ECMAScript 6中的严格模式禁止设置[primitive](https://developer.mozilla.org/zh-CN/docs/Glossary/primitive)值的属性.

   ​	不采用严格模式,即使用正常模式,设置属性将会简单忽略(no-op),采用严格模式,将抛出[TypeError]错误

   ```js
   (function() {
     "use strict";
   
     false.true = "";              //TypeError
     (14).sailing = "home";        //TypeError
     "with".you = "far away";      //TypeError
   })();
   ```

## 简化变量的使用

1. 严格模式下,禁止使用with.

2.  [`严格模式下的 eval 不再为上层范围(surrounding scope,注:包围eval代码块的范围)引入新变量`](http://whereswalden.com/2011/01/10/new-es5-strict-mode-support-new-vars-created-by-strict-mode-eval-code-are-local-to-that-code-only/)

3. 严格模式下,进制删除声明变量.

   ```js
   let x;
   delete x;
   /*
   	语法错误
   */	
   ```

## 让eval和arguments变得更简单

1. 严格模式下,名称eval和arguments不能通过程序语法被绑定或者赋值
2. 严格模式下,参数的值不会随arguments对象的值改变而变化
3. 不再支持arguments.callee

## 安全的JavaScript

1. 严格模式下,通过this传递给一个函数的值不会被强制转为一个对象.
2. 严格模式下,再也不能通过广泛实现的ES扩展'游走于'JavaScript的栈中.
3. 严格模式下的arguments不会再提供访与调用这个函数相关的变量的途径.

## 为未来的ES版本铺平道路

1. 严格模式种,一部份字符变成了保留的关键字
2. [严格模式禁止了不在脚本或者函数层面上的函数声明](http://whereswalden.com/2011/01/24/new-es5-strict-mode-requirement-function-statements-not-at-top-level-of-a-program-or-function-are-prohibited/)
3. 