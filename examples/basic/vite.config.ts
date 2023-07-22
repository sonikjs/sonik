import { defineConfig } from 'vite'
import { minifyEs } from 'sonik/vite'

export default defineConfig({
  ssr: {
    noExternal: true,
  },
  plugins: [minifyEs()],
})
