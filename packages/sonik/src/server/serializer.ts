import type { Signal } from '@preact/signals'
import { DEFAULT_PROPS, SERIALIZE_KEY } from '../constants'

export class Serializer {
  private signalIdCounter = 0
  readonly signalMap = new Map()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isSignal(x: any): x is Signal {
    return x !== null && typeof x === 'object' && typeof x.peek === 'function' && 'value' in x
  }

  serialize(props: Record<string, unknown>) {
    const data: Record<string, unknown> = {}
    Object.keys(props).map((key) => {
      if (!DEFAULT_PROPS.includes(key)) {
        const value = props[key]
        if (this.isSignal(value)) {
          let signalId
          if (this.signalMap.has(value)) {
            signalId = this.signalMap.get(value)
          } else {
            signalId = this.signalIdCounter++
            this.signalMap.set(value, signalId)
          }
          data[key] = { [SERIALIZE_KEY]: 's', v: value.peek(), id: signalId }
        } else {
          data[key] = { [SERIALIZE_KEY]: 'l', v: value }
        }
      }
    })
    return data
  }
}
