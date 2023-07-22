import { defineConfig } from 'vite'
import { devServer, minifyEs } from 'sonik/vite'

export default defineConfig({
  ssr: {
    noExternal: true,
  },
  plugins: [
    devServer({
      entry: './_worker.ts',
    }),
    minifyEs(),
  ],
})
