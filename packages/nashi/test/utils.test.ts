import { describe, it, expect } from 'vitest'
import { filePathToPath } from '../src/utils'

describe('filePathToPath', () => {
  it('Should return a correct path', () => {
    expect(filePathToPath('/src/app/index.tsx')).toBe('/')
    expect(filePathToPath('/src/app/about.tsx')).toBe('/about')
    expect(filePathToPath('/src/app/about/index.tsx')).toBe('/about')
    expect(filePathToPath('/src/app/about/me')).toBe('/about/me')
    expect(filePathToPath('/src/app/about/me/index.tsx')).toBe('/about/me')
    expect(filePathToPath('/src/app/about/me/address.tsx')).toBe('/about/me/address')
  })
  it('Should return a correct path - with slug', () => {
    expect(filePathToPath('/src/app/[slug].tsx')).toBe('/:slug')
    expect(filePathToPath('/src/app/posts/[slug].tsx')).toBe('/posts/:slug')
  })
  it('Should return a correct path - with catch-all', () => {
    expect(filePathToPath('/src/app/[...slug].tsx')).toBe('/*')
    expect(filePathToPath('/src/app/posts/[...slug].tsx')).toBe('/posts/*')
  })
})
