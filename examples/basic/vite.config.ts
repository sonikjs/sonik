import { defineConfig } from 'vite'
import sonik from 'sonik/vite'

export default defineConfig({
  plugins: [
    sonik({
      entry: './_worker.ts',
      client: '/app/client.ts',
      passThrough: ['/static/client.js'],
    }),
  ],
})
