import { defineConfig } from 'vite'
import { islandComponents } from '../../../src/vite/island-components'

export default defineConfig({
  plugins: [islandComponents()],
})
