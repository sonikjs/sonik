import type { Env, Context } from 'hono'
export type { Env, Context }
import type { HtmlEscapedString } from 'hono/utils/html.js'
import type * as types from './types.js'

type Node = HtmlEscapedString

export { createApp } from './server/index.js'
export type Handler<E extends Env = Env> = types.Handler<E, Node>
export type NotFoundHandler<E extends Env = Env> = types.NotFoundHandler<E, Node>
export type ErrorHandler<E extends Env = Env> = types.ErrorHandler<E, Node>
export type LayoutHandler<E extends Env = Env> = types.LayoutHandler<E, Node>
export type FC<E extends Env = Env> = types.FC<E, Node>
export type Route<E extends Env = Env> = types.Route<E, Node>
