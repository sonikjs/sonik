export const filePathToPath = (filePath: string) => {
  return filePath
    .replace(/\/src\/app|index|\.tsx$/g, '')
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1')
}
