export interface IBaseAction {
  type: string
}

export interface IAction<Payload> extends IBaseAction {
  payload?: Payload
  error?: boolean
}

export interface IActionMeta<Payload, Meta> extends IAction<Payload> {
  meta: Meta
}

export interface IActionFunction<R>{
  (...args: any[]): R
  toString: () => string
}

export interface IActionFunctionMulti<R, T, M>{
 (...args: any[]): R
 success: (...args: any[]) => T
 fail: (...args: any[]) => M
 toString: () => string
}

export function createActionPrefix<Payload>(
  nameCreator: (namePrefix: string) => string,
): string

export function createAction<Payload>(
  actionType: string,
  payloadCreator: (...args: any[]) => Payload,
): IActionFunction<IAction<Payload>>

export function createAction<Payload, SuccessPayload, FailPayload>(
  actionType: string,
  payloadCreator: (...args: any[]) => Payload,
): IActionFunctionMulti<
  IAction<Payload>,
  IActionMeta<SuccessPayload, SuccessPayload>,
  IActionMeta<FailPayload, FailPayload>
>

export function createAction<Payload, Meta, SuccessPayload, FailPayload>(
  actionType: string,
  payloadCreator: (...args: any[]) => Payload,
  metaCreator: (...args: any[]) => Meta,
): IActionFunctionMulti<
  IActionMeta<Payload, Meta>,
  IActionMeta<SuccessPayload, SuccessPayload>,
  IActionMeta<FailPayload, FailPayload>
>

export type Reducer<State, Payload> = (state: State, action: IAction<Payload>) => State

export interface IReducerNextThrow<State, Payload> {
  next?(state: State, action: IAction<Payload>): State
  throw?(state: State, action: IAction<Payload>): State
}

export interface IReducerMap<State, Payload={}> {
  [actionType: string]: Reducer<State, Payload> | IReducerNextThrow<State, Payload>
}

export function handleActions<State>(
  reducerMap: IReducerMap<State, {}>,
  initialState: State,
): Reducer<State, {}>

export function handleActions<State, Payload={}>(
  reducerMap: IReducerMap<State, Payload>,
  initialState: State,
): Reducer<State, Payload>