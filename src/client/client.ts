import type { signal } from '@preact/signals'
import type { hydrate } from 'preact'
import { deserialize } from './deserializer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FileCallback = () => Promise<{ default: Promise<any> }>

export const createClient = async (options?: {
  hydrate?: typeof hydrate
  signal?: typeof signal
}) => {
  const FILES = import.meta.glob('/app/islands/**/[a-zA-Z0-9[-]+.(tsx|ts)')

  import.meta.glob('/app/routes/**/*.css', {
    eager: true,
  })

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

          const obj = JSON.parse(serializedProps ?? '{}') as Record<string, unknown>

          const promises = Object.keys(obj).map(async (key) => {
            const value = await deserialize(obj[key], { signal: options?.signal })
            return { key, value }
          })

          const results = await Promise.all(promises)

          const props: Record<string, unknown> = {}
          results.forEach((result) => {
            props[result.key] = result.value
          })

          const { createElement, hydrate } = await import('preact')
          const h = options?.hydrate ?? hydrate

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
