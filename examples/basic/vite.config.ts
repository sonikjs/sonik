import { defineConfig } from 'vite'
import { sonikVitePlugin, minifyEs } from 'sonik/vite-plugins'

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
        ssr: './app/server.ts',
      },
    }
  }
  return {
    plugins: [sonikVitePlugin({ shouldWrap: false }), minifyEs()],
    build: {
      lib: {
        noExternal: true,
        entry: './app/client.tsx',
        fileName: 'client',
        formats: ['es'],
      },
      minify: true,
    },
  }
})
