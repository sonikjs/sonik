import { createApp } from 'sonik'
import { Hono } from 'hono/tiny'
import { serveStatic } from 'hono/cloudflare-workers'
import { cache } from 'hono/cache'
import { preloadMiddleware } from './preload-middleware'

type Bindings = {
  __STATIC_CONTENT: KVNamespace
}

const base = new Hono<{ Bindings: Bindings }>()

base.get(
  '*',
  cache({
    cacheName: 'sonik-example-basic',
    cacheControl: 'max-age=3600',
  })
)
base.get('*', preloadMiddleware())

const app = createApp({ app: base })

app.get('/static/*', serveStatic({ root: './' }))

app.showRoutes()

export default app
