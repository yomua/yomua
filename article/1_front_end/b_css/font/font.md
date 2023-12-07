[TOC]



# 自定义字体

## @font-face

*详情请看<CSS权威指南P160>*

自定义字体.

由开发者定义一个字体,当用户浏览网页时,若需要使用到该字体,就如同该字体存在于服务器中一样.

惰性加载,即使用到此字体,用户代理才会下载,否则不会.

### 必选的两个属性

- font-family: "Open Sans";

- src: url("相对/绝对") format("woff2")format('xxxxx'),
      url("相对/绝对") format("woff");

以及各种可选属性.



# font-XXX属性



## font-size



### 描述

font-size表示一个em方框的大小(字符串实体也可以用这个表示大小,例如&gt表示<小于号).

通过设置font-szie属性值的大小,那么em方框也会跟着改变.所以font-szie最大的作用就很显然是为em方框提供一个尺寸,而em方框尺寸的大小影响着存于em方框里面的每个字符.

所以使用font-size属性就是设置em方框尺寸.但是正因为如此,显示出来的每个字符串不可能刚好是font-size指定的大小

​	*这是因为字体本身中就存在超过em方框/没超过em方框的字符,当然不可能是完全指定的大小了*

### 可使用的属性值

- font-size可以使用任何长度单位作为值.

  p.one{font-size:36pt};

  p.two{font-size:3pc};

   以上两个都是等效的,即所得到的计算值一样,但是实际显示情况据浏览器而定.

- font-size可以使用大小单位作为之(数字不用超过范围)

## font-style

*详情请看<CSS权威指南P192>*

字形.

取值为: italic|oblique|normal.

它可以存在于@font-face中

## font-stretch

*详情请看<CSS权威指南P195>*

字体拉伸.

若一个字体族中存在窄体(瘦体)胖体,才可以使用此属性.否则无法使用.它可以存在于@font-face中

## font-kerning

*详情请看<CSS权威指南P198>*

kern:字符间距

其意思为调整字体的字距,也就是调整字符与字符之间距离.

只有字体族定义了字符间距设置此属性才有用,否则无效.

## font-variant

*详情请看<CSS权威指南P198>*

字体变形.有对应的@font-face描述符.

字面意思,可以改变让字体变换形态,该属性的变形信息内嵌在字型中:包括旧时的各种连写,小号大写字母,小鼠的表示方式等.

如果某个字体族的字型中有这样的信息,那么就可以使用此属性来调用,改变字体的形态,即变形.

例如:`font-variant: small-caps;`

​	意为:使用小号大写字母,即比大小字母的字号稍小.不属于小写/大写字母,这是一个独立的类别.

​	对于 `font-variant: small-caps;` 来说,若一个字体族不存在小号大写字母,规范会给出两种解决方案,

​      1:用户代理自行缩小大小字母,创建小号大写字母.

​      2:把所有字母都变成大小,而且大小相同,其操作如同`: text-transform: uppercase;`属性.

​      **而且请注意对小写的字母才有用:将把小写字幕转换成小号大写字母,对于大写字母无效.**

## font-feature-settings

*详情请看<CSS权威指南P202>*

字体特性设置.

和for-variant类似,此属性从底层控制OpenType字体的哪些特性可以使用,所以不能用在.woff文件上.

其作用为:指定哪些字体特性是可以被使用的/被禁止的.

它的值可以是openType规范中的1/多个特性(以逗号分隔),且值的格式为:	

​	**<string> [<integer> | on | off ]**,请看以下示例.

- ` font-feature-settings: "akhn" on,"smcp" 1;`
- <integer>: 通常以0代表off,以1代表on(当然反过来也行),或也有其他数字形式表示,全看当前特性的支持.
- 请注意:所有<string>值都必须放在引号里(不限单双引号),否则没有加引号的特性将会被忽略(不会整行代码被忽略)

` font-feature-settings: "akhn" on,"smcp" 1;`

