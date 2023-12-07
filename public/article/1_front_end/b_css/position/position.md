# 请看

里面的例子大部分存于:

H:\ProgramWay\ProgramWorkplace\Software\VSCode\Note\CSS_HTML

# 基本概念

## 定位P523

- 定位由position属性指定,其值为5种:
  
  ​    **static | relative | absolute | sticky | fixed**
  
   P523

- 5个定位元素的作用以及其容纳块:P523 - P524

- 一旦设置abosolute值的,不管曾经是什么类型,那么立即就会变成块级框. P523

- **设置relative或static的值的元素的容纳块,**其容纳块是父辈块级/单元格/行内块级元素生成的元素框的内容区边界以内的区域,即相对于内边界限定的区域定位. P524

- 祖辈元素是块级元素情况下:设置**absolute值的元素**是相对于容纳块的边框边界（不含边框大小）进行定位.
  
  至于祖辈若是行内元素: 则相对于容纳块内容区边界定位. P524
  
  absolute 会将元素移除文档流。
  
  PS:父辈元素的position属性值不能为static或者不写(不写的默认值就是static)，否则就会一直往上寻找 position 的值为非 static 的祖辈元素，然后对其进行定位。

- body(html)下:**absolute元素的容纳块的position属性不能是static,即不能为默认值**,否则将会一直寻找祖辈元素,直到找一个不是static的position属性,
  
  若一直找不到,则直到body时停下来,以body作为边框边界的限定区域作为容纳块.P526的那个例试一下就知道.
  
  ​    例如:p1 p2两个p元素,在div元素内,我们设置了p1,p2元素的绝对定位,然后设置其属性,由于div没有设置定位属性,所以其默认为static,
  
  ​    所以此时你打开firefox浏览器的GodeModel,在p1和p2元素的布局-盒模型属性下,你会发现position属性的右边有个偏移二字,它们上写着body,
  
  ​    即以body的边框边界以内的区域为容纳块,若你修改了div元素的position属性值为relative,则此时p1,p2元素的容纳块才会div元素的边框边界以内的区域.
  
  ​    你可以修改p1,p2的偏移属性查看它们往哪里偏移就知道了,你应该会发先,在不设置div的position情况下,其right:0,会贴着body的边框边界,即正常情况下,会贴着浏览器的可视区域的右边.
  
  ​    以下我给出示例.
  
  ​    **这就是老师所说的"子绝父相"**...其实就是因为首先父块级元素的position不能为static,因为子元素设置absolute值时,其是相对于positio属性值不为static的父块级元素的**边框以内区域(容纳块边框以内区域)**定位的.

- ​    虽说可以设置其他值,例如:容纳块设置position属性值设为:**absolute,fixed,sticky,**但是这三个定位属性值都不太好,第1个会让容纳块(父块级元素)也去相对于其容纳块定位,
  
  ​    **第二个则**是类似于第一个,只不过它的容纳块是视区自身(也就是浏览器可视区域?)
  
  ​    **第三个**还则是会出现两种结果,失效和触发....
  
  ​    所以才不用这三个的,当然了,要用也不是不行,如果合适,该用还是用的,不能吊死在一棵树上.
  
  ```html
  <style>
      div {
          height: 400px;
          width: 400px;
          border: 1px solid red;
          box-sizing: border-box;
      }
      p.p1 {
          height: 50px;
          width: 50px;
          border: 1px solid blue;
          position: absolute;
          right: 0;
  </style>
  <body>
      <div>
          <p class="p1">p1</p>
      </div>
  </body>
  ```

- absolute元素的父辈元素为块级元素时,设置其width/height为百分数,则是相对于容纳块的边框以内区域计算,是不会计算边框的宽/高度的.
  
  可以自己尝试将边框设为100px,去看看会不会将之也计算就能深刻体会. P525, P528例子. right:50%;  

## 偏移属性P525

