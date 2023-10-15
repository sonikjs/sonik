// eslint-disable-next-line node/no-extraneous-import
import { glob } from 'glob'
import { defineConfig } from 'tsup'

const entryPoints = glob.sync('./src/**/*.+(ts|tsx|json)', {
  ignore: ['./src/**/*.test.+(ts|tsx)'],
})

export default defineConfig({
  entry: entryPoints,
  dts: true,
  tsconfig: './tsconfig.json',
  splitting: false,
  minify: false,
  format: ['esm'],
  bundle: false,
  platform: 'node',
})
