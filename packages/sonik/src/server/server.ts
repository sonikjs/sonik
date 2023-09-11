/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Env, Context } from 'hono'
import { Hono } from 'hono'
import type {
  ErrorHandler,
  FH,
  Node,
  LayoutHandler,
  NotFoundHandler,
  RenderToString,
  RenderToReadableStream,
  CreateElement,
  FragmentType,
  AppRoute,
} from '../types.js'
import { filePathToPath, groupByDirectory, listByDirectory } from '../utils/file.js'
import { Head } from './head.js'

const NOTFOUND_FILENAME = '_404.tsx'
const ERROR_FILENAME = '_error.tsx'

declare module 'hono' {
  interface ContextRenderer {
    (content: Node, head?: Partial<Pick<Head, 'title' | 'link' | 'meta'>>):
      | Response
      | Promise<Response>
  }
}

export type ServerOptions<E extends Env = Env> = {
  PRESERVED?: Record<string, PreservedFile>
  LAYOUTS?: Record<string, LayoutFile>
  NESTED_LAYOUTS?: Record<string, LayoutFile>
  ROUTES?: Record<string, RouteFile>
  root?: string
  renderToString: RenderToString
  renderToReadableStream?: RenderToReadableStream
  createElement: CreateElement
  fragment: FragmentType
  createHead?: () => Head
  streaming?: boolean
  app?: Hono<E>
}

type RouteFile = { default: FH & Hono; route: { APP: AppRoute } }
type LayoutFile = { default: LayoutHandler }
type PreservedFile = { default: ErrorHandler }

type ToWebOptions = {
  head: Head
  layouts?: string[]
  nestedLayouts?: string[]
  filename: string
}

const addDocType = (html: string) => {
  return `<!doctype html>${html}`
}

const createResponse = async (
  c: Context,
  res: string | ReadableStream | Promise<ReadableStream>
) => {
  if (typeof res === 'string') {
    return c.html(res)
  } else {
    return c.body(await res, undefined, {
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
      'Content-Type': 'text/html; charset=utf-8',
    })
  }
}

