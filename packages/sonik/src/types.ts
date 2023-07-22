import type { Context, Env, Hono, Next } from 'hono'
export type { Hono, Context } from 'hono'
import type { Head } from './server/head'
export type { Head }

export type HandlerResponse = string | Promise<string> | Response | Promise<Response>

export type Handler<E extends Env = Env> = (
  c: Context<E>,
  head: Head,
  next: Next
) => HandlerResponse
export type NotFoundHandler = (c: Context, head: Head) => HandlerResponse
export type ErrorHandler = (e: Error, c: Context, head: Head) => HandlerResponse
export type LayoutHandler = (children: string, head?: string) => string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppHandler<E extends Env = Env> = (app: Hono<E, any, any>) => void

export type FC = (c: Context, head: Head) => string

export type ReservedHandler = Handler | ErrorHandler | LayoutHandler

export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type Route<E extends Env = Env> = Partial<{ [Key in Methods]: Handler<E> }> &
  Partial<{
    APP: AppHandler<E>
  }>
