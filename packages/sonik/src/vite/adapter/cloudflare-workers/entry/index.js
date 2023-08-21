import app from '/app/server'
import { serveStatic } from 'hono/cloudflare-workers'

app.use(
  '/static/*',
  serveStatic({
    root: './'
  })
)

export default app
