import { serveStatic } from 'hono/cloudflare-pages'
import { createApp } from 'sonik/react'

const app = createApp()

app.use('/static/*', serveStatic())

app.showRoutes()

export default app
