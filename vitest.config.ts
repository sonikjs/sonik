import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    __STATIC_CONTENT_MANIFEST: JSON.stringify({}), // ここでモックデータを設定
  },
  test: {
    environment: 'miniflare',
  },
})
