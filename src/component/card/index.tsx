import { memo, useState } from 'react'
import { Tag, Card, Image, CardProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faClock,
    faUserAstronaut,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

import style from './index.less'

interface CustomProps extends CardProps {
    img?: string
    text?: string
    title?: string
    author?: string
    time?: string
    tag?: {
        icon: IconDefinition
        name: string
        key?: string
        color?: string
    }[]
}

const CustomCard = (props: CustomProps) => {
    const {
        img,
        time,
        text,
        title,
        author,
        className,
        tag = [],
        ...otherProps
    } = props

    const [visible, setVisible] = useState(false)

    return (
        <Card
            bordered
            hoverable
            className={`${style.card} ${className}`}
            {...otherProps}
        >
            <Image
                src={img}
                className={style.image}
                preview={{ visible: false }}
                onClick={() => setVisible(true)}
            />

            <div className={style.preview}>
                <Image.PreviewGroup
                    preview={{
                        visible,
                        maskClosable: false,
                        onVisibleChange: (vis) => setVisible(vis),
                    }}
                >
                    <Image src={img} />
                </Image.PreviewGroup>
            </div>

            <div className={style.content}>
                <div className={style.title}>{title}</div>

                <div className={style.summary}>{text}</div>

                <div className={style.info}>
                    <div>
                        <FontAwesomeIcon icon={faUserAstronaut as any} />{' '}
                        {author}
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faClock as any} /> {time}
                    </div>
                </div>

                <div className={style.tags}>
                    {tag.map((tag, index) => {
                        return (
                            <Tag
                                key={tag?.key ?? index}
                                icon={
                                    <FontAwesomeIcon icon={tag?.icon as any} />
                                }
                                color={tag?.color ?? '#55acee'}
                                className={style.tag}
                            >
                                {tag?.name}
                            </Tag>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}

export default memo(CustomCard)