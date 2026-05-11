import { defineConfig } from 'umi'
import path from 'path'
import Dotenv from 'dotenv'

import routes from './routes'

// umi 进行打包, 读取此文件, 然后配置 webpack 时, 额外注入 yomua/.env 到 process.env
const getEnvConfig = () => {
    Dotenv.config({ path: path.resolve(__dirname, '../.env') })
    return process.env
}

// 运行时需要注入到浏览器的 .env 变量白名单
// 注意: 仅注入业务需要的环境变量, 避免将系统环境变量 (如 PATH, HOME 等) 泄露到前端代码
const RUNTIME_ENV_WHITELIST = [
    'NODE_ENV',
    'SCROLL_SPEED',
    'ARTICLE_SUFFIX_NAME',
    'ARTICLE_COMMIT_LAST_DATE',
    'ARTICLE_DIR',
    'ARTICLE_PICTURE',
    'WRITE_ARTICLE_DIR',
]

export default defineConfig({
    /**
     * https://webpack.docschina.org/configuration/output/#outputpublicpath
     * https://v3.umijs.org/zh-CN/config#publicpath
     * 从哪个路径获取前端资源.
     * /: 通过根路径访问到前端资源, 如: 访问 http://www.whyh.com/a/b/c, 则从 http://www.whyh.com/ 开始查找前端资源
     * ./: 从当前路径开始查找前端资源, 如: 访问 http://www.whyh.com/a/b/c, 则从 http://www.whyh.com/a/b/c 开始查找前端资源
     */
    publicPath: '/',
    title: 'Yomua',
    favicon: '/assets/favicon.png',
    devtool: 'source-map',
    routes,
    fastRefresh: {},
    // 开启文件 hash 后缀
    hash: true,
    // mfsu 可能会造成一些 bug
    mfsu: {},
    // 使用 hash: 避免部署到 github pages 时，当地址为 /feature/article 或其他没有 html 的路由时，刷新页面 404 的问题。
    // => 这种使用 history 遇到的情况如果是自己的服务器, 只需要做一个代理即可, 比如: nginx.
    // => 通过 nginx 判断, 当访问到一个没有 .html 文件对应的路由时, 返回 /index.html 文件, 并由此文件接管路由,
    // => 这样 /index.html 文件中的引入的 .js 文件就能接管你访问的路由, 渲染正确的组件.
    // 使用 browser, github pages 需要做一些特别的操作
    // => 即: 需要为 github pages 导航不到对应的路由时, 设置一个 404.html (public/404.html), 然后再跳转回来即可.
    history: {
        type: 'browser',
    },
    // 加载时显示的 loading，当存在这个配置时，将启用按需加载。
    dynamicImport: {
        loading: '@/component/loading',
    },
    nodeModulesTransform: {
        type: 'none',
    },
    alias: {
        // 使用此别名是为了将 ~ 视为项目根目录，对应 tsconfig.json - paths 的配置
        '~': path.resolve(__dirname, '../'),
    },
    // 使用 webpack 5
    webpack5: {},
    // 全局注入 less 文件
    lessLoader: {
        // Reference： https://stackoverflow.com/questions/60809336/customizing-ant-designs-theme-what-exactly-is-that-hack-key-in-the-modifyva
        modifyVars: {
            hack: 'true; @import "~@/assets/less/_index.less";',
        },
    },
    proxy: {
        // 访问目录是 /mock 的接口时，将被代理到 'http://heymock.uneedcode.com'
        '/mock': {
            target: 'http://heymock.uneedcode.com',
            changeOrigin: true,
            pathRewrite: { '^/mock': '' }, // 去除请求路径中的 `/mock` (在浏览器显示的时候不并不会去除, 但是实际上到服务端时已经去除)
        },
    },
    chainWebpack(config, { env, webpack, createCSSRule }) {
        // 配置 Markdown Loader
        // 导入 markdown 文件时, 需要 markdown loader
        // 但是自从我将 markdown 文件移入 public 文件夹, 使用请求的方式 (fetch) 获取,
        // 似乎就不需要 markdown loader 了; 暂时先保留.
        // config.module
        //     .rule('compile')
        //     .test(/\.html$/i)
        //     .use('html-loader')
        //     .loader('html-loader')
        //     .end()
        //     .rule('markdown')
        //     .test(/\.md$/)
        //     .use('html-loader')
        //     .loader('html-loader')
        //     .end()
        //     .use('markdown-loader')
        //     .loader('markdown-loader')
        //     .options({
        //         // Pass options to marked
        //         // See https://marked.js.org/using_advanced#options
        //         // For example, if you want to use a custom renderer:
        //         // renderer: new marked.Renderer(),
        //     })
        //     .end()

        // 注入 .env 中的配置到 process.env, 仅注入白名单内的变量, 避免泄露系统环境变量
        // 这样就可以在运行时(跑到浏览器的时候)使用 process.env 获取对应的 env 的变量 (通过 src/utils/constant)
        const allEnv = { ...getEnvConfig(), ...process.env }
        const safeEnv: Record<string, string | undefined> = {}
        RUNTIME_ENV_WHITELIST.forEach((key) => {
            if (allEnv[key] !== undefined) {
                safeEnv[key] = allEnv[key]
            }
        })

        config.plugin('define').use(webpack.DefinePlugin, [
            {
                'process.env': JSON.stringify(safeEnv),
            },
        ])

        return config
    },

    metas: [
        {
            property: 'og:title',
            content: 'yomua笔记',
        },
        {
            property: 'og:description',
            content: 'yomua love you.',
        },
        {
            property: 'description',
            content: 'yomua love you.',
        },
        {
            property: 'og:image',
            content: '/assets/favicon.png',
        },
        {
            property: 'og:image:type',
            content: 'image/png',
        },
    ],
})
