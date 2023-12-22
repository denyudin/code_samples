export interface IConnectedState {
}

export interface IConnectedDispatch {
}

export interface IProps extends IConnectedState, IConnectedDispatch {
    count: number
    onChange
    isMinMdScreen:boolean
    page?: number
}