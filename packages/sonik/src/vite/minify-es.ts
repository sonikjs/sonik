import { transform } from 'esbuild'
import type { Plugin } from 'vite'

export function minifyEs(): Plugin {
  return {
    name: 'minify-es',
    renderChunk: {
      order: 'post',
      async handler(code, _, outputOptions) {
        if (outputOptions.format === 'es') {
          return await transform(code, { minify: true })
        }
        return code
      },
    },
  }
}
