import { signal as mockSignal } from '@preact/signals'
import { describe, expect, it } from 'vitest'
import { SERIALIZE_KEY } from '../constants'
import { deserialize } from './deserialize'

describe('deserialize', () => {
  it('Should correctly deserialize non-signal serialized properties', async () => {
    const serializedNonSignalProp = {
      [SERIALIZE_KEY]: 'l',
      v: 'hello world',
    }
    const result = await deserialize(serializedNonSignalProp)
    expect(result).toBe('hello world')
  })

  it('Should correctly deserialize signal serialized properties', async () => {
    const serializedSignalProp = {
      [SERIALIZE_KEY]: 's',
      v: 'hello world',
    }
    const result = await deserialize(serializedSignalProp)
    const expected = mockSignal('hello world')
    expect(result).toEqual(expected)
  })

  it('Should return non-serialized values as is', async () => {
    const nonSerializedValue = 'non-serialized value'
    const result = await deserialize(nonSerializedValue)
    expect(result).toBeUndefined()
  })
})
