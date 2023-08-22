import sonik from 'sonik/vite'
import { defineConfig } from 'vite'
import pages from 'sonik/cloudflare-pages'

export default defineConfig({
  define: {
    'process.env': process.env,
  },
  plugins: [
    sonik({
      minify: true,
    }),
    pages(),
  ],
})
