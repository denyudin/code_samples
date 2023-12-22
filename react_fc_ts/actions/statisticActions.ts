import {
    SET_STATISTIC_PRESETS,
    CLEAR_STATISTIC_PRESETS,
    GET_TARGET_GROUPS_START,
    GET_TARGET_GROUPS_SUCCESS,
    GET_TARGET_GROUPS_CANCEL,
    ADD_TARGET_GROUP_START,
    ADD_TARGET_GROUP_SUCCESS,
    ADD_TARGET_GROUP_CANCEL,
    REMOVE_TARGET_GROUP_START,
    REMOVE_TARGET_GROUP_SUCCESS,
    REMOVE_TARGET_GROUP_CANCEL,
    GET_ROLES_START,
    GET_ROLES_SUCCESS,
    GET_ROLES_CANCEL,
    GET_ROLES_TEMPLATES_START,
    GET_ROLES_TEMPLATES_SUCCESS,
    GET_ROLES_TEMPLATES_CANCEL,
    ADD_EVENT_ROLE_START,
    ADD_EVENT_ROLE_SUCCESS,
    ADD_EVENT_ROLE_CANCEL,
    UPDATE_EVENT_ROLE_START,
    UPDATE_EVENT_ROLE_SUCCESS,
    UPDATE_EVENT_ROLE_CANCEL,
    DELETE_EVENT_ROLE_SUCCESS,
    DELETE_EVENT_ROLE_START,
    DELETE_EVENT_ROLE_CANCEL,
    GET_ASSIGNED_USERS_START,
    GET_ASSIGNED_USERS_SUCCESS,
    GET_ASSIGNED_USERS_CANCEL,
    ASSIGN_USER_ROLE_SUCCESS,
    ASSIGN_USER_ROLE_START,
    ASSIGN_USER_ROLE_CANCEL,
    UNASSIGN_USER_ROLE_START,
    UNASSIGN_USER_ROLE_SUCCESS,
    UNASSIGN_USER_ROLE_CANCEL,
    SET_STATISTIC_VALUE,
    INVITE_PEOPLE_START,
    INVITE_PEOPLE_SUCCESS,
    INVITE_PEOPLE_CANCEL,
    SET_STATISTIC_TABLE_DATA,
    SET_STATISTIC_STATUS_MESSAGE,
    SET_STATISTIC_STATUS_MESSAGE_SUCCESS,
    SET_STATISTIC_STATUS_MESSAGE_CANCEL,
    ASSIGN_USER_ROLE_CALENDAR_START,
    ASSIGN_USER_ROLE_CALENDAR_SUCCESS,
    ASSIGN_USER_ROLE_CALENDAR_CANCEL,
    UNASSIGN_USER_ROLE_CALENDAR_START,
    UNASSIGN_USER_ROLE_CALENDAR_SUCCESS,
    UNASSIGN_USER_ROLE_CALENDAR_CANCEL
} from 'actions/types'
import { serverRequest } from 'services/serverService'
import { IGroupSeasonIds } from 'model/Group'
import { IStatisticRole } from 'model/Role'
import { StatisticStatuses } from 'components/Statistic/consts'

export const setStatisticPresets = (presets) => {
    return (dispatch) => {
        dispatch({ type: SET_STATISTIC_PRESETS, payload: presets })
    }
}

export const clearStatisticPresets = () => {
    return (dispatch) => {
        dispatch({ type: CLEAR_STATISTIC_PRESETS })
    }
}

export function getTargetGroups(eventId): (dispatch) => Promise<void> {
    return function(dispatch): Promise<void> {
        dispatch({ type: GET_TARGET_GROUPS_START })

        return serverRequest({
            endpoint: `/events/${eventId}/targets`,
            verb: 'GET'
        }).then(data => {
                dispatch({
                    type: GET_TARGET_GROUPS_SUCCESS,
                    payload: data
                })

                return data
            })
            .catch(error => {
                dispatch({
                    type: GET_TARGET_GROUPS_CANCEL,
                    payload: error
                })
            })
    }
}

export function setStatisticValue(props: { key:string, value:any }): (dispatch) => void {
    return function(dispatch) {
        dispatch({
            type: SET_STATISTIC_VALUE,
            payload: props
        })
    }
}

export interface IChangeTargetGroup {
    eventId: number | string,
    body: IGroupSeasonIds
}
export function addTargetGroup(props: IChangeTargetGroup): (dispatch) => Promise<any> {
    const { eventId, body } = props
    return function(dispatch): Promise<any> {
        dispatch({ type: ADD_TARGET_GROUP_START })

        return serverRequest({
            endpoint: `/events/${eventId}/targets`,
            verb: 'POST',
            body: body
        }).then(() => {
                dispatch({
                    type: ADD_TARGET_GROUP_SUCCESS,
                    payload: body
                })

                return body
            })
            .catch(error => {
                dispatch({
                    type: ADD_TARGET_GROUP_CANCEL,
                    payload: error
                })
            })
    }
}

