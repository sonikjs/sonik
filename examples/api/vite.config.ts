import { defineConfig } from 'vite'
import sonik from 'sonik/vite'

export default defineConfig({
  plugins: [
    sonik({
      entry: './server.ts',
      minify: true,
    }),
  ],
})
