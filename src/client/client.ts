import type { Signal, signal } from '@preact/signals'
import { createElement, hydrate } from 'preact'
import { SERIALIZE_KEY } from '../constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FileCallback = () => Promise<{ default: Promise<any> }>

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

export const createClient = async (options?: {
  hydrate?: typeof hydrate
  signal?: typeof signal
}) => {
  const FILES = import.meta.glob('/app/islands/**/[a-zA-Z0-9[-]+.(tsx|ts)')
  const h = options?.hydrate ?? hydrate

  const hydrateComponent = async () => {
    const filePromises = Object.keys(FILES).map(async (filePath) => {
      const componentName = filePath.replace(/.*\/app\/islands\//, '')

      const elements = document.querySelectorAll(`[component-name="${componentName}"]`)
      if (elements) {
        const elementPromises = Array.from(elements).map(async (element) => {
          const fileCallback = FILES[filePath] as FileCallback
          const file = await fileCallback()
          const Component = await file.default

          const serializedProps = element.attributes.getNamedItem('data-serialized-props')?.value

          const obj = JSON.parse(serializedProps ?? '{}') as Record<string, any>

          const promises = Object.keys(obj).map(async (key) => {
            const value = await deserialize(obj[key], { signal: options?.signal })
            return { key, value }
          })

          const results = await Promise.all(promises)

          const props: Record<string, unknown> = {}
          results.forEach((result) => {
            props[result.key] = result.value
          })

          const wrapper = element.parentElement
          const temp = document.createElement('div')
          if (wrapper && wrapper.parentElement) {
            wrapper.parentElement.replaceChild(temp, wrapper)
            const newElem = createElement(Component, props)
            h(newElem, temp)
          }
        })
        await Promise.all(elementPromises)
      }
    })

    await Promise.all(filePromises)
  }

  await hydrateComponent()
}
