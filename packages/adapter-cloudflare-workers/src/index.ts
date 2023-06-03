import { builtinModules } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Plugin, UserConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const entry = path.join(__dirname, 'entry', 'index.js')

const plugin = (): Plugin => {
  return {
    name: 'sonik-adapter-cloudflare-workers',
    config: async ({ mode }): Promise<UserConfig> => {
      if (mode === 'client') {
        return {}
      } else {
        return {
          ssr: {
            external: ['react', 'react-dom', 'solid-js', 'solid-js/web'],
            noExternal: true,
          },
          build: {
            ssr: entry,
            rollupOptions: {
              external: [...builtinModules, /^node:/],
              input: entry,
              output: {
                dir: './dist',
              },
            },
          },
        }
      }
    },
  }
}

export default plugin
