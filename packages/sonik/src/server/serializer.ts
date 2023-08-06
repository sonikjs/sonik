import { DEFAULT_PROPS, SERIALIZE_KEY } from '../constants.js'

export const serialize = (props: Record<string, unknown>) => {
  const data: Record<string, unknown> = {}
  Object.keys(props).map((key) => {
    if (!DEFAULT_PROPS.includes(key)) {
      const value = props[key]
      data[key] = { [SERIALIZE_KEY]: 'l', v: value }
    }
  })
  return data
}
