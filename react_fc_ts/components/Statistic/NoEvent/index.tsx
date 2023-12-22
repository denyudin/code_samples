import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { push } from 'connected-react-router'

import { IProps, IConnectedDispatch }  from './types'
import { statisticMessages } from 'components/Statistic/consts'
import { Animation, Button, CONFUSED_MASCOT } from 'components/SharedComponents'
import { IGenerateStepsUrlPayload } from 'components/Steps/StepsComponents/types'
import { generateStepUrl } from 'components/Steps/StepsComponents/utils'


const NoEvent: React.FunctionComponent<IProps> = (props) => {
    const { message , toCreateEvent} = props

    return (
        <div className={'no-event-block d-flex justify-content-center align-items-center flex-column mt-5 mx-5'}>
            <div className={'w-100 d-flex justify-content-center text-center mb-5'}>
                { message }
            </div>
            <Animation animationType={CONFUSED_MASCOT}/>
            <div className={'mt-5'}>
                <Button mods={'cta|blue'} onClick={toCreateEvent}>
                    <b>
                        <FormattedMessage {...statisticMessages.create_new_event } />
                    </b>
                </Button>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch): IConnectedDispatch => {
    return {
        toCreateEvent: () => {
            const urlPayload: IGenerateStepsUrlPayload = {
                match: {},
                type: 'add'
            }
            const steps = ['event_type']
            const url = generateStepUrl(steps, 0, urlPayload)

            dispatch(push(url))
        }
    }
}
export default connect(null, mapDispatchToProps)(NoEvent) as any
