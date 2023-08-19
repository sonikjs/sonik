import sonik from 'sonik/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  build: {
    ssr: true,
  },
  ssr: {
    external: ['solid-js', 'solid-js/web'],
  },
  plugins: [
    solidPlugin({
      ssr: true,
    }),
    sonik({
      build: {
        ssr: {
          entry: './app/server.ts',
        },
      },
    }),
  ],
})
