import type { PluginOption } from 'vite'
import { minifyEs } from './minify-es.js'
import { devServer } from './dev-server.js'
import { islandComponents } from './island-components.js'
import type { DevServerOptions } from './dev-server.js'
import type { BuildOptions } from './build.js'
import { build } from './build.js'

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
