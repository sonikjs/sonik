import { defineConfig } from 'vite'
import { sonikVitePlugin, minifyEs } from 'sonik/vite-plugins'

export default defineConfig(({ mode }) => {
  if (mode === 'server') {
    return {
      plugins: [sonikVitePlugin(), minifyEs()],
      ssr: {
        noExternal: true,
        format: 'esm',
      },
      build: {
        rollupOptions: {
          external: ['__STATIC_CONTENT_MANIFEST', 'preact'],
        },
        target: 'esnext',
        ssr: './app/server.ts',
      },
    }
  }
  return {
    plugins: [sonikVitePlugin(), minifyEs()],
    build: {
      lib: {
        noExternal: true,
        entry: './app/client.tsx',
        fileName: 'client',
        formats: ['es'],
      },
      manifest: true,
      ssrManifest: true,
      minify: true,
    },
  }
})
