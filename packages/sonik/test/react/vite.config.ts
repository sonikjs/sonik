import mdx from '@mdx-js/rollup'
import { defineConfig } from 'vite'
import sonik from '../../src/vite/index'

export default defineConfig({
  ssr: {
    external: ['react', 'react-dom'],
  },
  server: {
    hmr: false,
  },
  plugins: [
    sonik({
      entry: './app/server.ts',
    }),
    {
      ...mdx({
        jsxImportSource: 'react',
      }),
    },
  ],
})
