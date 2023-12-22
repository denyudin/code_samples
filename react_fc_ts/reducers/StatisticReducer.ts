import { get, uniq, without } from 'lodash-es'
import {
    SET_STATISTIC_PRESETS,
    CLEAR_STATISTIC_PRESETS,
    GET_TARGET_GROUPS_START,
    GET_TARGET_GROUPS_SUCCESS,
    GET_TARGET_GROUPS_CANCEL,
    ADD_TARGET_GROUP_SUCCESS,
    REMOVE_TARGET_GROUP_SUCCESS,
    GET_ROLES_START,
    GET_ROLES_SUCCESS,
    GET_ROLES_CANCEL,
    GET_ROLES_TEMPLATES_SUCCESS,
    ADD_EVENT_ROLE_SUCCESS,
    UPDATE_EVENT_ROLE_SUCCESS,
    DELETE_EVENT_ROLE_SUCCESS,
    GET_ASSIGNED_USERS_SUCCESS,
    SET_STATISTIC_VALUE,
    SET_STATISTIC_TABLE_DATA,
    ASSIGN_USER_ROLE_SUCCESS,
    UNASSIGN_USER_ROLE_SUCCESS, SET_STATISTIC_STATUS_MESSAGE_SUCCESS, UNASSIGN_USER_ROLE_CALENDAR_SUCCESS, ASSIGN_USER_ROLE_CALENDAR_SUCCESS,
} from 'actions/types'
import { generateDataForTableByEvent, getAllUserRolesListForEvent } from 'components/Statistic/utils';

