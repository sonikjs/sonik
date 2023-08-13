import sonik from 'sonik/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  ssr: {
    external: ['solid-js'],
  },
  plugins: [
    solidPlugin({
      ssr: true,
      solid: {
        hydratable: true,
      },
    }),
    sonik({
      entry: './_worker.ts',
    }),
  ],
})
