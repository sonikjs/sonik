import { transform } from 'esbuild'
import type { NormalizedOutputOptions, RenderedChunk } from 'rollup'

export function minifyEs() {
  return {
    name: 'minifyEs',
    renderChunk: {
      order: 'post',
      async handler(code: string, _: RenderedChunk, outputOptions: NormalizedOutputOptions) {
        if (outputOptions.format === 'es') {
          return await transform(code, { minify: true })
        }
        return code
      },
    },
  }
}
