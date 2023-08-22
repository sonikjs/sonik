import { describe, it, expect } from 'vitest'
import { createTagString, escape } from '../../../../src/server/utils/html.js'

describe('escape', () => {
  it('Should escape the strings', () => {
    expect(escape('"\'&<>')).toBe('&quot;&#x27;&amp;&lt;&gt;')
    expect(escape('')).toBe('')
  })
})

describe('createTagString', () => {
  it('Should create tag strings from records', () => {
    const records = [
      {
        name: 'description',
        content: 'Sonik is cool',
      },
      {
        name: 'keywords',
        content: 'Framework',
      },
      {
        name: 'specialChars',
        content: '"\'&<>',
      },
    ]
    expect(createTagString('meta', records)).toBe(
      '<meta name="description" content="Sonik is cool" /><meta name="keywords" content="Framework" /><meta name="specialChars" content="&quot;&#x27;&amp;&lt;&gt;" />'
    )
  })
})
