import type { PluginOption } from 'vite'
import { islandComponentsPlugin } from './island-components'
import { minifyEs } from './minify-es'
import { devServer } from './dev-server'
import type { DevServerOptions } from './dev-server'
import { build } from './build'

type SonikOptions = {
  minify?: boolean
} & DevServerOptions

function sonik(options: SonikOptions): PluginOption[] {
  const plugins: PluginOption[] = [islandComponentsPlugin()]
  if (options && options.minify === true) {
    plugins.push(minifyEs())
  }
  plugins.push(devServer(options), build(options))
  return plugins
}

export default sonik
