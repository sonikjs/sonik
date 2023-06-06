import type { Context, Env } from 'hono'
import { Hono } from 'hono/tiny'
import type {
  ErrorHandler,
  Handler,
  HandlerResponse,
  LayoutHandler,
  ReservedHandler,
  FunctionComponent,
  AppHandler,
} from './types'
import { filePathToPath } from './utils'

type CreateAppOptions = Partial<{
  app: Hono
  PRESERVED: Record<string, unknown>
  FILES: Record<string, unknown>
  root: string
}>

type NashiOptions = Partial<{
  PRESERVED: Record<string, { default: ReservedHandler }>
  FILES: Record<string, { default: FunctionComponent; app?: AppHandler }>
  root: string
}>

function sortObject<T>(obj: Record<string, T>) {
  const sortedEntries = Object.entries(obj).sort((a, b) => {
    if (a[0] > b[0]) {
      return -1
    }
    if (a[0] < b[0]) {
      return 1
    }
    return 0
  })

  const sortedObject: Record<string, T> = {}
  for (const [key, value] of sortedEntries) {
    sortedObject[key] = value
  }

  return sortedObject
}

class Nashi {
  readonly PRESERVED: Record<string, { default: ReservedHandler }>
  readonly FILES: Record<string, { default: FunctionComponent; app?: AppHandler }>
  readonly preservedHandlers: Record<string, ReservedHandler>
  readonly root: string

  constructor(options?: NashiOptions) {
    // `import.meta.glob` can only use literals
    this.PRESERVED =
      options?.PRESERVED ??
      import.meta.glob('/src/app/(_layout|_error|_404).(tsx|ts)', {
        eager: true,
      })
    const FILES =
      options?.FILES ??
      import.meta.glob('/src/app/**/[a-z[-][a-z[_-]*.(tsx|ts)', {
        eager: true,
      })

    this.FILES = sortObject(FILES)

    this.root = options?.root ?? '/src/app'

    // Init preservedHandlers
    this.preservedHandlers = Object.keys(this.PRESERVED).reduce((preserved, file) => {
      const root = this.root
      const key = file.replace(`${root}/`, '').replace(/\.tsx$/g, '')
      return { ...preserved, [key]: this.PRESERVED[file].default }
    }, {}) as Record<string, ReservedHandler>
  }

  private toWebResponse = async (c: Context, res: HandlerResponse, status: number = 200) => {
    if (res instanceof Promise) res = await res
    if (res instanceof Response) return res
    if (typeof res === 'string' || res['isEscaped']) {
      const layout = this.preservedHandlers['_layout'] as LayoutHandler
      if (layout) {
        return c.html(await layout(res, c), status)
      }
      return c.html(res, status)
    }
    return c.json(res, status)
  }

  createApp = <E extends Env>(options?: { app?: Hono }) => {
    const app = (options?.app ?? new Hono()) as Hono<E>

    Object.keys(this.FILES).map((filePath) => {
      const path = filePathToPath(filePath, this.root)
      const fileDefault = this.FILES[filePath].default

      if (typeof fileDefault === 'function') {
        app.get(path, (c) => {
          return this.toWebResponse(c, fileDefault(c))
        })
      }

      const appHandler = this.FILES[filePath]['app']
      if (appHandler) {
        appHandler(app.use(path))
      }
    })

    const notFound = this.preservedHandlers['_404'] as Handler
    if (notFound) {
      app.notFound((c) => this.toWebResponse(c, notFound(c), 404))
    }

    const error = this.preservedHandlers['_error'] as ErrorHandler
    if (error) {
      app.onError((e, c) => this.toWebResponse(c, error(e, c), 500))
    }

    return app
  }
}

export const createApp = <E extends Env>(options?: CreateAppOptions) => {
  const nashi = options
    ? new Nashi({
        FILES: options.FILES as Record<string, { default: FunctionComponent; app?: AppHandler }>,
        PRESERVED: options.PRESERVED as Record<string, { default: ReservedHandler }>,
        root: options.root,
      })
    : new Nashi()
  return nashi.createApp<E>({ app: options?.app })
}
