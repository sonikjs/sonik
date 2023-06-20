import type { MiddlewareHandler } from 'hono'
import { bufferToString } from 'hono/utils/buffer'
import { getContentFromKVAsset } from 'hono/utils/cloudflare'

type Manifest = Record<
  string,
  {
    dynamicImports?: string[]
    imports?: string[]
    file: string
    src: string
  }
>

// @ts-ignore
import kvManifestJSON from '__STATIC_CONTENT_MANIFEST'

let manifest: Manifest | undefined

export const preloadMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    await next()
    if (c.res.headers.get('content-type')?.startsWith('text/html')) {
      if (!manifest) {
        const manifestJson = await getContentFromKVAsset('static/manifest.json', {
          manifest: JSON.parse(kvManifestJSON),
          // @ts-ignore
          namespace: c.env.__STATIC_CONTENT,
        })

        if (!manifestJson) return
        manifest = JSON.parse(bufferToString(manifestJson)) as Manifest
      }

      const preloads: string[] = []

      class ElementHandler {
        element(element: HTMLElement) {
          const componentName = element.getAttribute('component-name')
          if (componentName) {
            const componentPath = `app/islands/${componentName}`
            const component = manifest![componentPath]
            if (component) {
              preloads.push(component.file)
              if (component.imports) {
                for (const path of component.imports) {
                  const importComponent = manifest![path]
                  if (importComponent) {
                    preloads.push(importComponent.file)
                  }
                }
              }
            }
          }
        }
      }

      const response = c.res
      const rewriter = new HTMLRewriter().on('*[component-name]', new ElementHandler())
      const transformedResponse = rewriter.transform(response)
      const clonedResponse = transformedResponse.clone()
      await transformedResponse.blob()
      c.res = clonedResponse
      preloads.forEach((path) => {
        c.res.headers.append('Link', `</static/${path}>; rel=modulepreload; as=script`)
      })
    }
  }
}
