import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    noExternal: true,
    format: 'esm',
  },
  build: {
    target: 'esnext',
    ssr: './src/index.ts',
    minify: true,
  },
})
