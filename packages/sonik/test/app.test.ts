import { describe, expect, it } from 'vitest'
import { createApp } from '../src'

describe.skip('Basic', () => {
  const FILES = import.meta.glob('/test/mock/**/[a-z[-][a-z[_-]*.(tsx|ts)', {
    eager: true,
  })

  const app = createApp({
    root: '/test/mock',
    FILES: FILES,
  })

  it('Should return 200 response - /', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('<h1>Hello</h1>')
  })

  it('Should return 404 response - /foo', async () => {
    const res = await app.request('/foo')
    expect(res.status).toBe(404)
  })

  it('Should return 200 response /about', async () => {
    const res = await app.request('/about')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('<h1>About</h1>')
  })

  it('Should return 200 response /about/me', async () => {
    const res = await app.request('/about/me')
    expect(res.status).toBe(200)
    /* eslint-disable quotes */
    expect(await res.text()).toBe("<p>It's me</p>")
  })

  it('Should return 200 response /page', async () => {
    const res = await app.request('/page')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('<h1>Function Component!</h1>')
  })
})

describe.skip('With preserved', () => {
  const FILES = import.meta.glob('/test/mock/**/[a-z-_[]*.(tsx|ts)', {
    eager: true,
  })

  const PRESERVED = import.meta.glob('/test/mock/(_layout|_error|_404).tsx', {
    eager: true,
  })

  const app = createApp({
    root: '/test/mock',
    FILES: FILES,
    PRESERVED: PRESERVED,
  })

  it('Should return 200 response - /', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('<html><body><h1>Hello</h1></body></html>')
  })

  it('Should return 404 response - /foo', async () => {
    const res = await app.request('/foo')
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('<html><body><h1>Not Found</h1></body></html>')
  })

  it('Should return 200 response /about', async () => {
    const res = await app.request('/about')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('<html><body><h1>About</h1></body></html>')
  })

  it('Should return 500 response /throw_error', async () => {
    const res = await app.request('/throw_error')
    expect(res.status).toBe(500)
    expect(await res.text()).toBe('<html><body><h1>Custom Error Message: Foo</h1></body></html>')
  })
})

describe.skip('API', () => {
  const FILES = import.meta.glob('/test/mock/**/[a-z-_[]*.(tsx|ts)', {
    eager: true,
  })

  const app = createApp({
    root: '/test/mock',
    FILES: FILES,
  })

  it('Should return 200 response - /api', async () => {
    const res = await app.request('/api')
    expect(res.status).toBe(200)
    expect(res.headers.get('X-Custom')).toBe('Hello')
    expect(await res.json()).toEqual({ foo: 'bar' })
  })

  it('Should return 200 response - POST /foo', async () => {
    const res = await app.request('/api', {
      method: 'POST',
    })
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({
      ok: true,
      message: 'created',
    })
  })
})
