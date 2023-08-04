import type { Plugin, UserConfig } from 'vite'

export type BuildOptions = {
  entry: string
  outFile?: string
}

export function build(options: BuildOptions): Plugin {
  return {
    name: 'sonik-vite-client',
    config: (): UserConfig => {
      return {
        ssr: {
          noExternal: true,
        },
        build: {
          ssr: options.entry,
          rollupOptions: {
            input: options.entry,
            output: {
              file: options.outFile ?? undefined,
            },
          },
        },
      }
    },
  }
}
