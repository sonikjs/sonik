import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { islandComponents } from '../../src/vite/island-components'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
    }),
    islandComponents(),
    {
      ...mdx({
        jsxImportSource: 'react',
      }),
    },
  ],
})
