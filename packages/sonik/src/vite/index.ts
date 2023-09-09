// eslint-disable-next-line node/no-extraneous-import
import type { PluginOption } from 'vite'
import { islandComponents } from './island-components.js'
import { minifyEs } from './minify-es.js'

type SonikOptions = {
  minify?: boolean
  islands?: boolean
}

function sonik(options?: SonikOptions): PluginOption[] {
  const plugins: PluginOption[] = []

  if (options?.minify === true) {
    plugins.push(minifyEs())
  }
  if (options?.islands !== false) {
    plugins.push(islandComponents())
  }

  return plugins
}

export default sonik
