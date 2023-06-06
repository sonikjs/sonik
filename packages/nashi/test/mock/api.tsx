import type { AppHandler } from '../../src'

export const app: AppHandler = (app) => {
  app.post((c) => {
    return c.json(
      {
        ok: true,
      },
      201
    )
  })
}

export default function Home() {
  return <h1>Welcome!</h1>
}
