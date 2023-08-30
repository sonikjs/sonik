import mdx from '@mdx-js/rollup'
import preact from '@preact/preset-vite'
import sonik from 'sonik/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sonik(),
    preact(),
    {
      ...mdx({
        jsxImportSource: 'preact',
      }),
    },
  ],
})
