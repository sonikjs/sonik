import sonik from 'sonik/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  ssr: {
    external: ['solid-js', 'solid-js/web'],
  },
  plugins: [
    sonik({
      entry: './test/app/server.ts',
    }),
    solidPlugin({
      ssr: true,
    }),
  ],
})