同时此属性也是一个描述符,即存于@font-face中的描述符.

其作用与其属性相同,值得格式也是相同,font-feature-settings描述符几乎覆盖了font-feature-settings属性的所有功能,外加一些其他作用.

请注意,由于font-feature-settings描述符或属性取值都是晦涩难懂的OpenType标识符和布尔值,

所以CSS明确规定建议创作人员使用font-variant,只在想要的字体特性不在font-variant的取值范围时才使用font-feature-settings.

## font-synthesis

*详情请看<CSS权威指南P204>*

字体合成.

取值为: none | weight | style , 初始值为: weight style.

其作用是控制字体族可以合成哪种字型.

- ​    若一个字体族没有粗体/斜体,那么开发者使用了字体族属性的粗体/斜体属性,并赋予了对应值,则用户代理会自己合成一个粗体/斜体的字型效果来.

  ​	例如:没有粗体的字体族,你使用了bold属性并给值,用户代理可能会在各字形的两侧增加像素,达到J加粗的效果.

  ​	没有斜体,用户代理则可能会直接将常规字体倾斜变成斜体.

  ​	这种让用户代理自动合成字型的方法有好有坏,**好处就是**: 无需担心使了关于字型的属性想要改变其字型时可能未发生变化.

  ​	**坏处就是**:这种变化可能会让字型变得更丑,从而整个网页也丑.

  ​	所以才有了此属性,它可以允许字体族可以合成哪种字型.

例如: `font-synthesis:none;`代表不允许用户代理合成字型,这样在没有粗体/斜体等字型的字体族中,用户代理将不会自动合成字型,.

# font属性

## font属性简写font-xxx的属性

*详情请看<CSS权威指南P206>*

### 描述

注意我们说的是font这个属性,而不是关于font-xx的属性.

font属性可以用来作为font-xxx其中五种属性的简写形式:

1. <font-style>
2. <font-variant>
3. <font-weight>
4. <font-size>
5. <font-family>

所以如果我们需要使用到这些font-xxx的属性时,

如国一一列出来,就会相当的烦琐,麻烦,而且不美观,还显得笨拙.

​	`h2{font-style:oblique;font-variant:call-caps;....}`

所以在CSS规范中,规定了,有关以上五种的font的属性当写在一起的时候,是**可以简写**的,且方法不唯一.

​	(实际上,有许多属性都可以简写连在一起,font-xxx的属性也只是其中一个)

请往下看

### 示例

```html
<style>
    h1 {
        font-famil:VerDana;
        font-size:30px;
        font-weight:900;
        font-style:italic;
        font-variant:small-caps;
    }
    h2 {
        font-famil:VerDana;
        font-size:24px;
        font-weight:bold;
        font-style:italic;
        font-variant:normal;
    }
	/* 以上的CSS设置可以改成一下简写形式 */
    h1 {font:italic 900 small-caps 30px Verdana;}
    h2 {font:bold normal italic 24px Verdana;}
</style>
```

请看h1和h2元素的CSS的简写形式,它们的目的是等效的,除了值不同以外,作用都是相同的,都是我刚才所说的五种属性的简写形式.

而且通过对比,我们可以发现,h1和h2的CSS简写形式的前三个值是不一样的:

- 其中h1:font-style,font-weight,font-variant.
- 其中h2:font-weight,font-variant,font-style.

这两种写法都是没错的,因为对于font属性简写来说,这三个font-xxx属性的值都是可以随意排列,并且如果这三个属性的值为normal,甚至可以直接省略不写.

所以以上的简写形式,等于以下形式:

```
    h1 {font:italic 900 small-caps 30px Verdana;}
    h2 {font:bold italic 24px Verdana;}
```

对于以上的h2的简写来说,normal值被省略了,但是却依旧是等效于没有省略normal的h2的,没有任何区别.