const INITIAL_STATE = {
    presets: {
        statistic_by: null,
        event_type: null,
        event_id: null
    },
    isLoading:{
        targetGroupsLoading: false,
        rolesLoading: false
    },
    targetGroups: null,
    eventRoles: null,
    eventTemplateRoles: [],
    assignedUsers: {},
    byEventTableData: {},
    byGroupTableData: {
        groupTableFilters: {
            'event': true,
            'game': true,
            'training': true,
            'invitation': false
        }
    }
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_STATISTIC_PRESETS: {
            return {
                ...state,
                presets: { ...state.presets, ...action.payload }
            }
        }
        case GET_TARGET_GROUPS_START:
            return {
                ...state,
                isLoading: {
                    ...state.isLoading,
                    targetGroupsLoading: true
                }
            }
        case CLEAR_STATISTIC_PRESETS:
            return {
                ...state,
                presets: INITIAL_STATE.presets
            }
        case GET_TARGET_GROUPS_SUCCESS:
            const targetGroups = action.payload

            return {
                ...state,
                targetGroups,
                isLoading: {
                    ...state.isLoading,
                    targetGroupsLoading: false
                }
            }
        case GET_TARGET_GROUPS_CANCEL:
            return {
                ...state,
                isLoading: {
                    ...state.isLoading,
                    targetGroupsLoading: false
                }
            }
        case ADD_TARGET_GROUP_SUCCESS:
            return {
                ...state,
                targetGroups: [
                    ...state.targetGroups,
                    action.payload
                ],
            }
        case REMOVE_TARGET_GROUP_SUCCESS:
            const { group, season } = action.payload
            const newTargetGroups = state.targetGroups.filter(item => (
                (item.group.id !== group.id && item.season.id !== season.id) ||
                (item.group.id !== group.id && item.season.id === season.id) ||
                (item.group.id === group.id && item.season.id !== season.id)
            ))

            return {
                ...state,
                targetGroups: newTargetGroups
            }
        case GET_ROLES_START:
            return {
                ...state,
                isLoading: {
                    ...state.isLoading,
                    rolesLoading: true
                }
            }
        case GET_ROLES_SUCCESS:
            return {
                ...state,
                eventRoles: action.payload,
                isLoading: {
                    ...state.isLoading,
                    rolesLoading: false
                }
            }
        case GET_ROLES_CANCEL:
            return {
                ...state,
                isLoading: {
                    ...state.isLoading,
                    rolesLoading: false
                }
            }
        case ASSIGN_USER_ROLE_CALENDAR_SUCCESS: {
            return {
                ...state,
                eventRoles: state.eventRoles.map(role => {
                    if (role.id === Number(action.payload.roleId)) {
                        return {
                            ...role,
                            nb_places_taken: role.nb_places_taken + 1
                        }
                    }
                    return role
                }),
            }
        }
        case UNASSIGN_USER_ROLE_CALENDAR_SUCCESS: {
            return {
                ...state,
                eventRoles: state.eventRoles.map(role => {
                    if (role.id === Number(action.payload.roleId)) {
                        return {
                            ...role,
                            nb_places_taken: role.nb_places_taken - 1
                        }
                    }
                    return role
                }),
            }
        }

        case GET_ROLES_TEMPLATES_SUCCESS:
            return {
                ...state,
                eventTemplateRoles: action.payload
            }
        case ADD_EVENT_ROLE_SUCCESS: {
            const newRole = action.payload
            const existingEventRoles = state.eventRoles.filter(event => event.id !== newRole.id)

            return {
                ...state,
                eventRoles: [
                    ...existingEventRoles,
                    newRole
                ]
            }
        }
        case UPDATE_EVENT_ROLE_SUCCESS: {
            const updatedRole = action.payload
            const existingEventRoles = state.eventRoles.filter(event => event.id !== updatedRole.id)

            return {
                ...state,
                eventRoles: [
                    ...existingEventRoles,
                    updatedRole
                ]
            }
        }
        case DELETE_EVENT_ROLE_SUCCESS: {
            const roleId = action.payload
            const existingEventRoles = state.eventRoles.filter(event => event.id !== roleId)

            return {
                ...state,
                eventRoles: [
                    ...existingEventRoles
                ]
            }
        }
        case GET_ASSIGNED_USERS_SUCCESS: {
            return {
                ...state,
                assignedUsers: action.payload
            }
        }

        case SET_STATISTIC_VALUE: {
            const { key, value } = action.payload
            return {
                ...state,
                [key]: value
            }
        }
        case SET_STATISTIC_TABLE_DATA: {
            const { byEventTableData, byGroupTableData } = action.payload

            return {
                ...state,
                byEventTableData: {
                    ...state.byEventTableData,
                    ...byEventTableData? byEventTableData : {}
                },
                byGroupTableData: {
                    ...state.byGroupTableData,
                    ...byGroupTableData? byGroupTableData : {}
                }
            }
        }
        case ASSIGN_USER_ROLE_SUCCESS: {
            const { byEventTableData } = state
            const { eventId, userId, roleId } = action.payload
            const eventData = byEventTableData[eventId]
            const usersList = get(eventData, ['usersList'], [])
            const userIndex = usersList.findIndex(user => user.id === parseInt(userId))
            const roles = get(usersList, [userIndex, 'roles'], [])
            if (usersList[userIndex]) {
                usersList[userIndex].roles = uniq([...roles, roleId])
            }
            if (eventData) {
                eventData.allUserRolesList = getAllUserRolesListForEvent(usersList)
            }
            const updated = generateDataForTableByEvent({ byEventTableData, currentEventId:eventId } as any)

            return {
                ...state,
                byEventTableData: { ...updated }
            }
        }

        case UNASSIGN_USER_ROLE_SUCCESS: {
            const { byEventTableData } = state
            const { eventId, userId, roleId } = action.payload
            const eventData = byEventTableData[eventId]
            const usersList = get(eventData, ['usersList'], [])
            const userIndex = usersList.findIndex(user => user.id === parseInt(userId))
            const roles = get(usersList, [userIndex, 'roles'], [])
            if (usersList[userIndex]) {
                usersList[userIndex].roles = without(roles, roleId)
            }
            if (eventData) {
                eventData.allUserRolesList = getAllUserRolesListForEvent(usersList)
            }
            const updated = generateDataForTableByEvent({ byEventTableData, currentEventId:eventId } as any)

            return {
                ...state,
                byEventTableData: { ...updated }
            }
        }
        case SET_STATISTIC_STATUS_MESSAGE_SUCCESS: {
            const { eventId, userId, response } = action.payload
            let byEventTableData = { ...state.byEventTableData }
            const usersList = get(state, ['byEventTableData', eventId, 'usersList'], [])
            const userIndex = usersList.findIndex(user => user.id === parseInt(userId))
            if (userIndex>=0) {
                usersList[userIndex] = {
                    ...usersList[userIndex],
                    statistic: {
                        ...usersList[userIndex]['statistic'],
                        type: response.type,
                        comments: response.comments
                    }
                }

                byEventTableData = {
                    ...byEventTableData,
                    [eventId]: {
                        ...state.byEventTableData[eventId],
                        usersList: [...usersList]
                    }
                }
            }

            let byGroupTableData = { ...state.byGroupTableData }

            Object.keys(byGroupTableData).map(queryStr => {
                const updatedMembersByEvents = {
                    ...byGroupTableData[queryStr]['membersByEvents']
                }
                const user = get(updatedMembersByEvents, [eventId,userId], null)

                if (user) {
                    try {
                        if (user['type']) {
                            byGroupTableData[queryStr]['globalStatistics'][user['type']] -= 1
                        }
                        if (response?.type) {
                            byGroupTableData[queryStr]['globalStatistics'][response.type] += 1
                        }
                    } catch (e) {}
                    user['type'] = response?.type
                    user['comments'] = response?.comments
                    byGroupTableData = {
                        ...byGroupTableData,
                        [queryStr]: {
                            ...byGroupTableData[queryStr],
                            membersByEvents: updatedMembersByEvents
                        }
                    }
                }
            })

            return {
                ...state,
                byGroupTableData,
                byEventTableData
            }
        }
        default:
            return state
    }
}
