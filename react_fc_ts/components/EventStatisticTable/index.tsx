import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { get, uniq } from 'lodash-es'
import chain from 'utils/chain'
import { autofill, change, Field } from 'redux-form'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { push } from 'connected-react-router'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'

import { setSubstepIndex as setSubstepIndexAction, setSubsteps as setSubstepsAction } from 'actions/stepsActions'
import {
    clearStatisticPresets as clearStatisticPresetsAction,
    getAssignedUsers as getAssignedUsersAction,
    getEventRoles as getEventRolesAction,
    getTargetGroups as getTargetGroupsAction,
    setStatisticTablesData as setStatisticTablesDataAction
} from 'actions/statisticActions'
import { IConnectedDispatch, IConnectedState, IProps } from './types'
import { Button, Loader } from 'components/SharedComponents'
import { stepsMessages } from 'components/Steps/messages'
import CheckboxRedux from 'components/Form/CheckboxRedux'
import FormWrapper from 'components/Form/Material/FormWraper'
import { generateStepUrl } from 'components/Steps/StepsComponents/utils'
import NoEvent from 'components/Statistic/NoEvent'
import {
    STATISTIC_FORM_STATS_FORM,
    STATISTIC_STATUSES,
    ROLE_USER_PREFIX,
    statisticMessages,
    StatisticStatuses
} from 'components/Statistic/consts'
import { chatIcon, editIcon } from 'components/Steps/StepsComponents/consts'
import { DATE_TIME_EU_FORMAT } from 'components/Form/formDateUtils'
import { IGenerateStepsUrlPayload } from 'components/Steps/StepsComponents/types'
import ParticipationStats from 'components/Statistic/ParticipationStats'
import CustomPagination from 'components/Statistic/CustomPagination'
import CommentsModal from 'components/Statistic/Chat/CommentsModal'
import {
    generateDataForTableByEvent,
    getAllUserRolesListForEvent,
    getStatisticStatusIcon,
    getCurrentEventPage
} from 'components/Statistic/utils'
import StatisticStatusDropdown from 'components/Statistic/StatisticStatusDropdown'
import { EVENT_TYPE_EVENT, EVENT_TYPE_GAME, EVENT_TYPE_PRACTICE } from 'model/Event'
import { generateUserRoleName } from 'Steps/StepsComponents/Statistic/utils'
import { getMembers as getMembersAction } from 'actions/memberActions'
import { getEventName } from 'utils/helpers'

import './styles.scss'


