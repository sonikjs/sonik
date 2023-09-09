// eslint-disable-next-line node/no-extraneous-import
import devServer from '@hono/vite-dev-server'
import type { PluginOption } from 'vite'
import { islandComponents } from './island-components.js'
import { minifyEs } from './minify-es.js'

type SonikOptions = {
  minify?: boolean
  islands?: boolean
  entry?: string
}

function sonik(options?: SonikOptions): PluginOption[] {
  const plugins: PluginOption[] = []

  plugins.push(
    devServer({
      entry: options?.entry ?? './app/sever.ts',
    })
  )

  if (options?.minify === true) {
    plugins.push(minifyEs())
  }
  if (options?.islands !== false) {
    plugins.push(islandComponents())
  }

  return plugins
}

export default sonik
