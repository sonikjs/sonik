import type { Context, Env } from 'hono'
import { Hono } from 'hono/tiny'
import type { VNode } from 'preact'
import { h, options as preactOptions } from 'preact'
import { render } from 'preact-render-to-string'
import type {
  Route,
  ErrorHandler,
  Handler,
  ReservedHandler,
  FC,
  AppHandler,
  LayoutHandler,
} from './types'
import { filePathToPath, sortObject } from './utils'

type CreateAppOptions = Partial<{
  app: Hono
  PRESERVED: Record<string, unknown>
  FILES: Record<string, unknown>
  root: string
}>

type SonikOptions = Partial<{
  PRESERVED: Record<string, { default: ReservedHandler }>
  FILES: Record<string, { default: FC & Route }>
  root: string
}>

class Sonik {
  readonly PRESERVED: Record<string, { default: ReservedHandler }>
  readonly FILES: Record<string, { default: FC & Route }>
  readonly preservedHandlers: Record<string, ReservedHandler>
  readonly root: string

  count: number = 0

  constructor(options?: SonikOptions) {
    // `import.meta.glob` can only use literals
    this.PRESERVED =
      options?.PRESERVED ??
      import.meta.glob('/app/routes/(_layout|_error|_404).(tsx|ts)', {
        eager: true,
      })
    const FILES =
      options?.FILES ??
      import.meta.glob('/app/routes/**/[a-z[-][a-z[_-]*.(tsx|ts)', {
        eager: true,
      })

    this.FILES = sortObject(FILES)

    this.root = options?.root ?? '/app/routes'

    // Init preservedHandlers
    this.preservedHandlers = Object.keys(this.PRESERVED).reduce((preserved, file) => {
      const root = this.root
      const key = file.replace(`${root}/`, '').replace(/\.tsx$/g, '')
      return { ...preserved, [key]: this.PRESERVED[file].default }
    }, {}) as Record<string, ReservedHandler>
  }

  private toWebResponse = async (
    c: Context,
    res: VNode | Promise<VNode> | Response | Promise<Response>,
    status: number = 200
  ) => {
    if (res instanceof Promise) res = await res
    if (res instanceof Response) return res
    const layout = this.preservedHandlers['_layout'] as LayoutHandler

    if (layout) {
      // @ts-ignore
      return c.html(render(layout(res, c)), status)
    }
    // @ts-ignore
    return c.html(render(res), status)
  }

  createApp = <E extends Env>(options?: { app?: Hono }): Hono<E> => {
    const app = options?.app ?? new Hono()

    Object.keys(this.FILES).map((filePath) => {
      const path = filePathToPath(filePath, this.root)
      const fileDefault = this.FILES[filePath].default

      if (typeof fileDefault === 'function') {
        app.get(path, (c) => {
          this.count = 0
          return this.toWebResponse(c, fileDefault(c))
        })
      }

      Object.keys(fileDefault).map((method) => {
        if (method === 'APP') {
          const appHandler = fileDefault['APP']
          if (appHandler) {
            appHandler(app.use(path))
          }
        } else {
          const handler = fileDefault[method as keyof Route] as Handler
          if (handler) {
            app.on(method, path, (c) => {
              return this.toWebResponse(c, handler(c))
            })
          }
        }
      })
    })

    const notFound = this.preservedHandlers['_404'] as Handler
    if (notFound) {
      app.notFound((c) => this.toWebResponse(c, notFound(c), 404))
    }

    const error = this.preservedHandlers['_error'] as ErrorHandler
    if (error) {
      app.onError((e, c) => this.toWebResponse(c, error(e, c), 500))
    }

    return app as unknown as Hono<E>
  }
}

export function createApp<E extends Env>(options?: CreateAppOptions) {
  const sonik = options
    ? new Sonik({
        FILES: options.FILES as Record<string, { default: FC; app?: AppHandler }>,
        PRESERVED: options.PRESERVED as Record<string, { default: ReservedHandler }>,
        root: options.root,
      })
    : new Sonik()
  return sonik.createApp<E>({ app: options?.app })
}

export function defineRoute(route: Route) {
  return route
}

const DEFAULT_PROPS = ['children', '__wrapped', 'name']

const oldHook = preactOptions.vnode
preactOptions.vnode = (vnode) => {
  // @ts-ignore
  if (typeof vnode.type === 'function' && !vnode.props['__wrapped']) {
    const originalType = vnode.type

    vnode.type = (props) => {
      const keys = Object.keys(props)
      const hasProps = keys.some((key) => !DEFAULT_PROPS.includes(key))
      if (!hasProps) {
        return h(originalType, props)
      }
      return h(
        'div',
        { 'data-serialized-props': JSON.stringify(props), class: 'component-wrapper' },
        h(originalType, props)
      )
    }
    // @ts-ignore
    vnode.props['__wrapped'] = true
  }
  if (oldHook) oldHook(vnode)
}
