export interface IConnectedState {
}

export interface IConnectedDispatch {
}

export interface IProps extends IConnectedState, IConnectedDispatch {
    isMinMdScreen: boolean
    statusList: {
        name: string,
        count: number
    }[]
    totalInvited?: number
}