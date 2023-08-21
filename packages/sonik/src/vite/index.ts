// eslint-disable-next-line node/no-extraneous-import
import type { PluginOption } from 'vite'
import { devServer } from './dev-server.js'
import type { DevServerOptions } from './dev-server.js'
import { islandComponents } from './island-components.js'
import { minifyEs } from './minify-es.js'

type SonikOptions = {
  minify?: boolean
  islands?: boolean
} & DevServerOptions

function sonik(options: SonikOptions): PluginOption[] {
  const plugins: PluginOption[] = []

  if (options.minify === true) {
    plugins.push(minifyEs())
  }
  if (options.islands !== false) {
    plugins.push(islandComponents())
  }

  plugins.push(devServer(options))
  return plugins
}

export default sonik
