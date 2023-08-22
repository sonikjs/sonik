import type http from 'http'
import { getRequestListener } from '@hono/node-server'
// eslint-disable-next-line node/no-extraneous-import
import type { Plugin, ViteDevServer, Connect } from 'vite'

export type DevServerOptions = {
  entry?: string
  passThrough?: string[]
}

export function devServer(options?: DevServerOptions): Plugin[] {
  const plugins: Plugin[] = [
    {
      name: 'sonik-dev-server',
      configureServer: async (server) => {
        async function createMiddleware(server: ViteDevServer): Promise<Connect.HandleFunction> {
          return async function (
            req: http.IncomingMessage,
            res: http.ServerResponse,
            next: Connect.NextFunction
          ): Promise<void> {
            let passThough = false

            if (options?.passThrough && req.url) {
              if (options.passThrough.includes(req.url)) {
                passThough = true
              }
            }

            if (
              passThough === false &&
              (req.url?.endsWith('.ts') ||
                req.url?.endsWith('.tsx') ||
                req.url?.startsWith('/app/') || // TODO: to be fixed
                req.url?.startsWith('/@') ||
                req.url?.startsWith('/static') ||
                req.url?.startsWith('/node_modules'))
            ) {
              return next()
            }

            const appModule = await server.ssrLoadModule(options?.entry ?? './app/server.ts')
            const app = appModule['default']

            if (!app) {
              console.error(`Failed to find a named export "default" from ${options?.entry}`)
              return next()
            }

            getRequestListener(async (request) => {
              if (passThough) {
                return new Response(null)
              }
              const response = await app.fetch(request)
              if (
                // If the response is a streaming, it does not inject the script:
                !response.headers.get('transfer-encoding')?.match('chunked') &&
                response.headers.get('content-type')?.match(/^text\/html/)
              ) {
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

        server.middlewares.use(await createMiddleware(server))
      },
    },
  ]
  return plugins
}
