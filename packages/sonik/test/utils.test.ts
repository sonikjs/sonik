import { describe, it, expect } from 'vitest'
import { filePathToPath } from '../src/utils'

describe('filePathToPath', () => {
  it('Should return a correct path', () => {
    expect(filePathToPath('/src/routes/index.tsx')).toBe('/')
    expect(filePathToPath('/src/routes/about.tsx')).toBe('/about')
    expect(filePathToPath('/src/routes/about/index.tsx')).toBe('/about')
    expect(filePathToPath('/src/routes/about/me')).toBe('/about/me')
    expect(filePathToPath('/src/routes/about/me/index.tsx')).toBe('/about/me')
    expect(filePathToPath('/src/routes/about/me/address.tsx')).toBe('/about/me/address')
  })
  it('Should return a correct path - with slug', () => {
    expect(filePathToPath('/src/routes/[slug].tsx')).toBe('/:slug')
    expect(filePathToPath('/src/routes/posts/[slug].tsx')).toBe('/posts/:slug')
  })
  it('Should return a correct path - with catch-all', () => {
    expect(filePathToPath('/src/routes/[...slug].tsx')).toBe('/*')
    expect(filePathToPath('/src/routes/posts/[...slug].tsx')).toBe('/posts/*')
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
