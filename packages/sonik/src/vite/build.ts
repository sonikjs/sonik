// eslint-disable-next-line node/no-extraneous-import
import { builtinModules } from 'module'
import type { Plugin, UserConfig } from 'vite'

export type BuildOptions = {
  ssr?: {
    entry?: string
    outFile?: string
  }
  client?: {
    entry?: string
    name?: string
    outDir?: string
  }
}

export function build(options: BuildOptions): Plugin {
  return {
    name: 'sonik-vite-build',
    config: ({ mode }): UserConfig => {
      if (mode === 'client') {
        return {
          build: {
            lib: {
              entry: options.client?.entry ?? './app/client.ts',
              formats: ['es'],
              fileName: options.client?.name ?? 'client',
              name: options.client?.name ?? 'client',
            },
            copyPublicDir: false,
            outDir: options.client?.outDir ?? './dist/static',
          },
        }
      } else {
        return {
          ssr: {
            noExternal: true,
          },
          build: {
            ssr: options.ssr?.entry ?? './entry.ts',
            rollupOptions: {
              external: [...builtinModules, /^node:/],
              input: options.ssr?.entry ?? './entry.ts',
              output: {
                file: options.ssr?.outFile ?? undefined,
              },
            },
          },
        }
      }
    },
  }
}