export const createApp = <E extends Env>(options: ServerOptions<E>): Hono<E> => {
  const PRESERVED =
    options.PRESERVED ??
    import.meta.glob('/app/routes/**/(_error|_404).(ts|tsx)', {
      eager: true,
    })

  const preservedMap = groupByDirectory(PRESERVED)

  const LAYOUTS =
    options.LAYOUTS ??
    import.meta.glob('/app/routes/**/_layout.tsx', {
      eager: true,
    })

  const NESTED_LAYOUTS =
    options.NESTED_LAYOUTS ??
    import.meta.glob('/app/routes/**/__layout.tsx', {
      eager: true,
    })

  const layoutList = listByDirectory(LAYOUTS)
  const nestedLayoutList = listByDirectory(NESTED_LAYOUTS)

  const ROUTES =
    options.ROUTES ??
    import.meta.glob('/app/routes/**/[a-z0-9[-][a-z0-9[_-]*.(ts|tsx|mdx)', {
      eager: true,
    })

  const routesMap = groupByDirectory(ROUTES)

  const root = options.root ?? '/app/routes'

  const render =
    options.streaming && options.renderToReadableStream
      ? options.renderToReadableStream
      : options.renderToString

  const renderContent = async (
    innerContent: string | Promise<string> | Node | Promise<Node>,
    { layouts, head, filename, nestedLayouts }: ToWebOptions
  ) => {
    if (nestedLayouts && nestedLayouts.length) {
      nestedLayouts = nestedLayouts.sort((a, b) => {
        return b.split('/').length - a.split('/').length
      })
      for (const path of nestedLayouts) {
        const layout = NESTED_LAYOUTS[path]
        if (layout) {
          try {
            innerContent = await layout.default({ children: innerContent, head, filename })
          } catch (e) {
            console.trace(e)
          }
        }
      }
    }

    let defaultLayout: LayoutFile | undefined
    if (layouts && layouts.length) {
      layouts = layouts.sort((a, b) => {
        return b.split('/').length - a.split('/').length
      })
      defaultLayout = LAYOUTS[layouts[0]]
    }

    defaultLayout ??= LAYOUTS[root + '/_layout.tsx']

    if (defaultLayout) {
      try {
        innerContent = await defaultLayout.default({ children: innerContent, head, filename })
      } catch (e) {
        console.trace(e)
      }
    }

    const content = render(innerContent)

    if (typeof content === 'string') {
      if (defaultLayout || layouts?.length) {
        return addDocType(content)
      }
      return content
    }
    return content
  }

  const app = options.app ?? new Hono()

  for (const [dir, content] of Object.entries(routesMap)) {
    const subApp = new Hono()

    let layouts = layoutList[dir]
    let nestedLayouts = nestedLayoutList[dir]

    const dirPaths = dir.split('/')

    if (!layouts) {
      const getLayoutPaths = (paths: string[]) => {
        layouts = layoutList[paths.join('/')]
        if (!layouts) {
          paths.pop()
          if (paths.length) {
            getLayoutPaths(paths)
          }
        }
      }
      getLayoutPaths(dirPaths)
    }

    if (!nestedLayouts) {
      const getLayoutPaths = (paths: string[]) => {
        nestedLayouts = nestedLayoutList[paths.join('/')]
        if (!nestedLayouts) {
          paths.pop()
          if (paths.length) {
            getLayoutPaths(paths)
          }
        }
      }
      getLayoutPaths(dirPaths)
    }

    const regExp = new RegExp(`^${root}`)
    let rootPath = dir.replace(regExp, '')
    rootPath = filePathToPath(rootPath)

    for (const [filename, route] of Object.entries(content)) {
      const routeDefault = route.default

      const path = filePathToPath(filename)

      // Instance of Hono
      if (routeDefault && 'fetch' in routeDefault) {
        subApp.route(path, routeDefault)
        continue
      }

      // Create an instance of Head
      let head: Head
      if (options.createHead) {
        head = options.createHead()
      } else {
        head = new Head({
          createElement: options.createElement,
          fragment: options.fragment,
        })
      }

      // Options for the renderContent()
      const renderOptions = {
        layouts,
        nestedLayouts,
        head,
        filename,
      }

      // Set a renderer
      if (layouts && layouts.length) {
        subApp.use('*', async (c, next) => {
          c.setRenderer(async (node, headProps) => {
            if (headProps) head.set(headProps)
            const content = await renderContent(node, renderOptions)
            return createResponse(c, content)
          })
          await next()
        })
      }

      // Function Handler
      if (routeDefault && typeof routeDefault === 'function') {
        subApp.get(path, async (c) => {
          const innerContent = await (routeDefault as FH)(c, { head })
          if (innerContent instanceof Response) return innerContent
          return c.render(innerContent, head)
        })
      }

      // export const route {} satisfies { APP: AppRoute }
      const appRoute = route.route
      if (!appRoute) continue

      appRoute['APP'](subApp.use(path))

      for (const [preservedDir, content] of Object.entries(preservedMap)) {
        if (dir !== root && dir === preservedDir) {
          const notFound = content[NOTFOUND_FILENAME]
          if (notFound) {
            const notFoundHandler = notFound.default as NotFoundHandler

            subApp.get('*', async (c) => {
              const content = await renderContent(notFoundHandler(c, { head }), renderOptions)
              c.status(404)
              return createResponse(c, content)
            })
          }
          const error = content[ERROR_FILENAME]
          if (error) {
            const errorHandler = error.default as ErrorHandler
            subApp.onError((error, c) => {
              c.status(500)
              return (async () => {
                const content = await renderContent(errorHandler(c, { error, head }), renderOptions)
                c.status(500)
                return createResponse(c, content)
              })()
            })
          }
        }
      }
    }
    app.route(rootPath, subApp)
  }

  let head: Head
  if (options.createHead) {
    head = options.createHead()
  } else {
    head = new Head({
      createElement: options.createElement,
      fragment: options.fragment,
    })
  }

  if (preservedMap[root]) {
    const defaultNotFound = preservedMap[root][NOTFOUND_FILENAME]
    if (defaultNotFound) {
      const notFoundHandler = defaultNotFound.default as unknown as NotFoundHandler<E>
      app.notFound(async (c) => {
        const content = await renderContent(notFoundHandler(c, { head }), {
          head,
          filename: NOTFOUND_FILENAME,
        })
        c.status(404)
        return createResponse(c, content)
      })
    }

    const defaultError = preservedMap[root][ERROR_FILENAME]
    if (defaultError) {
      const errorHandler = defaultError.default as unknown as ErrorHandler<E>
      app.onError((error, c) => {
        return (async () => {
          const content = await renderContent(errorHandler(c, { error, head }), {
            head,
            filename: ERROR_FILENAME,
          })
          c.status(500)
          return createResponse(c, content)
        })()
      })
    }
  }

  return app as unknown as Hono<E>
}
