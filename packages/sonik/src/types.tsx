import type { Context, Env, Hono, Next } from 'hono'
export type { Hono, Context } from 'hono'
import type { Head } from './server/head'
export type { Head }

const tag = <></>

export type Node = typeof tag
export type HandlerResponse = Node | Promise<Node> | Response | Promise<Response>

export type Handler<E extends Env = Env> = (
  c: Context<E>,
  props: {
    head: Head
    next: Next
  }
) => HandlerResponse
export type NotFoundHandler = (c: Context, props: { head: Head }) => HandlerResponse
export type ErrorHandler = (c: Context, props: { error: Error; head: Head }) => HandlerResponse
export type LayoutHandler = (
  c: Context,
  props: { children: Node; head: Head; filename: string }
) => Node | Promise<Node>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppHandler<E extends Env = Env> = (app: Hono<E, any, any>) => void

export type FC = (c: Context, props: { head: Head }) => Node

export type ReservedHandler = Handler | ErrorHandler | LayoutHandler

export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type Route<E extends Env = Env> = Partial<{ [Key in Methods]: Handler<E> }> &
  Partial<{
    APP: AppHandler<E>
  }>
