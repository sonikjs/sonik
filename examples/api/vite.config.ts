import { defineConfig } from 'vite'
import sonik from 'sonik/vite'
import workers from '@sonikjs/cloudflare-workers'

export default defineConfig({
  plugins: [sonik(), workers()],
})
