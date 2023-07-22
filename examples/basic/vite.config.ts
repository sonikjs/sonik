import { defineConfig } from 'vite'

export default defineConfig(({ ssrBuild }) => {
  if (ssrBuild) {
    return {
      ssr: {
        noExternal: true,
      },
    }
  } else {
    return {}
  }
})
