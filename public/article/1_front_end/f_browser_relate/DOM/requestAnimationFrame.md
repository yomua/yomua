# 作用

requestAnimationFrame(callback)将在浏览器下一次重绘之前调用一次.

- 下一次重绘, 即: 浏览器再渲染下一帧之前会先调用 requestAnimationFrame(callback) 中的 callback.

假如, 一个屏幕每秒绘制 60 帧, 那么每秒 requestAnimationFrame(callback) 将会调用 60 次， 即: 每一帧一次.

```html
<div id="box"></div>
<script>
  const box = document.getElementById("box");
  let startTime;
  let i = 0;

  // timestamp: 当前函数被 requestAnimationFrame 调用时的时间戳
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;

    // 每次调用时, 次数 +1
    console.log(i++);

    const progress = timestamp - startTime;

    box.style.top = `${Math.min(progress / 10, 200)}px`;

    // 2s
    if (progress > 2000) {
      return;
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
</script>
```

- 如果当前浏览器每秒绘制的帧为 60, 则:

  i 总共会输出 120 次, 从 0 -> 120;

  即: 2s 内输出 120 次; 每秒输出 60 次.