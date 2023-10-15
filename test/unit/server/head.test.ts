import { jsx, Fragment } from 'hono/jsx'
import { describe, it, expect, beforeEach } from 'vitest'
import { Head } from '../../../src/server/head'

describe('Head', () => {
  let head: Head

  beforeEach(async () => {
    head = new Head({
      createElement: jsx,
      fragment: Fragment,
    })
  })

  it('Should create a head tag', () => {
    head.title = 'Sonik Blog'
    const tags = head.createTags()
    expect(tags.toString()).toBe('<title>Sonik Blog</title>')
  })

  it('Should create meta tags', () => {
    head.meta = [
      {
        name: 'description',
        content: 'Sonik is cool',
      },
      {
        name: 'keywords',
        content: 'Framework',
      },
    ]
    const tags = head.createTags()
    expect(tags.toString()).toBe(
      '<meta name="description" content="Sonik is cool"/><meta name="keywords" content="Framework"/>'
    )
  })

  it('Should create link tags', () => {
    head.link = [
      {
        href: 'main.css',
        rel: 'stylesheet',
      },
      {
        href: 'favicon.ico',
        rel: 'icon',
      },
    ]
    const tags = head.createTags()
    expect(tags.toString()).toBe(
      '<link href="main.css" rel="stylesheet"/><link href="favicon.ico" rel="icon"/>'
    )
  })

  it('Should create head & meta & link tags', () => {
    head.set({
      title: 'Sonik Blog',
      meta: [
        {
          name: 'description',
          content: 'Sonik is cool',
        },
        {
          name: 'keywords',
          content: 'Framework',
        },
      ],
      link: [
        {
          href: 'main.css',
          rel: 'stylesheet',
        },
        {
          href: 'favicon.ico',
          rel: 'icon',
        },
      ],
    })
    const tags = head.createTags()
    expect(tags.toString()).toBe(
      '<title>Sonik Blog</title><meta name="description" content="Sonik is cool"/><meta name="keywords" content="Framework"/><link href="main.css" rel="stylesheet"/><link href="favicon.ico" rel="icon"/>'
    )
  })
})
