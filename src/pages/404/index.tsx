import { memo, useCallback } from 'react'
import { history } from 'umi'
import { Button } from 'antd'
import cls from '@yomua/y-classnames'

import { RouteLink } from '@/utils/constant'

import Style from './index.less'

export default memo(function NotFound() {
    const handleClick = useCallback(() => {
        history.push(`/${RouteLink.Index}`)
    }, [])

    return (
        <div className={cls(Style.notFound)}>
            <div>走向归途的人生</div>
            <Button type='primary' onClick={handleClick}>
                Back Home
            </Button>
        </div>
    )
})
