import { COMPONENT_NAME, DATA_SERIALIZED_PROPS } from '../constants.js'
import type { CreateElement, Hydrate } from '../types.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FileCallback = () => Promise<{ default: Promise<any> }>

export type ClientOptions = {
  hydrate: Hydrate
  createElement: CreateElement
}

export const createClient = async (options: ClientOptions) => {
  const FILES = import.meta.glob('/app/islands/**/[a-zA-Z0-9[-]+.(tsx|ts)')

  const hydrateComponent = async () => {
    const filePromises = Object.keys(FILES).map(async (filePath) => {
      const componentName = filePath.replace(/.*\/app\/islands\//, '')
      const elements = document.querySelectorAll(`[${COMPONENT_NAME}="${componentName}"]`)
      if (elements) {
        const elementPromises = Array.from(elements).map(async (element) => {
          const fileCallback = FILES[filePath] as FileCallback
          const file = await fileCallback()
          const Component = await file.default

          const serializedProps = element.attributes.getNamedItem(DATA_SERIALIZED_PROPS)?.value
          const props = JSON.parse(serializedProps ?? '{}') as Record<string, unknown>

          const hydrate = options.hydrate
          const createElement = options.createElement

          const newElem = createElement(Component, props)
          hydrate(newElem, element)
        })
        await Promise.all(elementPromises)
      }
    })

    await Promise.all(filePromises)
  }

  await hydrateComponent()
}
