import { defineConfig } from 'vite'
import sonik from 'sonik/vite'
import pages from 'sonik/cloudflare-pages'

export default defineConfig({
  plugins: [sonik(), pages()],
})
