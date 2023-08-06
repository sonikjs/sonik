import type { PluginOption } from 'vite'
import { minifyEs } from './minify-es'
import { devServer } from './dev-server'
import { islandComponents } from './island-components'
import type { DevServerOptions } from './dev-server'
import type { BuildOptions } from './build'
import { build } from './build'

type SonikOptions = {
  minify?: boolean
  islands?: boolean
} & DevServerOptions &
  BuildOptions

function sonik(options: SonikOptions): PluginOption[] {
  const plugins: PluginOption[] = []
  if (options) {
    if (options.minify === true) {
      plugins.push(minifyEs())
    }
    if (options.islands !== false) {
      plugins.push(islandComponents())
    }
  }
  plugins.push(devServer(options), build(options))
  return plugins
}

export default sonik
