import mdx from '@mdx-js/rollup'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import { islandComponents } from '../../src/vite/island-components'

export default defineConfig({
  plugins: [
    preact(),
    islandComponents(),
    {
      ...mdx({
        jsxImportSource: 'preact',
      }),
    },
  ],
})
