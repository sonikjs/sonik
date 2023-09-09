import devServer from '@hono/vite-dev-server'
import sonik from 'sonik/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  ssr: {
    external: ['solid-js', 'solid-js/web'],
  },
  plugins: [
    devServer({
      entry: './test/app/server.ts',
    }),
    sonik(),
    solidPlugin({
      ssr: true,
    }),
  ],
})
