import { useState, memo, useRef, useEffect } from 'react'
import classnames from '@yomua/y-classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from '@yomua/y-simdux'

import useTheme from '@/hooks/useTheme'
import useToggleBodyScroll from '@/hooks/useToggleBodyScroll'
import { parseArticlePath } from '@/utils'
import { ArticleFileTree } from '@/utils/utils.d'
import { Text, Search } from '@/component'
import storage from '@/utils/storage'
import { LOCAL_STORAGE_NAME } from '@/utils/constant'
import { setSearchValue } from '@/storeData/article'

import Style from './index.less'

type SearchPanelProps = {
    isShow: boolean
    fileTree: ArticleFileTree[]
    onTreeExpand: (expandKeys: string[]) => void
    onClose: () => void
    onTreeSelect: (
        path: string[],
        info: {
            node: {
                type: 'file' | 'directory'
            }
        },
    ) => void
    maskClosable?: boolean
}

const SearchPanel = (props: SearchPanelProps) => {
    const {
        isShow,
        fileTree,
        maskClosable = false,
        onTreeSelect,
        onTreeExpand,
        onClose,
    } = props

    const theme = useTheme()

    const dispatch = useDispatch()
    const searchValue = useSelector((state) => state?.article?.searchValue)

    const searchRef = useRef<HTMLInputElement>(null)

    const [searchResult, setSearchResult] = useState<ArticleFileTree[]>([])

    useToggleBodyScroll(() => {
        searchRef.current?.focus()

        return isShow
    }, [isShow])

    if (!isShow) {
        return null
    }

    return (
        <div
            className={classnames(Style.mask, Style[`searchPanel-${theme}`])}
            onClick={() => {
                maskClosable && onClose()
            }}
        >
            <div
                className={Style.container}
                onClick={(event) => {
                    // 这里阻止事件冒泡
                    // 即: 我们为 mask 添加了点击事件, 而 mask 包含 container,, 这意味着, 如果点击 container,
                    // 会先触发 container 的 click 事件, 然后冒泡到 mask 并触发 mask click 事件
                    // 就会导致点击 container 触发了 mask click 事件后调用  onClose(), 这会关闭 SearchPanel.
                    // 所以, 我们阻止这个事件冒泡, 当点击 container 时, 就不会触发 mask click.
                    maskClosable && event.stopPropagation()
                }}
            >
                <div className={Style.header}>
                    <Search
                        ref={searchRef}
                        placeholder='搜索文章'
                        onClear={() => {
                            setSearchResult([])
                        }}
                        onChange={(value: string) => {
                            dispatch(setSearchValue(value))

                            if (!value) {
                                setSearchResult([])
                                return
                            }

                            const result: ArticleFileTree[] = []

                            ;(function getSearchResult(
                                root: ArticleFileTree[],
                            ) {
                                root.forEach((item) => {
                                    if (
                                        item.children &&
                                        item.children.length > 0
                                    ) {
                                        getSearchResult(item.children)
                                        return
                                    }

                                    if (
                                        item.type === 'file' &&
                                        item.title // 全部转为小写, 不对 title 和用户输入值 value 区分大小写.
                                            .toLowerCase()
                                            .includes(value.toLowerCase())
                                    ) {
                                        result.push(item)
                                    }
                                })
                            })(fileTree)

                            storage.saveLocalStorage({
                                key: LOCAL_STORAGE_NAME.SEARCH_HISTORY_RESULT,
                                value:
                                    result.length > 0
                                        ? JSON.stringify(result)
                                        : '[]',
                            })
                            setSearchResult(result)
                        }}
                    />

                    <div className={Style.close} onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
                <div className={Style.body}>
                    <Text style={{ margin: '12px' }}>
                        {searchResult?.length ? '搜索结果' : '历史记录'}
                    </Text>
                    <ul className={Style.result}>
                        {/* 显示搜索结果 或 历史记录 */}
                        {(searchResult.length
                            ? searchResult
                            : storage.getLocalStorage<'array', ArticleFileTree>(
                                  LOCAL_STORAGE_NAME.SEARCH_HISTORY_RESULT,
                                  { returnType: 'array' },
                              )
                        ).map((item: ArticleFileTree) => {
                            return (
                                <li
                                    className={Style.resultItem}
                                    key={item.key}
                                    onClick={() => {
                                        if (!item?.key) {
                                            return
                                        }

                                        onTreeSelect([item.key], {
                                            node: { type: 'file' },
                                        })

                                        onTreeExpand(
                                            parseArticlePath(
                                                item.path
                                                    .slice(
                                                        item.path.indexOf(
                                                            '/article',
                                                        ),
                                                    )
                                                    .replace('/article/', ''),
                                            ),
                                        )

                                        onClose()
                                    }}
                                >
                                    <div className={Style.top}>
                                        <Text>
                                            <FontAwesomeIcon icon={faFile} />
                                        </Text>
                                        <Text>
                                            {item.title.replace(/.md$/, '')}
                                        </Text>
                                    </div>
                                    <div className={Style.weak}>
                                        {item.path.slice(
                                            item.path.indexOf('/article') +
                                                '/article/'.length,
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className={Style.footer}></div>
            </div>
        </div>
    )
}

export default memo(SearchPanel)
