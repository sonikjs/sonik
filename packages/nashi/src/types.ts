import type { Context as HonoContext } from 'hono'
import type { HtmlEscapedString } from 'hono/utils/html'

export type Context = HonoContext

export type HandlerResponse =
  | HtmlEscapedString
  | Promise<HtmlEscapedString>
  | Response
  | Promise<Response>

export type Handler = (c: Context) => HandlerResponse
export type ErrorHandler = (e: Error, c: Context) => HandlerResponse
export type LayoutHandler = (
  children: HtmlEscapedString,
  c: Context
) => HtmlEscapedString | Promise<HtmlEscapedString>

export type FunctionComponent = (c: Context) => HtmlEscapedString

export type ReservedHandler = Handler | ErrorHandler | LayoutHandler

export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type Route = Partial<{ [Key in Methods]: Handler }>
