import fs from 'fs'
import { builtinModules } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Plugin, UserConfig } from 'vite'
import { copyDirectory } from '../../utils/file.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const entry = path.join(__dirname, 'entry', 'index.js')
// ./src/static/files => ./dist/files
const staticDir = path.join(__dirname, '../../../files/vite/adapter/vercel/')

const plugin = (): Plugin => {
  let isClientMode = false
  let outputDir = ''

  return {
    name: 'sonik-adapter-vercel',
    config: async ({ mode }): Promise<UserConfig> => {
      if (mode === 'client') {
        isClientMode = true
        return {
          build: {
            lib: {
              entry: './app/client.ts',
              formats: ['es'],
              fileName: 'client',
              name: 'client',
            },
            outDir: './.vercel/output/static/static',
            emptyOutDir: false,
            copyPublicDir: false,
          },
        }
      } else {
        return {
          ssr: {
            external: ['react', 'react-dom', 'solid-js', 'solid-js/web'],
            noExternal: true,
          },
          build: {
            ssr: entry,
            copyPublicDir: false,
            rollupOptions: {
              external: [...builtinModules, /^node:/],
              input: entry,
              output: {
                dir: './.vercel/output/functions/index.func',
              },
            },
          },
        }
      }
    },
    writeBundle(outputOptions) {
      outputDir = outputOptions.dir || ''
    },
    closeBundle() {
      if (!isClientMode) {
        const copyFiles = [
          {
            source: path.join(staticDir, '.vercel/output', 'config.json'),
            destination: path.join(outputDir, '..', '..', 'config.json'),
          },
          {
            source: path.join(staticDir, '.vercel/output/functions/index.func', '.vc-config.json'),
            destination: path.join(outputDir, '.vc-config.json'),
          },
        ]
        for (const { source, destination } of copyFiles) {
          fs.mkdirSync(path.dirname(destination), { recursive: true })
          fs.copyFileSync(source, destination)
          console.log(`Copied from ${source} to ${destination}`)
        }
        // copy public
        copyDirectory('./public', path.join(outputDir, '..', '..', 'static'))
      }
    },
  }
}

export default plugin
