import { defineConfig } from 'vite'
import sonik from 'sonik/vite'
import workers from 'sonik/cloudflare-workers'

export default defineConfig({
  plugins: [sonik(), workers()],
})
