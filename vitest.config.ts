import mdx from '@mdx-js/rollup'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    exclude: ['node_modules', 'dist', '.git', '.cache', 'test-presets', 'sandbox'],
  },
  plugins: [
    {
      ...mdx({
        jsxImportSource: 'hono/jsx',
      }),
    },
  ],
})
