import { deserialize } from './deserializer'
import { COMPONENT_NAME, DATA_SERIALIZED_PROPS } from '../constants'
import type { Node } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FileCallback = () => Promise<{ default: Promise<any> }>

type Hydrate = (children: Node, parent: HTMLElement) => void
type CreateElement = (type: any, props: any) => Node

type ClientOptions = {
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

          const obj = JSON.parse(serializedProps ?? '{}') as Record<string, unknown>

          const promises = Object.keys(obj).map(async (key) => {
            const value = await deserialize(obj[key])
            return { key, value }
          })

          const results = await Promise.all(promises)

          const props: Record<string, unknown> = {}
          results.forEach((result) => {
            props[result.key] = result.value
          })

          const hydrate = options.hydrate
          const createElement = options.createElement

          const wrapper = element.parentElement
          const temp = document.createElement('div')
          if (wrapper && wrapper.parentElement) {
            wrapper.parentElement.replaceChild(temp, wrapper)
            const newElem = createElement(Component, props)
            hydrate(newElem, temp)
          }
        })
        await Promise.all(elementPromises)
      }
    })

    await Promise.all(filePromises)
  }

  await hydrateComponent()
}
