type ScopeName = FnName
type FnName = string

export type Action = {
    type: `${ScopeName}/${FnName}`
    payload: any
}

export type Reducer = (state: any, action: Action) => any

export type Selector = (state: any) => any
