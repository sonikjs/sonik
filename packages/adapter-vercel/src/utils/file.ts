import fs from 'fs'
import path from 'path'

export const copyDirectory = (sourceDir: string, destinationDir: string) => {
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
