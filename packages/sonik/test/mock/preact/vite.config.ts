import mdx from '@mdx-js/rollup'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import sonik from '../../../src/vite/index'

export default defineConfig({
  plugins: [
    sonik({
      entry: './test/mock/preact/server.ts',
    }),
    preact(),
    {
      ...mdx({
        jsxImportSource: 'preact',
      }),
    },
  ],
})
