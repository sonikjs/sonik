import type { Plugin, UserConfig } from 'vite'
import { builtinModules } from 'module'
import path from 'path'

const entry = path.join(__dirname, 'entry', 'index.js')

const plugin = (): Plugin => {
  return {
    name: 'sonik-adapter-cloudflare-workers',
    config: async ({ mode }): Promise<UserConfig> => {
      if (mode === 'client') {
        return {
          build: {
            lib: {
              entry: './app/client.ts',
              formats: ['es'],
              fileName: 'client',
              name: 'client'
            },
            rollupOptions: {
              output: {
                dir: './dist/site/static'
              }
            },
            copyPublicDir: false
          }
        }
      } else {
        return {
          ssr: {
            external: ['__STATIC_CONTENT_MANIFEST', 'react', 'react-dom', 'solid-js', 'solid-js/web'],
            noExternal: true
          },
          build: {
            ssr: entry,
            rollupOptions: {
              external: ['__STATIC_CONTENT_MANIFEST', ...builtinModules, /^node:/],
              input: entry,
              output: {
                dir: './dist'
              }
            }
          }
        }
      }
    }
  }
}

export default plugin
