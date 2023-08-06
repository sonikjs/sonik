import { describe, it, expect } from 'vitest'
import { filePathToPath, groupByDirectory, listByDirectory } from './index.js'

describe('filePathToPath', () => {
  it('Should return a correct path', () => {
    expect(filePathToPath('index.tsx')).toBe('/')
    expect(filePathToPath('about.tsx')).toBe('/about')
    expect(filePathToPath('about/index.tsx')).toBe('/about')
    expect(filePathToPath('about/me')).toBe('/about/me')
    expect(filePathToPath('about/me/index.tsx')).toBe('/about/me')
    expect(filePathToPath('about/me/address.tsx')).toBe('/about/me/address')

    expect(filePathToPath('/index.tsx')).toBe('/')
    expect(filePathToPath('/about.tsx')).toBe('/about')
    expect(filePathToPath('/about/index.tsx')).toBe('/about')
    expect(filePathToPath('/about/me')).toBe('/about/me')
    expect(filePathToPath('/about/me/index.tsx')).toBe('/about/me')
    expect(filePathToPath('/about/me/address.tsx')).toBe('/about/me/address')
  })
})

describe('groupByDirectory', () => {
  const files = {
    '/app/routes/index.tsx': 'file1',
    '/app/routes/about.tsx': 'file2',
    '/app/routes/blog/index.tsx': 'file3',
    '/app/routes/blog/about.tsx': 'file4',
    '/app/routes/blog/posts/index.tsx': 'file5',
    '/app/routes/blog/posts/comments.tsx': 'file6',
  }

  it('Should group by directories', () => {
    expect(groupByDirectory(files)).toEqual({
      '/app/routes': {
        'index.tsx': 'file1',
        'about.tsx': 'file2',
      },
      '/app/routes/blog': {
        'index.tsx': 'file3',
        'about.tsx': 'file4',
      },
      '/app/routes/blog/posts': {
        'index.tsx': 'file5',
        'comments.tsx': 'file6',
      },
    })
  })
})

describe('listByDirectory', () => {
  it('Should list files by their directory', () => {
    const files = {
      '/app/routes/blog/posts/_layout.tsx': 'foo3',
      '/app/routes/_layout.tsx': 'foo',
      '/app/routes/blog/_layout.tsx': 'foo2',
    }

    const result = listByDirectory(files)

    expect(result).toEqual({
      '/app/routes': ['/app/routes/_layout.tsx'],
      '/app/routes/blog': ['/app/routes/_layout.tsx', '/app/routes/blog/_layout.tsx'],
      '/app/routes/blog/posts': [
        '/app/routes/_layout.tsx',
        '/app/routes/blog/_layout.tsx',
        '/app/routes/blog/posts/_layout.tsx',
      ],
    })
  })
})
