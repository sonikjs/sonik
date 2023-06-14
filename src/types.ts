import type { Context, Hono } from 'hono'
import type { VNode } from 'preact'

export type { Hono, Context } from 'hono'

export type HandlerResponse = VNode | Promise<VNode> | Response | Promise<Response>

export type Handler = (c: Context) => HandlerResponse
export type ErrorHandler = (e: Error, c: Context) => HandlerResponse
export type LayoutHandler = (children: VNode, c: Context) => VNode
export type AppHandler = (app: Hono) => void

export type FCOptions = {}

export type FC = (c: Context, options?: Partial<FCOptions>) => VNode

export type ReservedHandler = Handler | ErrorHandler | LayoutHandler

export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type Route = Partial<{ [Key in Methods]: Handler }> &
  Partial<{
    APP: AppHandler
  }>
