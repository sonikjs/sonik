import sonik from 'sonik/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sonik({
      entry: './test/app/server.ts',
    }),
  ],
})
