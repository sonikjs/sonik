import { expect, describe, it } from 'vitest'
import { SERIALIZE_KEY, DEFAULT_PROPS } from '../constants'
import { serialize } from '.'

describe('serialize', () => {
  it('Should correctly serialize properties that are not signals', () => {
    const props = {
      notSignalProp: 'hello world',
      children: [],
    }
    const result = serialize(props)
    expect(result).toEqual({
      notSignalProp: {
        [SERIALIZE_KEY]: 'l',
        v: 'hello world',
      },
    })
  })

  it('Should correctly serialize properties that are signals', () => {
    const props = {
      signalProp: {
        peek: () => 'hello world',
        value: 'initial value',
      },
      children: [],
    }
    const result = serialize(props)
    expect(result).toEqual({
      signalProp: {
        [SERIALIZE_KEY]: 's',
        v: 'hello world',
        id: 0,
      },
    })
  })

  it('Should ignore default properties', () => {
    const props = {
      children: [],
      __wrapped: [],
      // etc...
    }
    const result = serialize(props)
    DEFAULT_PROPS.forEach((defaultProp) => {
      expect(result[defaultProp]).toBeUndefined()
    })
  })
})
