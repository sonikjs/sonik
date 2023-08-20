import sonik from 'sonik/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  ssr: {
    external: ['solid-js', 'solid-js/web'],
  },
  plugins: [
    solidPlugin({
      ssr: true,
    }),
    sonik({
      entry: './_worker.ts',
      minify: true,
    }),
  ],
})
