/* eslint-disable react/no-children-prop */
import { memo } from 'react'
import { useLocation, useParams, Location } from 'react-router-dom'

import Error404 from '@/pages/404'
import type { HistoryPushState } from '@/utils/utils.d'

import { FeatureName } from '@/pages/constant'

import Todo from './todo'
import Gpt3 from './gpt3'
import Three from './three'
import Article from './article'
import Style from './index.less'

function renderFeature(
    name: FeatureName,
    options: {
        location: Location<HistoryPushState>
    },
) {
    const {
        location: { pathname = '', state = { isShow: false } },
    } = options ?? {}

    return <Article />
    // 说明当前路由是 feature/article 的标题，就重定向回去
    // 或 name.startsWith(FeatureName.Article) => 我们将路由模式改成了 history,
    // => 让 article 页面地址友好的显示为: https://www.whyhw.com/feature/article/xxx.md
    // 所以为了当用户访问类似地址时可以链接到 Article 组件, 于是这里采用了模糊匹配 startWidth
    if (pathname.includes('heading') || name.startsWith(FeatureName.Article)) {
        return <Article />
    }

    // 对 isShow=false 的功能, 直接返回 404, 防止直接输入地址进入隐藏的功能
    // if (!state.isShow) return <Error404 />

    switch (name) {
        case FeatureName.Three:
            return <Three />

        case FeatureName.Gpt3:
            return <Gpt3 />

        case FeatureName.Todo:
            return (
                <div className={Style.todoBox}>
                    <Todo />
                </div>
            )
        default:
            return <Error404 />
    }
}

function Feature() {
    const { name } = useParams() as { name: FeatureName }
    console.log('__ name__', name)

    const location = useLocation()

    return (
        <div className={Style.feature}>{renderFeature(name, { location })}</div>
    )
}

export default memo(Feature)
