import { Reducer, Action } from 'redux'

export interface IAction<Payload> extends Action {
  payload?: Payload
  error?: boolean
}

export interface IActionMeta<Payload, Meta = any> extends IAction<Payload> {
  meta?: Meta
}

export type IAnyAction = IActionMeta<any>

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

export function createActionPrefix(
  prefix?: string
) : (name: string) => string

export function createAction<Payload>(
  actionType: string,
  payloadCreator?: (...args: any[]) => Payload,
): IActionFunction<IAction<Payload>>

export function createAction<Payload, SuccessPayload, FailPayload>(
  actionType: string,
  payloadCreator?: (...args: any[]) => Payload,
): IActionFunctionMulti<
  IAction<Payload>,
  IActionMeta<SuccessPayload, SuccessPayload>,
  IActionMeta<FailPayload, FailPayload>
  >

export function createAction<Payload, Meta, SuccessPayload, FailPayload>(
  actionType: string,
  payloadCreator?: (...args: any[]) => Payload,
  metaCreator?: (...args: any[]) => Meta,
): IActionFunctionMulti<
  IActionMeta<Payload, Meta>,
  IActionMeta<SuccessPayload, SuccessPayload>,
  IActionMeta<FailPayload, FailPayload>
  >


export interface IReducerNextThrow<State, A extends Action = IAnyAction> {
  next?(state: State, action: A): State
  throw?(state: State, action: A): State
}

export interface IReducerMap<State, A extends Action = IAnyAction> {
  [actionType: string]: Reducer<State, A> | IReducerNextThrow<State, A>
}

export function handleActions<State, Payload=any>(
  reducerMap: IReducerMap<State, IActionMeta<Payload>>,
  initialState: State,
): Reducer<State, IActionMeta<Payload>>

export function linstenActions<State, Payload=any>(
  reducerMapListener: () => IReducerMap<State, IActionMeta<Payload>>,
  initialState: State,
): Reducer<State, IActionMeta<Payload>>