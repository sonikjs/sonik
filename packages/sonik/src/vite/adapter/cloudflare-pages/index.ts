import type { Plugin, UserConfig } from 'vite'
import { builtinModules } from 'module'
import path from 'path'

const entry = path.join(__dirname, 'entry', '_worker.js')

const plugin = (): Plugin => {
  return {
    name: 'sonik-adapter-cloudflare-pages',
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
                dir: './dist/static'
              }
            },
            copyPublicDir: false
          }
        }
      } else {
        return {
          ssr: {
            external: ['react', 'react-dom', 'solid-js', 'solid-js/web'],
            noExternal: true
          },
          build: {
            emptyOutDir: true,
            ssr: entry,
            rollupOptions: {
              external: [...builtinModules, /^node:/],
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
