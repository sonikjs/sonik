import type { Plugin, UserConfig } from 'vite'
import { builtinModules } from 'module'
import path from 'path'
import fs from 'fs'

const entry = path.join(__dirname, 'entry', 'index.js')

const plugin = (): Plugin => {
  let isClientMode = false
  let outputDir = ''

  const copyDirectory = (sourceDir: string, destinationDir: string) => {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true })

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name)
      const destinationPath = path.join(destinationDir, entry.name)

      if (entry.isDirectory()) {
        fs.mkdirSync(destinationPath, { recursive: true })
        copyDirectory(sourcePath, destinationPath)
      } else {
        fs.mkdirSync(path.dirname(destinationPath), { recursive: true })
        fs.copyFileSync(sourcePath, destinationPath)
      }
    }
  }

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
              name: 'client'
            },
            outDir: './.vercel/output/static/static',
            emptyOutDir: false,
            copyPublicDir: false
          }
        }
      } else {
        return {
          ssr: {
            external: ['react', 'react-dom', 'solid-js', 'solid-js/web'],
            noExternal: true
          },
          build: {
            ssr: entry,
            copyPublicDir: false,
            rollupOptions: {
              external: [...builtinModules, /^node:/],
              input: entry,
              output: {
                dir: './.vercel/output/functions/index.func'
              }
            }
          }
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
            source: path.join(__dirname, 'files', '.vercel', 'output', 'config.json'),
            destination: path.join(outputDir, '..', '..', 'config.json')
          },
          {
            source: path.join(__dirname, 'files', '.vercel', 'output', 'functions', 'index.func', '.vc-config.json'),
            destination: path.join(outputDir, '.vc-config.json')
          }
        ]
        for (const { source, destination } of copyFiles) {
          fs.mkdirSync(path.dirname(destination), { recursive: true })
          fs.copyFileSync(source, destination)
          console.log(`Copied from ${source} to ${destination}`)
        }
        // copy public
        copyDirectory('./public', path.join(outputDir, '..', '..', 'static'))
      }
    }
  }
}

export default plugin
