/* eslint-disable react/no-children-prop */
import { memo } from 'react'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import MarkNavbar from 'markdown-navbar'
import ReactMarkdown from 'react-markdown'

import classnames from '~/packages/y-classnames'

import style from './index.less'
import 'github-markdown-css'
import './base.css'

type MarkdownProps = {
    children: React.ReactNode | string
    className?: string
}

const Markdown = (props: MarkdownProps) => {
    const { className = '', children } = props

    return (
        <div
            className={classnames(
                style.markdown,
                style.increaseWeight,
                className,
            )}
        >
            <div
                className={classnames(
                    'markdown-body-box',
                    style.markdownBodyBox,
                )}
            >
                <ReactMarkdown
                    // markdown-body 是导入 github-markdown-css
                    className={classnames(style.markdownBody)}
                    children={children as string}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                />
            </div>

            <div
                className={classnames(
                    'markdown-navbar-box',
                    style.markNavbarBox,
                )}
            >
                <MarkNavbar
                    className={style.markNavbar}
                    ordered={false}
                    headingTopOffset={40}
                    source={children}
                />
            </div>
        </div>
    )
}

export default memo(Markdown)
