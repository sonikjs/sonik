import sonik from 'sonik/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import pages from 'sonik/cloudflare-pages'

export default defineConfig({
  plugins: [
    solidPlugin({
      ssr: true,
    }),
    sonik(),
    pages(),
  ],
})
