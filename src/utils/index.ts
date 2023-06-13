export const filePathToPath = (filePath: string, rootPath: string = '/app/routes') => {
  return filePath
    .replace(rootPath, '')
    .replace(/\.tsx$/g, '')
    .replace(/^\/index/, '/') // `/index`
    .replace(/\/index/, '') // `/about/index`
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1')
}

export const sortObject = <T>(obj: Record<string, T>) => {
  const sortedEntries = Object.entries(obj).sort((a, b) => {
    if (a[0] > b[0]) {
      return -1
    }
    if (a[0] < b[0]) {
      return 1
    }
    return 0
  })

  const sortedObject: Record<string, T> = {}
  for (const [key, value] of sortedEntries) {
    sortedObject[key] = value
  }

  return sortedObject
}
