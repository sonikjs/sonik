// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import app from '/app/server'
import { serveStatic } from 'hono/cloudflare-pages'

app.use('/static/*', serveStatic())
export default app
