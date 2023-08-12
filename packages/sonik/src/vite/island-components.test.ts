import { expect, describe, it } from 'vitest'
import { transformJsxTags } from './island-components.js'

describe('transformJsxTags', () => {
  it('Should add component-wrapper and component-name attribute', () => {
    const code = `export default function Badge() {
      return <h1>Hello</h1>
    }`
    const result = transformJsxTags(code, 'Badge.tsx')
    expect(result).toBe(
      `const BadgeOriginal = function () {
  return <h1>Hello</h1>;
};
const WrappedBadge = props => {
  const serializedProps = JSON.stringify(props);
  return <div component-wrapper><div component-name="Badge.tsx" data-serialized-props={serializedProps}><BadgeOriginal {...props}></BadgeOriginal></div></div>;
};
export default WrappedBadge;`
    )
  })
  it('Should not transform if it is blank', () => {
    const code = transformJsxTags('', 'Badge.tsx')
    expect(code).toBe('')
  })
})
