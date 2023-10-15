const escapeRe = /[&<>'"]/

export const escape = (str: string): string => {
  const match = str.search(escapeRe)
  if (match === -1) {
    return str
  }

  let res = ''

  let escape
  let index
  let lastIndex = 0

  for (index = match; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;'
        break
      case 39: // '
        escape = '&#x27;'
        break
      case 38: // &
        escape = '&amp;'
        break
      case 60: // <
        escape = '&lt;'
        break
      case 62: // >
        escape = '&gt;'
        break
      default:
        continue
    }

    res += str.substring(lastIndex, index) + escape
    lastIndex = index + 1
  }

  res += str.substring(lastIndex, index)
  return res
}

export function createTagString(name: string, records: Record<string, string>[]): string {
  const result: string[] = []
  if (records.length > 0) {
    for (const record of records) {
      let str: string = `<${name} `
      for (const [k, v] of Object.entries(record)) {
        str += `${escape(k)}="${escape(v)}" `
      }
      str += '/>'
      result.push(str)
    }
  }
  return result.join('')
}
