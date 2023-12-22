export interface IConnectedState {
}

export interface IConnectedDispatch {
    toCreateEvent: () => void
}

export interface IProps extends IConnectedState, IConnectedDispatch {
    message: string | React.ReactNode
}