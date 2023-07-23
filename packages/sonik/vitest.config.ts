import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [
    {
      ...mdx({
        jsxImportSource: 'preact',
      }),
    },
  ],
})