type MergedPropsType = IProps & InjectedIntlProps
const EventStatisticTable: React.FunctionComponent<MergedPropsType> = props => {
    const { eventsExist, currentEvent, toEditEvent, isMinMdScreen,
        changeField, statusAction, formValues, setStatisticTablesData,
        byEventTableData, getEventRoles, getAssignedUsers, getMembers, getTargetGroups, currentEventId,
        unregisterField, fetchEvents, eventsGetPending, presets, clearStatisticPresets, intl, toEditGame,
        toEditTraining } = props
    const [selectedComments, setSelectedComments] = useState(null)
    const [loading, setLoading] = useState(true)
    const [initialLoading, setInitialLoading] = useState(true)

    const eventData = get(
        byEventTableData,
        currentEventId,
        {
            usersList: [],
            eventRoles: [],
            allUserRolesList: [],
            pagination: {}
        })
    const { usersList, eventRoles } = eventData
    const currentPageData = getCurrentEventPage(eventData)

    useEffect(()=>{
        setInitialLoading(true)
        fetchEvents({
            _types: [EVENT_TYPE_EVENT],
            _dir: 'both'
        }).then((data) => {
            const firstEventId = get(data, '[0].id','')
            const eventId = get(presets, 'event_id', '') || firstEventId
            changeField('event_id', eventId)
            clearStatisticPresets()
            setInitialLoading(false)
        })
    },[null])

    useEffect(()=>{
        const noCurrentEvent = !currentEventId
        const membersDataFound = get(byEventTableData, [currentEventId, 'usersList'], []).length

        if (noCurrentEvent) {
            return
        }

        if (membersDataFound) {
            setLoading(false)
            return
        }

        (async () => {
            await fetchEventData()
        })()

        clearSelected()
    },[currentEventId])

    const clearSelected = () => {
        Object.keys(formValues).map(fieldName => {
            if (fieldName.startsWith(ROLE_USER_PREFIX)) {
                unregisterField(fieldName)
            }
        })
        changeField('select-all-users', false)
    }

    if (!eventsExist && !loading && !initialLoading && !eventsGetPending) {
        let message

        switch (formValues.event_type) {
            case EVENT_TYPE_PRACTICE: message = statisticMessages.you_do_not_have_practice; break
            case EVENT_TYPE_GAME: message = statisticMessages.you_do_not_have_games; break
            case EVENT_TYPE_EVENT:
            default: message = statisticMessages.you_do_not_have_events; break
        }

        return (
            <NoEvent
                message={<FormattedMessage {...message} />}
            />
        )
    }

    const fetchEventData = async() => {
        setLoading(true)
        const eventRoles = await getEventRoles(currentEventId)
        const assignedUsers = await getAssignedUsers(currentEventId)
        const eventUserRoles =get(assignedUsers, 'event_users_roles', [])
        const statistic =get(assignedUsers, 'statistic', [])

        const eventTargetGroups = await getTargetGroups(currentEventId)
        let eventMembers = []
        const response = await Promise.all(
            eventTargetGroups.map(group=>{
                const groupId = get(group, 'group.id')
                const seasonId = get(group, 'season.id')

                return getMembers({ groupId, seasonId, limit:0 })
            })
        )
        response.map(({ data }) => (eventMembers = uniq([...eventMembers, ...data])))

        const usersList = eventMembers.map(member => {
            const { type, comments } = statistic.find(({user})=> user.id === member.id) || {}
            return {
                ...member,
                statistic: {
                    type,
                    comments
                },
                roles: eventUserRoles
                    .filter(userRole => userRole.user === member.id)
                    .map(userRole => userRole.role)
            }
        })

        const allUserRolesList = getAllUserRolesListForEvent(usersList)
        const byEventTableDataNew = generateDataForTableByEvent({
            byEventTableData,
            currentEventId,
            usersList,
            eventRoles,
            allUserRolesList
        } as any)

        setStatisticTablesData({ byEventTableData: byEventTableDataNew })

        setLoading(false)
    }

    const handleChangeSelectAll = value => {
        let rolesList = [...eventRoles]
        const hasNoRolesUsers = usersList.find(({roles})=>!roles.length)

        if (hasNoRolesUsers) {
            rolesList.push({ id: null })
        }

        chain(rolesList).map(role => {
            const roleUsers = usersList.filter(user =>
                role.id ? user.roles.includes(role.id) : !user.roles.length
            )
            roleUsers.map(user => {
                changeField(generateUserRoleName(role, user), !!value)
            })
        })
    }

    const onEdit = () => {
        const { type, season={}, league={}, id } = currentEvent

        switch (type){
            case EVENT_TYPE_EVENT:
                toEditEvent(currentEventId)
                break
            case EVENT_TYPE_GAME:
                const entityId = `${league.id},${season.id},${id}`
                toEditGame(entityId)
                break
            case EVENT_TYPE_PRACTICE:
                toEditTraining(id)
                break
            default: break
        }
    }

    const renderCurrentEvent = () => {
        if (!currentEvent) {
            return null
        }

        const startTime = moment(currentEvent.start_date).format(DATE_TIME_EU_FORMAT)
        const eventTitle = getEventName(currentEvent, intl)

        return (
            <div className={classNames('d-flex align-items-center mt-5 ml-4')}>
                <div className={'d-flex flex-column mr-4'}>
                    <b>{ eventTitle }</b>
                    <span className={'grey-text'}>{ startTime }</span>
                </div>
                <Button
                    mods={'grey|icon'}
                    onClick={onEdit}
                >
                    <img src={editIcon} />
                </Button>
            </div>
        )
    }

    const renderHead = () => {
        return (
            <div className={classNames('mt-4 d-flex w-100 align-items-center',{
                'ml-4 main-head--desktop': isMinMdScreen,
                'ml-4 main-head--mobile': !isMinMdScreen,
            })}>
                <Field component={CheckboxRedux}
                       name='select-all-users'
                       id='select-all-users'
                       onChange={(e,v) => handleChangeSelectAll(v)}
                       labelT={<span className='grey-text ml-2'>
                               <FormattedMessage {...stepsMessages.select_all} />
                           </span>}
                />
                { !!isMinMdScreen && <div>{ <FormattedMessage {...statisticMessages.participation } /> }</div> }
                { !!isMinMdScreen && <div>{ <FormattedMessage {...statisticMessages.message } /> }</div> }
            </div>
        )
    }

    const renderCommentsButton = (user) => {
        const comments = user?.statistic?.comments || []

        return !!comments.length && <div className={'statistic-table--comments'}>
            <Button
                onClick={()=>setSelectedComments(comments)}
                mods={'icon|z-index-1|absolute-center|text|no-underline'}
            >
                <img src={chatIcon} className={'max-25'}/>
            </Button>
        </div>
    }

    const renderStatusIcon = (user) => {
        const participation = user?.statistic?.type

        return (
            <div className={'d-flex justify-content-center align-items-center'}>
                <StatisticStatusDropdown
                    isMaterial={true}
                    mods={'text|no-underline'}
                    currentValue={participation}
                    onSelect={value => statusAction({
                        type: value,
                        event: currentEvent,
                        userId: user.id,
                        messages: user?.statistic?.comments
                    })}
                    customLabel={getStatisticStatusIcon(participation)}
                />
            </div>
        )
    }
    const renderDesktopRow = (user, role, key) => {
        const userName = generateUserRoleName(role, user)

        return (
            <TableRow key={key}>
                <TableCell className={'py-3'}>
                    <div className={'d-flex align-items-center'}>
                        <Field component={CheckboxRedux}
                               name={userName}
                               id={userName}
                        />
                        <div className={'ml-2 d-flex'}>
                            <span className={'mr-2'}>{ user.firstname }</span>
                            <span>{ user.lastname }</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className={'py-3 d-flex w-100 justify-content-center statistic-table--cell-content'}>
                    { renderStatusIcon(user) }
                    { renderCommentsButton(user) }
                </TableCell>
                <TableCell className={'py-3'}> { user?.statistic?.comments?.[0]?.comment } </TableCell>
            </TableRow>
        )
    }

    const renderMobileRow = (user, role, key) => {
        const userName = generateUserRoleName(role, user)

        return (
            <TableRow key={key}>
                <TableCell className={'py-3'}>
                    <div className={'d-flex align-items-center'}>
                        <Field component={CheckboxRedux}
                               name={userName}
                               id={userName}
                        />
                        <div className={'ml-2 d-flex'}>
                            <span className={'mr-2'}>{ user.firstname }</span>
                            <span>{ user.lastname }</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className={'py-3 d-flex w-100 justify-content-center statistic-table--cell-content'}>
                    { renderStatusIcon(user) }
                    { renderCommentsButton(user) }
                </TableCell>
            </TableRow>
        )
    }

    const renderTableContent = () => {

        return (
            <div className={'statistic-table--event'}>
                { renderHead() }
                {
                    Object.keys(currentPageData).map((roleId, key) => {
                        const { role, members, membersTotalCount } = currentPageData[roleId]
                        const {
                            spots_limit_number: spots,
                            spots_limit_enabled: limitedRole
                        } = role || {}

                        return (
                            <Table key={key} className={classNames('role-table',{
                                'role-table--desktop': isMinMdScreen,
                                'role-table--mobile': !isMinMdScreen,
                            })}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <div className={'my-4'}>
                                                {
                                                    role ?
                                                        <b>{role.name}</b>
                                                        :
                                                        <b><FormattedMessage {...statisticMessages.no_role}/></b>
                                                }
                                                {
                                                    role && spots && limitedRole &&
                                                    <span className={'ml-2 grey-text'}>
                                                            <b>{`(${spots}/${membersTotalCount})`}</b>
                                                          </span>
                                                }
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        members.map((user, key) =>
                                            isMinMdScreen ?
                                                renderDesktopRow(user, role, key)
                                                :
                                                renderMobileRow(user, role, key)
                                        )
                                    }
                                </TableBody>
                            </Table>
                        )
                    })
                }
            </div>
        )
    }

    const renderPagination = () => {
        const pagination = get(byEventTableData, [currentEventId, 'pagination'], {})
        const pagesCount = get(pagination, 'totalPages', 1)
        const page = get(pagination, 'page', 1)

        const onPageChange = (event, page) => {
            setStatisticTablesData({
                byEventTableData: {
                    ...byEventTableData,
                    [currentEventId]: {
                        ...byEventTableData[currentEventId],
                        pagination:{
                            ...pagination,
                            page: page
                        }
                    },
                }
            })
        }

        return (
            <CustomPagination
                page={page}
                count={pagesCount}
                onChange={onPageChange}
                isMinMdScreen={isMinMdScreen}
            />
        )
    }

    const renderParticipationStats = () => {
        const totalInvited = usersList.length
        const statusList = STATISTIC_STATUSES.map(status => {
            let count = 0
            if (status === StatisticStatuses.STATISTIC_STATUS_NO_ANSWER) {
                count = usersList.filter(user => user?.statistic?.type === '').length
            } else {
                count = usersList.filter(user => user?.statistic?.type === status).length
            }

            return {
                name: status,
                count
            }
        })

        return <ParticipationStats
            isMinMdScreen={isMinMdScreen}
            statusList={statusList}
            totalInvited={totalInvited}
        />
    }

    return (
        <FormWrapper>
            <CommentsModal
                isOpen={!!selectedComments}
                selectedComments={selectedComments}
                setIsOpen={setSelectedComments}
            />
            { renderCurrentEvent() }
            { (loading || initialLoading || eventsGetPending) && <Loader size={50} mods='on-top-of-form' />}
            { !loading && renderTableContent() }
            { !loading && renderPagination() }
            { !loading && renderParticipationStats() }
        </FormWrapper>
    )
}

