import { describe, it, expect } from 'vitest'
import { filePathToPath } from '.'

describe('filePathToPath', () => {
  it('Should return a correct path', () => {
    expect(filePathToPath('/app/routes/index.tsx')).toBe('/')
    expect(filePathToPath('/app/routes/about.tsx')).toBe('/about')
    expect(filePathToPath('/app/routes/about/index.tsx')).toBe('/about')
    expect(filePathToPath('/app/routes/about/me')).toBe('/about/me')
    expect(filePathToPath('/app/routes/about/me/index.tsx')).toBe('/about/me')
    expect(filePathToPath('/app/routes/about/me/address.tsx')).toBe('/about/me/address')
  })
  it('Should return a correct path - with slug', () => {
    expect(filePathToPath('/app/routes/[slug].tsx')).toBe('/:slug')
    expect(filePathToPath('/app/routes/posts/[slug].tsx')).toBe('/posts/:slug')
  })
  it('Should return a correct path - with catch-all', () => {
    expect(filePathToPath('/app/routes/[...slug].tsx')).toBe('/*')
    expect(filePathToPath('/app/routes/posts/[...slug].tsx')).toBe('/posts/*')
  })

  it('Should return a correct path - with root option', () => {
    expect(filePathToPath('/test/mock/index.tsx', '/test/mock')).toBe('/')
    expect(filePathToPath('/test/mock/about.tsx', '/test/mock')).toBe('/about')
    expect(filePathToPath('/test/mock/about/index.tsx', '/test/mock')).toBe('/about')
    expect(filePathToPath('/test/mock/about/me', '/test/mock')).toBe('/about/me')
    expect(filePathToPath('/test/mock/about/me/index.tsx', '/test/mock')).toBe('/about/me')
    expect(filePathToPath('/test/mock/about/me/address.tsx', '/test/mock')).toBe(
      '/about/me/address'
    )
  })
})
