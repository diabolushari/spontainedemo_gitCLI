export const defaultUnits = (field: string) => {
  const lower = field.toLowerCase()

  if (lower.includes('count') || lower.includes('cnt')) return 'Count'
  if (lower.includes('demand')) return 'VT'
  return ''
}