const mapStateToProps = (state): IConnectedState => {
    const {
        eventsReducer: {
            events,
            shortEvents,
            eventsGetPending
        },
        form: forms,
        statisticReducer: {
            byEventTableData,
            presets
        }
    } = state

    const formValues = get(forms, [STATISTIC_FORM_STATS_FORM, 'values'], {})
    const eventsExist = eventsGetPending ? false : !!shortEvents.length
    const currentEvent = events.find(event => event.id === parseInt(get(formValues,'event_id', null)))
    const currentEventId = get(currentEvent, 'id', null)

    return {
        presets,
        formValues,
        eventsExist,
        currentEvent,
        currentEventId,
        byEventTableData,
        eventsGetPending
    }
}

const mapDispatchToProps = (dispatch): IConnectedDispatch => {
    return {
        getMembers: params => dispatch(getMembersAction(params)),
        getTargetGroups: (eventId) => dispatch(getTargetGroupsAction(eventId)),
        getEventRoles: (eventId) => dispatch(getEventRolesAction(eventId)),
        getAssignedUsers: (eventId) => dispatch(getAssignedUsersAction(eventId)),
        toEditEvent: (eventId) => {
            const urlPayload: IGenerateStepsUrlPayload = {
                match: {
                    params: {
                        entityId: eventId
                    }
                },
                type: 'edit'
            }
            const steps = ['event_select', 'edit_forms', 'edit_payments']
            const url = generateStepUrl(steps, 0, urlPayload)

            dispatch(setSubstepsAction('event_select', ['event_info']))
            dispatch(setSubstepIndexAction('event_select', 0))
            dispatch(push(url))
        },
        toEditGame: (entityId) => {
            const urlPayload: IGenerateStepsUrlPayload = {
                match: {
                    params: {
                        entityId
                    }
                },
                type: 'edit'
            }
            const steps = ['edit_leagues_games']
            const url = generateStepUrl(steps, 0, urlPayload)

            dispatch(push(url))
        },
        toEditTraining: (entityId) => {
            const urlPayload: IGenerateStepsUrlPayload = {
                match: {
                    params: {
                        entityId
                    }
                },
                type: 'edit'
            }
            const steps = ['edit_trainings']
            const url = generateStepUrl(steps, 0, urlPayload)

            dispatch(push(url))
        },
        changeField: (field, value) => dispatch(change(STATISTIC_FORM_STATS_FORM, field, value)),
        setStatisticTablesData: props => dispatch(setStatisticTablesDataAction(props)),
        unregisterField: fieldName => dispatch(autofill(STATISTIC_FORM_STATS_FORM, fieldName, undefined)),
        clearStatisticPresets:() => dispatch(clearStatisticPresetsAction())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EventStatisticTable)) as any
