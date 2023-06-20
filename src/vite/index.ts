import type { PluginOption } from 'vite'
import { islandComponents } from './island-components'
import { minifyEs } from './minify-es'

type SonikVitePluginOptions = {
  minify?: boolean
}

export function sonikVitePlugin(options?: SonikVitePluginOptions): PluginOption[] {
  if (options && options.minify === false) {
    return [islandComponents()]
  }
  return [islandComponents(), minifyEs()]
}
