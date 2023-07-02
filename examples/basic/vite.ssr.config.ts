import { defineConfig } from 'vite'
import { sonikVitePlugin } from 'sonik/vite'

export default defineConfig(({ mode }) => {
  return {
    plugins: [sonikVitePlugin()],
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
})
