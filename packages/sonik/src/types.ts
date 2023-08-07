export type { Head }
export type { Hono, Context } from 'hono'
import type { Context, Env, Hono, Next } from 'hono'
import type { Head } from './server/head.js'

/** Internal */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Node = any
export type HandlerResponse<N = Node> =
  | N
  | Promise<N>
  | Response
  | Promise<Response>
  | Promise<Response | N>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppHandler<E extends Env = Env> = (app: Hono<E, any, any>) => void
export type ReservedHandler = Handler | ErrorHandler | LayoutHandler
export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'

/** external */
export type Handler<E extends Env = Env, N = Node> = (
  c: Context<E>,
  props: {
    head: Head
    next: Next
  }
) => HandlerResponse<N>

/** Preserved */
export type NotFoundHandler<E extends Env = Env, N = Node> = (
  c: Context<E>,
  props: { head: Head }
) => HandlerResponse<N>

export type ErrorHandler<E extends Env = Env, N = Node> = (
  c: Context<E>,
  props: { error: Error; head: Head }
) => HandlerResponse<N>

export type LayoutHandler<E extends Env = Env, N = Node> = (
  c: Context<E>,
  props: { children: N | string; head: Head; filename: string }
) => N | string | Promise<N | string>

/** Function Component */
export type FC<E extends Env = Env, N = Node> = (c: Context<E>, props: { head: Head }) => N

/** Route */
export type Route<E extends Env = Env, N = Node> = Partial<{ [Key in Methods]: Handler<E, N> }> &
  Partial<{
    APP: AppHandler<E>
  }>
