import { createApp } from 'nashi'

import { serveStatic } from 'hono/cloudflare-workers'

const app = createApp()

app.get('/static/*', serveStatic({ root: './' }))

export default app
