import { IEvent, IEventShort, IEventShortQuery } from 'model/Event'
import { IGetMembersParams } from 'actions/memberActions'
import { IMember } from 'model/Member'
import { IStatisticTablesData, IByEventTableData } from 'actions/statisticActions'

export interface IConnectedState {
    currentEvent: IEvent
    eventsExist: boolean
    formValues
    currentEventId: string | number
    byEventTableData: IByEventTableData
    eventsGetPending: boolean
    presets
}

export interface IConnectedDispatch {
    toEditEvent: (eventId: number|string) => void
    toEditGame: (eventId: number|string) => void
    toEditTraining: (eventId: number|string) => void
    changeField: (field: string, value: any) => void
    getTargetGroups: (eventId: number|string) => Promise<any>
    getMembers: (props: IGetMembersParams) => Promise<IMember[]>
    getEventRoles: (eventId:number|string) => Promise<any>
    getAssignedUsers: (eventId: number|string) => Promise<any>
    setStatisticTablesData: (props: IStatisticTablesData) => Promise<any>
    unregisterField: (fieldName:string) => void
    clearStatisticPresets: () => void
}

export interface IProps extends IConnectedState, IConnectedDispatch {
    isMinMdScreen: boolean
    statusAction: (options) => void
    fetchEvents: (props:IEventShortQuery) => Promise<IEventShort>
}
