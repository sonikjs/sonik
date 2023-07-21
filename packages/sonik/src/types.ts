import type { Context, Hono, Next } from 'hono'
export type { Hono, Context } from 'hono'

export type HandlerResponse = string | Promise<string> | Response | Promise<Response>

export type Handler = (c: Context, next: Next) => HandlerResponse
export type NotFoundHandler = (c: Context) => HandlerResponse
export type ErrorHandler = (e: Error, c: Context) => HandlerResponse
export type LayoutHandler = (children: string, head?: string) => string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppHandler = (app: Hono<any, any, any>) => void

export type FCOptions = {}

export type FC = (c: Context, options?: Partial<FCOptions>) => string

export type ReservedHandler = Handler | ErrorHandler | LayoutHandler

export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type Route = Partial<{ [Key in Methods]: Handler }> &
  Partial<{
    APP: AppHandler
  }>

export type Head = {
  title?: string
  meta?: Record<string, string>[]
  link?: Record<string, string>[]
  script?: Record<string, string>[]
}

export type HeadHandler = (c: Context) => Head | Promise<Head>
