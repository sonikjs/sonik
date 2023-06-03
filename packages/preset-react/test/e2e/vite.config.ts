import sonik, { devServerDefaultOptions } from 'sonik/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    external: ['react', 'react-dom'],
  },
  plugins: [
    sonik({
      entry: '../app/server.ts',
      devServer: {
        exclude: ['/test/app/*', '/app/*', ...devServerDefaultOptions.exclude],
      },
    }),
  ],
})
