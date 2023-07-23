import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'

describe('Worker', () => {
  let worker: UnstableDevWorker

  beforeAll(async () => {
    worker = await unstable_dev('./src/middleware/preload/worker.mock.ts', {
      experimental: { disableExperimentalWarning: true },
      site: 'test/workers-site',
    })
  })
  afterAll(async () => {
    await worker.stop()
  })

  it('Should return correct a link header', async () => {
    const res = await worker.fetch()
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toMatch(/^text\/html/)
    expect(res.headers.get('link')).toBe(
      '</static/Counter-90f0df36.js>; rel=modulepreload; as=script, </static/preact.module-f7b8d050.js>; rel=modulepreload; as=script'
    )
  })
})
