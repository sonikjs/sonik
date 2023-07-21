import type { Plugin, UserConfig } from 'vite'

type SonikViteClientOptions = {
  entry?: string
  name?: string
  fileName?: string
  outDir?: string
}

export function sonikViteClient(options?: SonikViteClientOptions): Plugin {
  return {
    name: 'sonik-vite-client',
    config: () => {
      const pluginConfig: UserConfig = {
        build: {
          lib: {
            entry: options?.entry ?? ['./app/client.ts'],
            formats: ['es'],
            fileName: options?.fileName ?? 'client',
            name: options?.name ?? 'client',
          },
          manifest: true,
          outDir: options?.outDir ?? './site/static',
        },
      }
      return pluginConfig
    },
  }
}
