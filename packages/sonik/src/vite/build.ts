import type { Plugin, UserConfig } from 'vite'

type BuildOptions = {
  entry: string
  outDir?: string
  clientEntry?: string
  clientName?: string
  clientOutDir?: string
}

export function build(options: BuildOptions): Plugin {
  return {
    name: 'sonik-vite-client',
    config: ({ mode }): UserConfig => {
      if (mode === 'client') {
        return {
          build: {
            lib: {
              entry: options.clientEntry ?? './app/client.ts',
              formats: ['es'],
              fileName: options.clientName ?? 'client',
              name: options.clientName ?? 'client',
            },
            outDir: options.clientOutDir ?? './dist/static',
          },
        }
      } else {
        return {
          ssr: {
            noExternal: true,
          },
          build: {
            ssr: options.entry,
            outDir: options.outDir ?? './dist',
          },
        }
      }
    },
  }
}
