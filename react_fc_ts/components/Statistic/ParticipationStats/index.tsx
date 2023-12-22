import React from 'react'
import classNames from 'classnames'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'

import { statisticMessages } from 'components/Statistic/consts'
import { IProps } from './types'
import { getStatisticStatusIcon } from 'components/Statistic/utils';

type MergedPropsType = IProps & InjectedIntlProps
const ParticipationStats: React.FunctionComponent<MergedPropsType> = props => {
    const { statusList, isMinMdScreen, totalInvited, intl } = props
    const renderDesktop = () => {
        return (
            <div className={'d-flex flex-wrap py-4 justify-content-center align-items-center'}>
                {
                    !!totalInvited && <div>
                        <FormattedMessage {...statisticMessages.total_invited} />:
                        <b className={'ml-2'}>{totalInvited}</b>
                    </div>
                }
                {
                    statusList.map((status, key) => {
                        const statusName = intl.formatMessage(statisticMessages[status.name])

                        return (
                            <div key={key}
                                 className={classNames('d-flex',{
                                     'ml-5': isMinMdScreen
                                 })}>
                                <div className={'mr-3'}>
                                    {getStatisticStatusIcon(status.name)}
                                </div>
                                { statusName }:
                                <b className={'ml-2'}>{ status.count }</b>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    if (isMinMdScreen) {
        return renderDesktop()
    }

    return (
        <div className={'d-flex flex-wrap py-4 justify-content-around align-items-center'}>
            {
                !!totalInvited && <div className={'w-100 d-flex justify-content-center mb-3'}>
                    <FormattedMessage {...statisticMessages.total_invited} />:
                    <b className={'ml-2'}>{totalInvited}</b>
                </div>
            }
            <table>
                <tbody>
                    {
                        statusList.map((status, key) => {
                            if (key!==0 && key%2!==0) {
                                return
                            }
                            const statuses = [statusList[key], statusList[key+1]]

                            return (
                                <tr key={key}>
                                    {
                                        statuses.map((rowStatus, key) => {
                                            if (!rowStatus) {
                                                return <td key={key} className={'d-flex w-50 d-flex align-items-center'}/>
                                            }
                                            const statusName = intl.formatMessage(statisticMessages[rowStatus.name])

                                            return (
                                                <React.Fragment key={key}>
                                                    <td>
                                                        {getStatisticStatusIcon(rowStatus.name)}
                                                    </td>
                                                    <td>
                                                        { statusName }:
                                                        <b className={'ml-2'}>{ rowStatus.count }</b>
                                                    </td>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default injectIntl(ParticipationStats)