- ​    **但是需要注意:**用这种方式简font的属性时,值与值之间要用空格隔开,而不是逗号,否则会被忽略整行CSS样式.

  ​    这种简写方式,我说的是可以简写以上形式,但是这种方式并不是唯一的,除了这种简写方式之外,还有其他写法.

  ​    这种font的属性的值可以任意排列且能省略normal不写的自由,只有前三个属性才有,也就是font-style,font-weight,font-variant这三个属性才有这样的自由.


​	*所以当你写前三个属性的值简写时,如果有重复的值出现,根本无需去在意这个值属于哪个属性这种,因为它们顺序任意,只要能相互匹配就行..*

而**后面的属性的顺序是非常严格的,不仅顺序严格,而且无法省略掉任何值**(即使是normal也一样),哪怕少一个,那么整个规则都是无效,都很有可能被用户代理忽略.

- 很有可能:只是概率部位0而已,毕竟没有绝对的不可能.

```html
<style>
h1 {font:normal normal italic 30px sans-serif}; /* √ */
h2 {font:30px sans-serif}; /* √,前三个属性值默认为normal */
h3 {font:sans-serif}; /* × 没有提供font-size */
h4 {font:14px}; /* × 没有提供font-family */
</style>
```

话说刚才我说了有五种font-xxx的属性是可以简写的,且一一罗列的处理,这是正确的说法,但是却有个例外,没想到吧!

我们通过font这个属性还可以设置line-height,尽管此属性属于文本属性,而不是字体属性,但是我们依然可以用font设置它,当然了,也可以不设置,我说过,它是一个例外,也就是可选属性.

具体设置方法是:在font-size的属性值后添加一个正斜杠"/",在正斜杠后添加你所需要设置的line-height的属性值.

`  h1 {font:italic 900 small-caps 30px/1.2 Verdana;}`

- 请注意30px/1.2

  30px: 指font-size

  1.2:指line-height的值.

而且与font-size和font-family的简写形式一样,我们不能将font-size和line-height的值顺序搞反,否则将会忽略整行样式,而不是单纯的只忽略line-height.

而且若要设置line-height的值必须以正斜杠/分割,否则也是忽略整行样式.

### 总结

根据以上的描述和示例我们可知,font的5个属性的值是可以简写出现的,且还能设置一个可选的文本属性:line-height,这五个属性+一个可选文本属性,分别是:

1. ​    `font-famil:VerDana;`
2. ​    `font-size:24px;`
3. ​    `font-weight:bold;`
4. ​    `font-style:italic;`
5. ​    `line-height:1.2`
6. ​    `font-variant:normal;`

且当这5个font的属性值写成简写的形式时,只能用空格隔开,除非其他简写方法有其他要求,而文本属性line-height必须在font-size属性值后添加一个正斜杠,然后将值写道正斜杠后面,且必须以这样的顺序.

并且其中对于font的属性: font-style, font-weight, font-variant. 这三个属性来说是可以自由排列,且若值为normal是可以直接省略不写的.

其他两个属性(包括1个可选文本属性)则必须严格按照顺序排列,且无法省略,否则将导致整个CSS样式作废.

**这里我再强调一点:**

1. ​	若使用font属性,也就是使用font-xxx的简写形式,必须出现两个值:font-size,font-family,并且顺序size为先,family在最后,不能搞混,且不能省略这两个值..
2. ​	同时若写了可选文本属性line-height,必须以正斜杠的形式在font-size之后,顺序也是不能搞混,也无法省略.

​	否则,若违反以上两种简介规则,则整条样式作废.你们可不要觉得我啰嗦,因为很多开发者都会犯下这种低级错误.

## 使用font属性将元素设置为系统字体

*详情请看<CSS权威指南P209>*

### 描述

想让网页与用户的操作系统融为一体,可以在font属性声明中(也就是属性值)使用系统字体值.

一旦设定,元素(节点对象)应用的是操作系统中空间的字号,字体族,字重,字形和字体变形.

