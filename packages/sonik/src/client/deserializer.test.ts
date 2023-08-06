import { describe, expect, it } from 'vitest'
import { SERIALIZE_KEY } from '../constants.js'
import { deserialize } from './deserializer.js'

describe('deserialize', () => {
  it('Should correctly deserialize non-signal serialized properties', async () => {
    const serializedNonSignalProp = {
      [SERIALIZE_KEY]: 'l',
      v: 'hello world',
    }
    const result = await deserialize(serializedNonSignalProp)
    expect(result).toBe('hello world')
  })
  it('Should return non-serialized values as is', async () => {
    const nonSerializedValue = 'non-serialized value'
    const result = await deserialize(nonSerializedValue)
    expect(result).toBeUndefined()
  })
})
