# 简介

当你需要使用一段视频作为背景元素,  或者想要播放视频时, 可能会遇到不同浏览器之间的兼容性问题.

# PC

在 PC 端直接通过 video 元素, 然后设置 css 即可.

因为电脑端的浏览器通常来说限制没有移动端大, 

当然, 若是发现有些浏览器也存在兼容性问题, 完全可以照搬移动端的处理逻辑, 将之应用在电脑端.

# Mobile

对于移动端来说, 直接使用 video 会有兼容性问题.

- 使用夸克, Safari 等某些浏览器时, video 将被强制弹出.

解决方法如下:

1. 将视频文件(如 mp4) 通过 [ffmpeg](https://www.gyan.dev/ffmpeg/builds/#release-builds) 转成 `.ts` 格式的视频文件
2. 通过 [@cycjimmy/jsmpeg-player](https://www.npmjs.com/package/@cycjimmy/jsmpeg-player) 等库解析 `.ts` 文件, 并将视频数据一帧帧绘制到 canvas

```ts
const canvasContainer = document.getElementById('container')
// canvas 宽高(分辨率) 由 .mp4 转成的 .ts 文件决定
const canvas = document.createElement('canvas');
canvasContainer.appendChild(canvas);
 // 初始化时, canvas 大小. 后续通过 .mp4 转成的 .ts 文件决定
canvas.width = 300;
canvas.height = 300;

const defaultCanvasAltBg = 'xxx.png'

// 没有 src 时, 在 canvas 绘制的图片
if (!src) {
  const img = new Image();
  img.src = defaultCanvasAltBg;
  img.onload = () => {
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  return;
}

 // 将 .ts 视频数据一帧帧绘制到指定的 canvas
const videoInstance = new JSMpeg.VideoElement(canvasContainer, src, {
  canvas: canvas,
  autoplay: true,
  loop: true,
  control: false,
  poster: defaultCanvasAltBg, // 能获取到数据, 但还未开始播放时, 会显示的图片
  }, {
    audio:false, // 不处理视频中的音频
  });

```

注意

- 在移动端创建 video 元素到 DOM, 然后 `display:none` 隐藏, 再 video 视频数据, 最后再绘制到 canvas 中

  **这样是不行的**, 可能在夸克浏览器中没问题, 但是在 safari 中仍然会被强制弹出.

# ffmpeg

如何安装: 

1. 进入[链接](https://www.gyan.dev/ffmpeg/builds/#release-builds) 
2. 选择 `xxx-full_build.7z` 下载
3. [配置 path 系统环境变量](https://blog.csdn.net/csdn_yudong/article/details/129182648) 

- 在命令行中输入 `ffmpeg -version` 查看是否安装和配置成功

# 如何转换 mp4 到 .ts

使用命令

- `ffmpeg.exe -i mobile-bg-video.mp4 -f mpegts -codec:v mpeg1video -s 375x833 -b:v 10M -r 29.97 out.ts`

  - 将 `mobile-bg-video.mp4` 转成 `out.ts`, 

    分辨率为: `375x833 `

    视频码率为 `10M` 

    帧率为`29.97帧/s `

  如果要使用码率的单位是k, 则如: -b:v 2074k

  - s - 分辨率
  - b - 码率 b:v代表视频码率 b:a代表音频码率
  - r - 帧频

