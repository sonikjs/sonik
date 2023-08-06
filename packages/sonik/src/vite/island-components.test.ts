import { expect, describe, it } from 'vitest'
import { transformJsxTags } from './island-components.js'

describe('transformJsxTags', () => {
  it('Should add component-wrapper and component-name attribute', () => {
    const code = transformJsxTags('<Badge><h1>Hello</h1></Badge>', 'Badge.tsx')
    expect(code).toBe(
      '<div component-wrapper="true"><Badge component-name="Badge.tsx"><h1>Hello</h1></Badge></div>;'
    )
  })
  it('Should not transform if it is blank', () => {
    const code = transformJsxTags('', 'Badge.tsx')
    expect(code).toBe('')
  })
})
