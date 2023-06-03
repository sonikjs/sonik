import type { Context } from 'hono'
import type { HtmlEscapedString } from 'hono/utils/html'

export type FC = (c: Context) => HtmlEscapedString | Response

export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type H = Partial<{ [Key in Methods]: FC }>

export type Module = {
  path: string
} & {
  handler: H
}