export function removeTargetGroup(props: IChangeTargetGroup): (dispatch) => Promise<any> {
    const { eventId, body } = props
    return function(dispatch): Promise<any> {
        dispatch({ type: REMOVE_TARGET_GROUP_START })

        return serverRequest({
            endpoint: `/events/${eventId}/targets`,
            verb: 'DELETE',
            body
        }).then(() => {
                dispatch({
                    type: REMOVE_TARGET_GROUP_SUCCESS,
                    payload: body
                })

                return body
            })
            .catch(error => {
                dispatch({
                    type: REMOVE_TARGET_GROUP_CANCEL,
                    payload: error
                })
            })
    }
}

export function getEventRoles(eventId): (dispatch) => Promise<any> {
    return function(dispatch): Promise<any> {
        dispatch({ type: GET_ROLES_START })

        return serverRequest({
            endpoint: `/events/${eventId}/roles`,
            verb: 'GET'
        }).then((data) => {
                dispatch({
                    type: GET_ROLES_SUCCESS,
                    payload: data
                })

                return data
            })
            .catch(error => {
                dispatch({
                    type: GET_ROLES_CANCEL,
                    payload: error
                })
            })
    }
}

export function getEventTemplateRoles(eventId): (dispatch) => Promise<any> {
    return function(dispatch): Promise<any> {
        dispatch({ type: GET_ROLES_TEMPLATES_START })

        return serverRequest({
            endpoint: `/events/${eventId}/roles/templates`,
            verb: 'GET'
        }).then((data) => {
                dispatch({
                    type: GET_ROLES_TEMPLATES_SUCCESS,
                    payload: data
                })

                return data
            })
            .catch(error => {
                dispatch({
                    type: GET_ROLES_TEMPLATES_CANCEL,
                    payload: error
                })
            })
    }
}
export interface IAddEventRole {
    eventId: string | number,
    role: Partial<IStatisticRole>
}
export function addEventRole(props:IAddEventRole): (dispatch) => Promise<any> {
    const { eventId, role } = props

    return function(dispatch): Promise<any> {
        dispatch({ type: ADD_EVENT_ROLE_START })

        return serverRequest({
            endpoint: `/events/${eventId}/roles`,
            verb: 'POST',
            body: role
        }).then((data) => {
            dispatch({
                type: ADD_EVENT_ROLE_SUCCESS,
                payload: data
            })

            return data
        })
            .catch(error => {
                dispatch({
                    type: ADD_EVENT_ROLE_CANCEL,
                    payload: error
                })
            })
    }
}

export function updateEventRole(props:IAddEventRole): (dispatch) => Promise<any> {
    const { eventId, role } = props

    return function(dispatch): Promise<any> {
        dispatch({ type: UPDATE_EVENT_ROLE_START })

        return serverRequest({
            endpoint: `/events/${eventId}/roles/${role.id}`,
            verb: 'PATCH',
            body: role
        }).then((data) => {
            dispatch({
                type: UPDATE_EVENT_ROLE_SUCCESS,
                payload: data
            })

            return data
        })
            .catch(error => {
                dispatch({
                    type: UPDATE_EVENT_ROLE_CANCEL,
                    payload: error
                })
            })
    }
}

export interface IDeleteEventRole {
    eventId: string | number
    roleId: string | number
}
export function deleteEventRole(props:IDeleteEventRole): (dispatch) => Promise<any> {
    const { eventId, roleId } = props

    return function(dispatch): Promise<any> {
        dispatch({ type: DELETE_EVENT_ROLE_START })

        return serverRequest({
            endpoint: `/events/${eventId}/roles/${roleId}`,
            verb: 'DELETE',
        }).then((data) => {
            dispatch({
                type: DELETE_EVENT_ROLE_SUCCESS,
                payload: roleId
            })

            return data
        })
            .catch(error => {
                dispatch({
                    type: DELETE_EVENT_ROLE_CANCEL,
                    payload: error
                })
            })
    }
}

export function getAssignedUsers(eventId: number | string): (dispatch) => Promise<any> {

    return function(dispatch): Promise<any> {
        dispatch({ type: GET_ASSIGNED_USERS_START })

        return serverRequest({
            endpoint: `/events/${eventId}/users`,
            verb: 'GET',
        }).then((data) => {
            dispatch({
                type: GET_ASSIGNED_USERS_SUCCESS,
                payload: data
            })

            return data
        })
            .catch(error => {
                dispatch({
                    type: GET_ASSIGNED_USERS_CANCEL,
                    payload: error
                })
            })
    }
}

