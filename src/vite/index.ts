import type { PluginOption } from 'vite'
import { islandComponentsPlugin } from './island-components'
import { minifyEsPlugin } from './minify-es'

type SonikVitePluginOptions = {
  minify?: boolean
}

export function sonikVite(options?: SonikVitePluginOptions): PluginOption[] {
  if (options && options.minify === false) {
    return [islandComponentsPlugin()]
  }
  return [islandComponentsPlugin(), minifyEsPlugin()]
}

export { sonikViteServer } from './server'
export { sonikViteClient } from './client'
