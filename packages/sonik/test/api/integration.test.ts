/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest'
import { createApp } from '../../src'

describe('Basic', () => {
  const ROUTES = import.meta.glob('./app/routes/**/[a-z[-][a-z[_-]*.ts', {
    eager: true,
  })

  const app = createApp({
    root: './app/routes',
    ROUTES: ROUTES as any,
  })

  app.showRoutes()

  it('Should return 200 response - /', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      path: '/',
    })
  })

  it('Should return 200 response - /foo', async () => {
    const res = await app.request('/foo')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      path: '/foo',
    })
  })

  it('Should return 404 response - /bar', async () => {
    const res = await app.request('/bar')
    expect(res.status).toBe(404)
  })

  it('Should return 200 response /about/me', async () => {
    const res = await app.request('/about/me')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      path: '/about/me',
    })
  })

  it('Should return 200 response /about/me/address', async () => {
    const res = await app.request('/about/me/address')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      path: '/about/me/address',
    })
  })

  it('Should return 200 with header values /middleware', async () => {
    const res = await app.request('/middleware')
    expect(res.status).toBe(200)
    expect(res.headers.get('x-powered-by')).toBe('Hono')
    expect(await res.json()).toEqual({
      path: '/middleware',
    })
  })

  it('Should return 200 with header values /middleware/foo', async () => {
    const res = await app.request('/middleware/foo')
    expect(res.status).toBe(200)
    expect(res.headers.get('x-powered-by')).toBe('Hono')
    expect(await res.json()).toEqual({
      path: '/middleware/foo',
    })
  })
})
