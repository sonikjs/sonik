// eslint-disable-next-line node/no-extraneous-import
import path from 'path'
import devServer, { defaultOptions } from '@hono/vite-dev-server'
import type { DevServerOptions } from '@hono/vite-dev-server'
import type { PluginOption } from 'vite'
import { islandComponents } from './island-components.js'

type SonikOptions = {
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
      exclude: [...defaultOptions.exclude, /^\/app\/.+/, /^\/favicon.ico/, /^\/static\/.+/],
      ...options?.devServer,
    })
  )

  if (options?.islands !== false) {
    plugins.push(islandComponents())
  }

  return plugins
}

export const devServerDefaultOptions = defaultOptions

export default sonik
