import type { PluginOption } from 'vite'
import { minifyEs } from './minify-es'
import { devServer } from './dev-server'
import type { DevServerOptions } from './dev-server'
import type { BuildOptions } from './build'
import { build } from './build'

type SonikOptions = {
  minify?: boolean
} & DevServerOptions &
  BuildOptions

function sonik(options: SonikOptions): PluginOption[] {
  const plugins: PluginOption[] = []
  if (options && options.minify === true) {
    plugins.push(minifyEs())
  }
  plugins.push(devServer(options), build(options))
  return plugins
}

export default sonik
