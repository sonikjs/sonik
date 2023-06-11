import { type VNode, createElement, hydrate } from 'preact'

type Hydrate = (vnode: VNode, parent: HTMLElement) => void

export const createClient = async (options?: { hydrate?: Hydrate }) => {
  const FILES = import.meta.glob('/src/island/**/[a-zA-Z[-]+.(tsx|ts)', {
    eager: true,
  })
  const h = options?.hydrate ?? hydrate

  Object.keys(FILES).map(async (filePath) => {
    const componentName = filePath.replace(/.*\/src\/island\//, '')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const file = FILES[filePath] as { default: Promise<any> }
    const Component = await file.default

    const newElem = createElement(Component, {})
    const elements = document.querySelectorAll(`[component-name="${componentName}"]`)
    elements.forEach((element) => {
      const parentElement = element.parentElement
      if (parentElement) {
        h(newElem, parentElement)
      }
    })
  })
}
