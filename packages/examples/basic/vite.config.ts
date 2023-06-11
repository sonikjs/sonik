import { defineConfig } from 'vite'
import { sonikVitePlugin, minifyEs } from 'sonik/vite-plugins'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  if (mode === 'server') {
    return {
      plugins: [sonikVitePlugin({ shouldWrap: true }), minifyEs()],
      ssr: {
        noExternal: true,
        format: 'esm',
      },
      build: {
        rollupOptions: {
          external: ['__STATIC_CONTENT_MANIFEST', 'preact'],
        },
        target: 'esnext',
        ssr: './src/server.ts',
      },
    }
  }
  return {
    plugins: [sonikVitePlugin({ shouldWrap: false }), minifyEs()],
    build: {
      lib: {
        noExternal: true,
        entry: resolve(__dirname, './src/client.tsx'),
        fileName: 'client',
        formats: ['es'],
      },
      minify: true,
    },
  }
})
