# 使用 memo 后添加泛型

```jsx
// test.tsx
function Test<Item extends { id: number; themeName: string }>(props: {items: Item[];onClick: (item: Item) => void;}) {

  return (
    <div></div>
  );
}

export default memo(Test) as typeof Test;

```

这样使用后， 你使用此组件

```jsx
<Test 
   items={ [{id:1]}] }  
   onClick={(item)=>{}}
 />
```

- 会自动推断出 onClick 的 item 类型为 {id:1}