export interface IAssignUserRole {
    eventId: number | string
    userId: number | string
    roleId: number | string
    isCalendar?: boolean
}
export function assignUserRole(props: IAssignUserRole): (dispatch) => Promise<any> {
    const { eventId, roleId, userId, isCalendar } = props

    return function(dispatch): Promise<any> {
        dispatch({ type: isCalendar ? ASSIGN_USER_ROLE_CALENDAR_START : ASSIGN_USER_ROLE_START })

        return serverRequest({
            endpoint: `/events/${eventId}/roles/${roleId}/users/${userId}`,
            verb: 'POST',
        }).then((data) => {
            dispatch({
                type: isCalendar ? ASSIGN_USER_ROLE_CALENDAR_SUCCESS : ASSIGN_USER_ROLE_SUCCESS,
                payload: props
            })

            return data
        })
            .catch(error => {
                dispatch({
                    type: isCalendar ? ASSIGN_USER_ROLE_CALENDAR_CANCEL : ASSIGN_USER_ROLE_CANCEL,
                    payload: error
                })
            })
    }
}

export function unassignUserRole(props: IAssignUserRole): (dispatch) => Promise<any> {
    const { eventId, roleId, userId, isCalendar } = props

    return function(dispatch): Promise<any> {
        dispatch({ type: isCalendar ? UNASSIGN_USER_ROLE_CALENDAR_START : UNASSIGN_USER_ROLE_START })

        return serverRequest({
            endpoint: `/events/${eventId}/roles/${roleId}/users/${userId}`,
            verb: 'DELETE',
        }).then((data) => {
            dispatch({
                type: isCalendar ? UNASSIGN_USER_ROLE_CALENDAR_SUCCESS: UNASSIGN_USER_ROLE_SUCCESS,
                payload: props
            })

            return data
        })
            .catch(error => {
                dispatch({
                    type: isCalendar ? UNASSIGN_USER_ROLE_CALENDAR_CANCEL : UNASSIGN_USER_ROLE_CANCEL,
                    payload: error
                })
            })
    }
}

export interface IInvitePeople {
    only_people_with_role: boolean
    resend_invitations: boolean
    reset_statistic: boolean
    schedule_automatic_invitation: boolean
    send_automatic_reminder: boolean
    send_invitation_now: boolean
    send_push_notifications: boolean
    users?: number[]
}
export function invitePeople(props:IInvitePeople, eventId: number | string): (dispatch) => Promise<any> {
    return function(dispatch): Promise<any> {
        dispatch({ type: INVITE_PEOPLE_START })

        return serverRequest({
            endpoint: `/events/${eventId}/invitations`,
            verb: 'POST',
            body: props
        }).then((data) => {
            dispatch({
                type: INVITE_PEOPLE_SUCCESS
            })

            return data
        })
            .catch(error => {
                dispatch({
                    type: INVITE_PEOPLE_CANCEL,
                    payload: error
                })
            })
    }
}

export interface IByEventTableData {
    [key: string]: {
        usersList: []
        eventRoles: []
        pagination: {
            perPage: number
            totalPages: number
            page: number
        }
    }
}
export interface IStatisticTablesData {
    byEventTableData?: {}
    byGroupTableData?: {}
}
export const setStatisticTablesData = (props:IStatisticTablesData) => (dispatch) => {
    const payload = {
        byEventTableData: {},
        byGroupTableData: {},
        ...props
    }

    dispatch({
        type: SET_STATISTIC_TABLE_DATA,
        payload
    })
}

export interface IStatisticStatusMessage {
    eventId: number | string
    userId: number | string
    type?: StatisticStatuses.STATISTIC_STATUS_NO_ANSWER | StatisticStatuses.STATISTIC_STATUS_EXCUSED |
        StatisticStatuses.STATISTIC_STATUS_INJURED | StatisticStatuses.STATISTIC_STATUS_MISSING |
        StatisticStatuses.STATISTIC_STATUS_PARTICIPATE | StatisticStatuses.STATISTIC_STATUS_LATE
    message?: string
}
export const setStatisticStatusMessage = (props: IStatisticStatusMessage) => dispatch => {
    const { eventId, userId, type, message } = props
    dispatch({ type: SET_STATISTIC_STATUS_MESSAGE })

    return serverRequest({
        endpoint: `/events/${eventId}/users/${userId}`,
        verb: 'POST',
        body: {
            ...message?{ comment: message }:{},
            ...type?{ type }:{}
        }
    }).then((data) => {
        dispatch({
            type: SET_STATISTIC_STATUS_MESSAGE_SUCCESS,
            payload: {
                ...props,
                response:data
            }
        })

        return data
    }).catch(error => {
        dispatch({
            type: SET_STATISTIC_STATUS_MESSAGE_CANCEL,
            payload: error
        })
    })
}
