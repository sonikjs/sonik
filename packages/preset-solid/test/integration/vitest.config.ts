import mdx from '@mdx-js/rollup'
import sonik from 'sonik/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default defineConfig({
  plugins: [
    solidPlugin({
      ssr: true,
    }),
    sonik(),
    {
      ...mdx({
        jsxImportSource: 'solid-js/h',
      }),
    },
  ],
})
