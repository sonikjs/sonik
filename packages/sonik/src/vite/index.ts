// eslint-disable-next-line node/no-extraneous-import
import path from 'path'
import devServer, { defaultOptions } from '@hono/vite-dev-server'
import type { DevServerOptions } from '@hono/vite-dev-server'
import type { PluginOption } from 'vite'
import { islandComponents } from './island-components.js'
import { minifyEs } from './minify-es.js'

type SonikOptions = {
  minify?: boolean
  islands?: boolean
  entry?: string
  devServer?: DevServerOptions
}

function sonik(options?: SonikOptions): PluginOption[] {
  const plugins: PluginOption[] = []

  const defaultEntryPath = path.join(process.cwd(), './app/server.ts')

  plugins.push(
    devServer({
      entry: options?.entry ?? defaultEntryPath,
      exclude: [...defaultOptions.exclude, '/app/.+'],
      ...options?.devServer,
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
