import { SERIALIZE_KEY } from '../constants.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deserialize = async (value: any) => {
  if (typeof value === 'object' && value && SERIALIZE_KEY in value && 'v' in value) {
    if (value[SERIALIZE_KEY] === 'l') {
      return value.v
    }
  }
}