- **CSS允许使用4个属性**: top, right, bottom, left 去指定 定位元素的各边相对容纳块的偏移,
  
  ​    也就是可以让其定位元素的各边相对于容纳块（具体相对于容纳块那个边，就要具体去说）进行移动,请注意这些**属性指定的是距离容纳块最近的那条边的偏移,**所以这4个属性才被称为:偏移属性Offset Property..
  
  ​    例如:top属性指定 定位元素的上外边界（外边距边界，若有的话）距离容纳块的顶边有多远,如果其值是正数,则把此定位元素的上外边界向下移动; 如果为负数,则反过来,将此外边界移动到容纳块的顶边上部,也就是向上移动.
  
  ​    类似的,还有其余三个属性也是这样,但是需要注意的是:如果外边距为0,则就不存在外边界,所以此时是定位元素的边框边界相对于容纳块某个边的偏移,以此类推...
  
  ​    上面也说过了,即指定的是定位元素距离容纳块最近的那条边相对于容纳块的偏移
  
  ​    并且虽然我们说的是定位元素的边偏移,但实际上定位元素的边偏移后,该元素的一切也都会随之移动,包括内容去,内边距,边框以及其他外边距. **所以定位元素也可以设置其外边距,边框和内边距的,**
  
  ​    **它们会在定位 元素的过程中得以保留,**并且也都在偏移属性定义的范围内,即它们也可以作为偏移的边.
  
  ​    P525

- **偏移属性若是百分数**,则是相对于容纳块的高度/宽度计算.上下偏移相对高度,左右偏移相对宽度. P525-P526

