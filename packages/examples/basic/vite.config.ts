import { defineConfig } from 'vite'
import { nashiVitePlugin } from 'nashi/vite-plugin'
import { resolve } from 'path'
import { transform } from 'esbuild'

export default defineConfig(({ mode }) => {
  if (mode === 'server') {
    return {
      plugins: [nashiVitePlugin(), minifyEs()],
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
    plugins: [nashiVitePlugin(), minifyEs()],
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

function minifyEs() {
  return {
    name: 'minifyEs',
    renderChunk: {
      order: 'post',
      async handler(code, chunk, outputOptions) {
        if (outputOptions.format === 'es') {
          return await transform(code, { minify: true })
        }
        return code
      },
    },
  }
}
