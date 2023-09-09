import devServer from '@hono/vite-dev-server'
import preact from '@preact/preset-vite'
import sonik from 'sonik/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    devServer({
      entry: './test/app/server.ts',
    }),
    sonik(),
    preact(),
  ],
})