- **对定位元素,有时我们不需要设定其height和width**,可以从偏移属性推测出这两个属性的值,用户代理也可以做到,我们自己也能做到.P528
  
  例如: `top: 0;bottom:0;left:0;right:50%`,假设这是:absolute值
  
  由于定位元素在不设置width和height的情况下,其就一定会满足这4个属性设定的偏移量,
  
  ​    所以此时该定位元素的上部离容纳块最近的那条边,离容纳块的边框边界为0,即紧贴容纳块上边框边界,下边也是紧贴容纳块边框边界,
  
  左边那里也是,除了右边以容纳块有边框边界为基础向内偏移50%.
  
  ​    所以此时的定位元素的高度为容纳块上边框内侧到下边框内侧的距离,而宽度则是容纳块左边框内侧到容纳块的中间位置
  
  ​        (因为右边内向偏移50%,即距离容纳块边框边界为:  容纳块边框以内(不含边框)的宽度*50%,也就是一半 P528

- **定位元素若被限制了宽度和高度,**此时你设置其偏移量时,出现的结果可能会让你疑惑,但是实际上这是符合规范的.
  
  ​    例如:一个宽高为100px的相对定位元素存在一个body中,这时候它的容纳块就是body的边框边界. 如果你设置此元素right:0; 通常会发现它依然在原地没有变动. 
  
  ​    这就是其设置了定位元素的宽度和高度的后果

## 限制宽度和高度P529

- 使用min-width/height和max-width/height可以定义元素最小/最大的宽度/高度.P530 
- 使用max-width/height避免元素太宽/高 P532

## 内容溢出和裁剪P532

- 如果内容太多,在元素中放不下,可能会从元素中溢出,出现这样的情况有几种处理方法,通过CSS可以选择其中一个.
  
  此外,还可以定义一个裁剪区,指明超出元素多大范围才算溢出.P532

- CSS提供的overflow属性可以用来处理溢出的情况,取值有4种:
  
  ​    visible | hidden | scroll | auto.
  
  **visible**:为默认值,即不处理溢出,使溢出内容可见.
  
  **hidden**:将溢出内容裁剪(溢出)
  
  **scroll**:通常情况下,会出现滚动条,让用户能通过滚动条查看溢出内容.(滚动条可能不止一个,例如可以出现右滚动条和下滚动条),
  
  ​    且一旦设置该属性值,则按照规范:滚动条应该始终渲染出来,这是为了避免动态环境下滚动条的出现和消失时导致什么问题.
  
  **auto**:让用户代理自己处理溢出内容. 即元素内容溢出时UserAgent可能会提供滚动条,可能不提供,但是肯定可以提供.
  
  ​    简单说就是:UserAgent可能将auto理解为:在需要时提供滚动条,否则不提供. P533 - P534

## 元素的可见性 P534

- 我们可以通过visibility属性设置其元素的可见性,取值有三种:
  
  ​    visible | hidden | collapse
  
  **visible**: 默认值,指定的元素可见
  
  **hidden**: 指定元素不可见,注意:只是看不见,但是元素其实还存在那,仍对布局有影响,就和外边距一样.
  
  ​    请将此属性和display:none区分开来,这个属性会导致元素不显示以及完全从文档中移除,就和从来没存在这个元素一样,但是HTML源码上会显示.
  
  **collapse**:通常在渲染表格时使用,这里暂不讨论.但是根据规范,此值与用在非表格元素上的hidden具有相同作用. 
  
  ​    即用在非表格元素上,也通常具有hidden的作用,即隐藏元素但依然存在.

## 细节讨论

- 绝对定位元素的容纳块 P536 - P539
- 绝对定位元素的位置和尺寸 P539 - P540
- 自动确定边界的位置 P541 - P542
- 非置换元素的位置和尺寸 P543 - P547
- 置换元素的位置和尺寸 P547 - P550

## Z轴上的位置:z-index P550

- **此属性必须使用在定位元素中,可以自己尝试用在非定位元素中,此属性就会被忽略**

- z-index属性可以用来控制重叠的定位元素的堆叠次序, 值越大的离读者的距离越近,即哪个定位元素压住哪个定位元素.P550
  
  ​    堆叠次序:重叠的定位元素先后出现在读者眼前的顺序.
  
  ​    即先出现的离读者越近,后出现的越远.P551

- z-index有两个取值: <integer> | auto
  
  <integer>: 任何整数,不论是负数还是正数.P552
  
  auto:CSS规范是这样规定的: 生成的定位元素框在当前堆叠上下文中的堆叠次序是0. 如果不是根元素,不确立新的堆叠上下文.所以z-index:auto可以视作z-index:0. P554
  
  ​    堆叠上下文: 应该指的是容纳块.P524最后两行.

- 多个定位元素z-index属性设置为整数时,不必让其值是连续的,也就是说其中一个值为1,另一个元素的属性值为10000都行. P553

- PS:尽管弹性布局和栅格布局中的元素不使用position属性定位。但是它们也受z-index的控制,相关的规则本质上是一样的.

## 固定定位fixed P555

以上的都是绝对定位的方面,现在我们讨论固定定位.　

- **固定定位**和绝对定位absolute类似,但是它的**容纳块是视区,也就是浏览器可显示区域.** 固定定位的元素完全从文档流中移除(和absolute元素一样),
  
  其位置与文档中的任何一部分都没关系(absolute和文档的某部分还是会有关系,例如:其容纳块) P555

- **固定定位fixed若设置偏移属性值,则偏离规则依然为**: 离容纳块边界最近的那条边,距离容纳块的边框边界有多远. 
  
  只不过这里的容纳块为页面可视区域,其四个边界为页面的可视区域的上下左右.

- **可以使用fixed将某个框永远的固定在浏览器可视区域内,**即不论浏览器当前页面如何滚动,这个框体都能被发现.
  
  但是有个坏处:文档的其他部分元素会被fixed元素遮盖住.P555

- **fixed元素也仍然会受z-index属性影响**,即fixed元素的堆叠次序能被影响,但是仍然固定在视区.可以自己亲测.

## 相对定位relative P556

相对定位是较容易的定位了,相对定位使用偏移属性移动元素,且相对定位本身不会改变元素形状且元素所占的空间也与正常情况下相同.

- 有趣的是:当我们**使用偏移属性移动相对定位的元素**,会实现一些有趣的效果: 即相对定位所留的占位空间还在原地不动,但是其元素内容会被移动. P557

- 相对定位的元素可能会与其他元素重叠,即使用偏移属性控制其相对元素移动导致会在原地留下占位空间(即空白),然后元素内容被移动之后与其他元素内容重叠.  P5588

- 当相对元素出现过约束, 就把其中一个值设为另一个值的相反数.
  
  在从左→右的文本书写方向时(默认情况):right始终等于-left(left 优先级 > right)
  
  在从右→左的文本书写方向时 :-right始终等于left P558(right 优先级 > left)
  
  - 过约束:取值相互冲突/与规范冲突
  
  *上一个过约束出现在:<视觉格式化基础_块级置换和非置换元素.md> - 7(3)个属性全用指定值 width=auto,左右外边距=0*

## 粘滞定位[sticky](https://www.zhangxinxu.com/wordpress/2020/03/position-sticky-rules/) P559

设置position:sticky的元素,一开始会留在常规文档流中.

达到触发条件时:其表现就会**如同使用了absolute的元素**,即会相对于容纳块进行定位,不过即使触发了此条件的粘滞定位元素**也还会保留在常规文档中占据的空间.**

触发粘滞条件失效后:指定位元素**就回到最初的位置**,如同什么都没改变.P524

- **粘滞定位元素也必须存在容纳块**才能实现其效果, 容纳块必须存在position属性且值不为static,否则其粘滞定位元素将会向其祖辈元素寻找,直到找一个符合条件的,
  
  直到body还没出现符合条件的祖辈元素时,就将body的边框边界认为是容纳块.
  
  这里说的祖辈元素都是块级元素,如果是行内元素其粘滞定位元素触发之后,容纳块就是这个祖辈行内元素的内容去边界,这点和absolute元素类似. P524最上面和中间

- **粘滞定位元素实现的效果为**: 在某个容纳块内,当你没有滑动到它时,并不会触发粘滞效果,但是当你滑动到它时就立即触发,然后如同相对定位于容纳块(即如同absolute),直到碰到下一个粘滞定位元素.
  
  若没碰到,只要没你的滑动没回到最初的位置,那么此粘滞定位元素就不会失效. P559
  
  - 滑动: 其实就是用滚动条进行滑动.
  
  所以粘滞定位元素通常出现在有滚动条的容纳块中.

- 粘滞定位元素能粘滞在任何一条容纳块的边框边界. 只要将需要粘滞的那条边界的**偏移量设为0,其他偏移量设为atuo即可**. P560 - P561

- 粘滞定位元素用在哪: 例如一个按字母顺序排序的文章,此时你从A向下滑动时,
  
  ​    A这行一只存于当前容纳块顶部/底部/左边/右边,直到滑到B时,A行就返回最初的位置,触发粘滞定位元素B,然后B也固定,以此类推,直到Z为止. 
  
  ​    而这也正是和使用position:fixed定位的不同方面,但是如果只存在一个粘滞定位元素,在元素被触发时,其实就如同fixed,只不过其容纳块不是视区罢了. P561

- 一个容纳块存在多个粘滞定位元素,并且滚动到某一位置时,一起出发了多个粘滞定位元素,导致元素重叠时,可以使用z-index属性将之堆叠排序,从而在视觉上达到只存在一个粘滞定位元素的效果. P562

通过定位可以随意移动元素,这是常规文档流中难以企及的,虽然现在很多定位技巧终将被栅格布局取代,但是定位仍然有大量用途.

例如:让侧边栏始终显示在视区中(position:fixed), 或者粘滞显示列表或长文中的小标题(position:sticky).

还能通过z轴确定堆叠次序,加上各种溢出的解决方案,定位依旧有用武之地.P563

# 个人思考

- absolute元素,在其容纳块为父辈块级元素边框边界时, 该absolute元素确实如果使用偏移属性,其会相对于指定的边偏移,且不会受指定的容纳块的边以外的外边距影响**,也就是说我们偏移属性只会受其指定边的外边距影响.**
  
  例如: top:100px,则容纳块有无此上外边距会影响其top属性的显示效果. 类似的,还有left,right以及bottom. P525

- 指定一个定位元素的height/width,会影响其偏移属性的应用.通常情况下只有top和right才不会受影响,详情请看:基本概念 - 偏移属性.