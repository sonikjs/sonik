import path from 'path'
import { getRequestListener } from '@hono/node-server'
import connect from 'connect'
import type { ModuleNode, ViteDevServer } from 'vite'
import { createServer as createViteServer, build as viteBuild } from 'vite'
import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker, UnstableDevOptions } from 'wrangler'

const DEFAULT_PORT = 5173

export type StartServerOptions = {
  outFile?: string
  port?: number
  wranglerOptions?: UnstableDevOptions
  ssrConfigFile?: string
  clientConfigFile?: string
}

export const startServer = async (options?: StartServerOptions) => {
  const outFile = options?.outFile ?? './dist/server.js'
  const port = options?.port ?? DEFAULT_PORT
  const wranglerOptions =
    options?.wranglerOptions ??
    ({
      experimental: { disableExperimentalWarning: true },
      logLevel: 'info',
    } satisfies UnstableDevOptions)

  const ssrConfigFile = options?.ssrConfigFile ?? 'vite.ssr.config.ts'
  const clientConfigFile = options?.clientConfigFile ?? 'vite.config.ts'

  let worker: UnstableDevWorker
  // eslint-disable-next-line prefer-const
  let vite: ViteDevServer | undefined

  const buildScript = async () => {
    await viteBuild({
      configFile: ssrConfigFile,
    })
  }

  const buildClientScript = async () => {
    await viteBuild({
      configFile: clientConfigFile,
    })
  }

  const rebuildAndRestart = async () => {
    await buildScript()
    worker = await unstable_dev(outFile, wranglerOptions)
  }

  const watchAndBuildPlugin = {
    name: 'watch-and-build',
    async handleHotUpdate({ file, modules }: { file: string; modules: Array<ModuleNode> }) {
      if (file.startsWith(path.resolve(process.cwd(), 'app/islands'))) {
        await buildClientScript()
      }
      if (file.startsWith(path.resolve(process.cwd(), 'app'))) {
        await rebuildAndRestart()
        if (modules.length > 0) {
          await vite?.ssrLoadModule(file)
        } else {
          vite?.ws.send({ type: 'full-reload' })
        }
      }
    },
  }

  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    plugins: [watchAndBuildPlugin],
    logLevel: 'warn',
  })

  // Initial build
  await buildClientScript()
  await rebuildAndRestart()

  const server = connect()
  server.use(vite.middlewares)

  server.use(async (req, res) => {
    req.url = req.originalUrl
    getRequestListener(async (workerRequest) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newResponse = await worker.fetch(workerRequest.url, workerRequest as any)
      if (newResponse.headers.get('content-type')?.match(/^text\/html/)) {
        const body =
          (await newResponse.text()) + '<script type="module" src="/@vite/client"></script>'
        const headers = new Headers(newResponse.headers)
        headers.delete('content-length')
        return new Response(body, {
          status: newResponse.status,
          headers,
        })
      }
      return newResponse
    })(req, res)
  })

  server.listen(port, () => {
    console.log(`[Vite] Running on http://localhost:${port}`)
  })
}
