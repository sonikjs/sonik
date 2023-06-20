import { Hono } from 'hono'
import { html } from 'hono/html'
import { preload } from '.'

const app = new Hono()

app.get(
  '*',
  preload({
    manifestPath: 'manifest.json',
  })
)

app.get('/', (c) => {
  return c.html(
    html`<html>
      <head></head>
      <body>
        <div component-wrapper="true">
          <div component-name="Counter.tsx">
            <p>Counter: 3</p>
            <button>Increment</button>
          </div>
        </div>
      </body>
    </html>`
  )
})

export default app
