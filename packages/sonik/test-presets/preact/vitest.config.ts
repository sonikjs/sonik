import mdx from '@mdx-js/rollup'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    preact(),
    {
      ...mdx({
        jsxImportSource: 'preact',
      }),
    },
  ],
})
