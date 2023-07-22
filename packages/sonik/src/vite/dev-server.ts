import type http from 'http'
import type { Plugin, ViteDevServer, Connect } from 'vite'
import { getRequestListener } from '@hono/node-server'
import type { Hono } from 'hono'

type Config = {
  entry: string
}

export function devServer(config: Config): Plugin {
  const plugin: Plugin = {
    name: 'sonik-dev-server',
    configureServer: async (server) => {
      async function createMiddleware(server: ViteDevServer): Promise<Connect.HandleFunction> {
        return async function (
          req: http.IncomingMessage,
          res: http.ServerResponse,
          next: Connect.NextFunction
        ): Promise<void> {
          if (req.url?.startsWith('/@vite/client') || req.url?.startsWith('/node_modules')) {
            return next()
          }

          const appModule = await server.ssrLoadModule(config.entry)
          const app = appModule['default'] as Hono

          if (!app) {
            console.error(`Failed to find a named export "default" from ${config.entry}`)
          } else {
            getRequestListener(async (request) => {
              const response = await app.fetch(request)
              if (response.headers.get('content-type')?.match(/^text\/html/)) {
                const body =
                  (await response.text()) + '<script type="module" src="/@vite/client"></script>'
                const headers = new Headers(response.headers)
                headers.delete('content-length')
                return new Response(body, {
                  status: response.status,
                  headers,
                })
              }
              return response
            })(req, res)
          }
        }
      }

      server.middlewares.use(await createMiddleware(server))
    },
  }
  return plugin
}
