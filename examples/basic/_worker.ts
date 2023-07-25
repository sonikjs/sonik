import { createApp } from 'sonik'
import type { MiddlewareHandler } from 'hono'

const app = createApp()

// Serve static middleware for Pages
const serveStatic = (): MiddlewareHandler => {
  return async (c, _next) => {
    const env = c.env as { ASSETS: Fetcher }
    const res = await env.ASSETS.fetch(c.req.raw)
    if (res.status === 404) {
      return c.notFound()
    }
    return res
  }
}

app.use('/static/*', serveStatic())

app.showRoutes()

export default app
