export const filePathToPath = (filePath: string) => {
  return filePath
    .replace(/\/src\/app|\.tsx$/g, '')
    .replace(/^\/index/, '/') // `/index`
    .replace(/\/index/, '') // `/about/index`
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1')
}
