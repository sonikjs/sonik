import { defineConfig } from 'vite'
import { sonikVitePlugin } from 'sonik/vite'

export default defineConfig(() => {
  return {
    plugins: [sonikVitePlugin()],
    build: {
      lib: {
        noExternal: true,
        entry: './app/client.tsx',
        fileName: 'client',
        formats: ['es'],
      },
      manifest: true,
      outDir: './site/static',
    },
  }
})
