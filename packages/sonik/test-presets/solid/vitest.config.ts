import mdx from '@mdx-js/rollup'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { islandComponents } from '../../src/vite/island-components'

export default defineConfig({
  plugins: [
    solidPlugin({
      ssr: true,
    }),
    islandComponents(),
    {
      ...mdx({
        jsxImportSource: 'solid-js/h',
      }),
    },
  ],
})
