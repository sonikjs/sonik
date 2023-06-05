export const filePathToPath = (filePath: string, rootPath: string = '/src/app') => {
  return filePath
    .replace(rootPath, '')
    .replace(/\.tsx$/g, '')
    .replace(/^\/index/, '/') // `/index`
    .replace(/\/index/, '') // `/about/index`
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1')
}
