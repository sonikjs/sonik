import { exec } from 'child_process'
import arg from 'arg'
import { context, build } from 'esbuild'
import type { BuildOptions } from 'esbuild'
import glob from 'glob'

const args = arg({
  '--watch': Boolean,
})

const isWatch = args['--watch'] || false

const entryPoints = glob.sync('./src/**/*.ts', {
  ignore: ['./src/**/*.test.ts'],
})

const options: BuildOptions = {
  entryPoints,
  logLevel: 'info',
  platform: 'node',
  minify: true,
  outbase: './src',
  outdir: './dist',
  format: 'esm',
}

if (isWatch) {
  const ctx = await context(options)
  ctx.watch()
} else {
  build(options)
}

exec(`tsc ${isWatch ? '-w' : ''} --emitDeclarationOnly --declaration --project tsconfig.build.json`)