且一个font的属性值的系统字体值包含了许多属性,例如font:caption 包含了十八种属性.

```html
    font-style: ;
    font-variant-caps: ;
    font-weight: ;
    font-stretch: ;
    font-size: ;
    line-height: normal;
    font-family: ;
    font-size-adjust: ;
    font-kerning: ;
    font-optical-sizing: ;
    font-variant-alternates: ;
    font-variant-east-asian: ;
    font-variant-ligatures: ;
    font-variant-numeric: ;
    font-variant-position: ;
    font-language-override: ;
    font-feature-settings: ;
    font-variation-settings: ;
```

所以系统字体只能作为一个整体设置,一旦设置一个系统字体值,那么有关的属性都会被一起设置(例如:字形,字体变形,字重,字号,字体族等).

但是我们可以在设置系统字体值之后再单独设置某个属性.(这是因为样式优先级的关系:在权重(!important为指标),来源,特指度一样的情况下,前后位置靠后的将会覆盖前面的样式,详情请看:<h5_css_js.doc>).

例如: `button {font:caption;font-size:1em};`这样设置,就不用担心因为将元素的标题控件改成了系统字体而造成页面上元素字体的显示和其父元素有非常大的区别,从而导致页面的丑化.

**若用户设备不存在指定的系统字体**,那么用户代理可能会尝试模仿此字体,

​	*例如我们设置font属性值为caption,用户设备没有此字体,那么用户代理可能会将caption字体的字号变小,得到small-caption字体.*

若无法模仿/模仿失败,则用户代理应该使用的是normal,即系统默认字体;若能找到开发者指定的系统字体但却无法读取全部,用户代理也使用默认字体.

​	*例如:用户代理或许能会遭到status-bar这个属性值指定的系统字体,但是无法读取(知道)的原因,不知道是不是小号大写字母型,就会将status-bar改为改为默认字体,normal.*

有趣吧,我们将元素(节点对象)中字体设置为系统字体,就是为了使网页看上去能和用户操作系统融为一体,但是用户竟然可能不存在此字体.

系统字体,用户设备中竟然可能不存在,哪个用户这么蠢,删了它~.

### 取值

- caption

  用于标题控件（如按钮，下拉列表等）的系统字体。

- icon

  用于标签图标的系统字体。

- menu

  菜单中（如下拉菜单和菜单列表）使用的系统字体。

- message-box

  用于对话框的系统字体。

- small-caption

  用于小标题控件的系统字体。

- status-bar

  用于窗口状态栏的系统字体。

### 示例

- `button {font:caption};`

  将标签控件设置为系统字体.

# 字体匹配机制

*详情请看<CSS权威指南P210>*

## 简述字体匹配过程

1. ​	首先用户代理会访问字体属性数据库(若不存在则创建完再访问),此数据库包含CSS的所有字体属性,

   ​	并且用户设备中的所有字体通常都在这里,不过有可能有其他字体,例如:用户代理可能内置一些字体.

   ​	如果数据库中有重复字体出现,则将只有其中一个有用,其余皆被忽略.

2. ​    其二用户代理会把有应用字体属性的所有元素摘出来,并为每个元素构建一个列表.

   ​		*(注意:虽说这里说的是所有元素摘出来,但是仅仅限于有被用到的字体属性的元素才会被摘出来,其他的没被用到的则不会这么做,和惰性加载的意思差不多.)*

   ​	此列表包含了构建显示元素所需要的所有字体属性.

   ​	一旦构建完列表,用户代理就会直接先根据此列表匹配选择使用哪个字体族的字体显示元素.

   ​	如果能找完全匹配的字体,就使用这个字体.否则,用户代理还要做一些其他额外工作.

   1. ​    那到底怎么寻找到到完全匹配的字体呢?首先匹配字体时先看 `font-stretch`属性

   2. ​    然后再看font-style属性.

   3. ​    接着处理 `font-size`属性

   4. ​    如果在第2步没有找到匹配的字体,那么用户代理就会在同一个字体族选择替代字体,然后回到第二步,再接着匹配.

   5. ​    如果能找到一个基本匹配的字体,但是字体却没有显示元素所需要的全部信息,比如显示一个元素字体需要:版本权符号

      ​	但是此匹配到的基本字体没有版本权符号这个信息,则用户代理就会继续回到第2步,寻找其他替代字体,然后再往下匹配字体的属性,看看属性是否能匹配正确.

   6. ​    最后,如果找不到匹配的字体,且所有替代字体都试过了,那么用户代理将会选择字体族中的默认字体,力争正确显示元素.

