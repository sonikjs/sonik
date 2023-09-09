import devServer from '@hono/vite-dev-server'
import sonik from 'sonik/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    external: ['react', 'react-dom'],
  },
  plugins: [
    devServer({
      entry: './test/app/server.ts',
    }),
    sonik(),
  ],
})
