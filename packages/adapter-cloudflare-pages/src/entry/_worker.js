import app from '/app/server'
import { serveStatic } from 'hono/cloudflare-pages'

app.use('/static/*', serveStatic())
export default app