## 用户代理处理字体变形和字体特性的方式

*详情请看<CSS权威指南P211>*

1. ​    查看默认启用的字体特性,包括指定文本所需的特性.

   ​		默认启用的特性有8种:

   1. calt
   2. ccmp
   3. clig
   4. liga
   5. locl
   6. mark
   7. mkmk
   8. rlig

2. ​    检查.如果是@font-face规则定义的字体(即开发者的自定义字体),那么会检查@font-face中的font-variant描述符所对应的特性.

   ​	然后再检查其中的font-feature-settings描述符对应的特性

3.    检查除了font-variant或font-feature-settings属性之外的属性确定的特性设置.

   ​	例如:把letter-spacing属性设置默认值之外的值时,将禁用连字.

4. ​    检查font-variant属性及其子鼠星(例如:font-variant-ligatures),

   ​	以及其他可能会调用OpenType特性的属性(例如:font-kerning,字符间距)的值对应的特性

5. ​    检查font-feature-settings属性的值对应的特性.

做这么多检查的原因就是确定某字体的特性有否被更改,确定完之后再行应用.

有趣的是,在匹配一个字体族中的字体时,多数情况下所有字符(即每个汉字和数字等)都能被匹配到,但是若在一个段落中的一个汉字无法被匹配到时,那么:

1. ​	**用户代理要么绕过此汉字,不进行应用此字体;**

2. ​	**要么就寻找其他能满足需求的字体,如果能找到满足需求的其他字体,则用户代理就可以使用这个其他字体来显示应用字体**

   ​	**(未匹配到字符的字体)的元素.**

​		或者只用于显示那个汉子,又或者整个段落都是用其他字体.

而我说的这些,凑巧有个例子: `body{font-family:Times};`

​	即某个元素使用在应用Time字体时,元素中的某个字无法被Time所匹配到相应的字体形状,那么就会发生以上的两种情况.

# 文本属性和字体属性的区别

单纯从题目上来看,我们一时间不难发现: 文本好像就是字体?

这是不对的.简单来说:

- 文本是内容

   字体是用来显示内容的.

也就是说,文本就是我现在打的这么一行行的字,而字体是我现在打的这么一行行字的形状,样式等为什么会是这样的原因.

再比如: 文本如果是一个人,而字体就是用来描述这个人所长的样子是什么样,所处的地方是什么地方.

总的来说,文本就是一个内容,而字体是显示这个内容应该以什么样子呈现的属性.

那么文本属性和字体属性的区别就显而易见了

- 文本属性可以改变文本的样式.

  字体属性可以让文本以什么样子显示.

# 小结

通过以上的点我们可以发现,CSS拥有强大的改变字体的能力,虽然最初的时候很弱小.

所以开发者对字体的控制达到的前所未有的程度,但是请开发者铭记:必须合理利用手中的权力.

比如一个网站是可以允许使用17种(或多种)不同的字体,但是这绝不表明你应该这么做.因为这样做除了会影响呈现给用户的美感之外,还会增加页面的体积(字体下载不要钱,不要空间,不要网速,不要流量啊!!),

这样是完全不合理的(除非有特殊情况,比如你自己设计自己的网站,想怎么样就怎么样,别犯法就行).

所以请各位开发者,创作人员不要肆意妄为啊!
