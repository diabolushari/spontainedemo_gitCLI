export const snakeToCamel = (str: string) => {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const camelToNormal = (str: string) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}
