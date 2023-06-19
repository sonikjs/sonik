import type { Signal, signal } from '@preact/signals'
import { SERIALIZE_KEY } from '../constants'

const signalMap = new Map<string, Signal>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deserialize = async (value: any, options?: { signal?: typeof signal }) => {
  if (typeof value === 'object' && value && SERIALIZE_KEY in value && 'v' in value) {
    if (value[SERIALIZE_KEY] === 's') {
      let signal = options?.signal
      if (!signal) {
        const m = await import('@preact/signals')
        signal = m.signal
      }

      const existingSignal = signalMap.get(value.id)
      if (existingSignal) {
        return existingSignal
      } else {
        const newSignal = signal(value.v)
        signalMap.set(value.id, newSignal)
        return newSignal
      }
    }

    if (value[SERIALIZE_KEY] === 'l') {
      return value.v
    }
  }
}
