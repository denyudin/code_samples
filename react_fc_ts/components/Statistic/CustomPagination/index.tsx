import React from 'react'
import { IProps } from './types'
import classNames from 'classnames'
import { Pagination } from '@material-ui/lab'

import './styles.scss'


type MergedPropsType = IProps
const CustomPagination: React.FunctionComponent<MergedPropsType> = props => {
    const { count, onChange, isMinMdScreen, page } = props

    return (
        <div className={classNames('pagination-container d-flex justify-content-end my-4', {
            'justify-content-end': isMinMdScreen,
            'justify-content-center': !isMinMdScreen
        })}>
            <Pagination
                page={page}
                defaultPage={page}
                count={count}
                onChange={onChange} />
        </div>
    )
}

export default CustomPagination