import { type VNode, createElement, hydrate } from 'preact'

type Hydrate = (vnode: VNode, parent: HTMLElement) => void

export const createClient = async (options?: { hydrate?: Hydrate }) => {
  const FILES = import.meta.glob('/src/islands/**/[a-zA-Z[-]+.(tsx|ts)')
  const h = options?.hydrate ?? hydrate

  Object.keys(FILES).map(async (filePath) => {
    const componentName = filePath.replace(/.*\/src\/islands\//, '')

    const elements = document.querySelectorAll(`[component-name="${componentName}"]`)
    if (elements) {
      elements.forEach(async (element) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileCallback = FILES[filePath] as () => Promise<{ default: Promise<any> }>
        const file = await fileCallback()
        const Component = await file.default
        const newElem = createElement(Component, {})

        const parentElement = element.parentElement
        if (parentElement) {
          h(newElem, parentElement)
        }
      })
    }
  })
}
