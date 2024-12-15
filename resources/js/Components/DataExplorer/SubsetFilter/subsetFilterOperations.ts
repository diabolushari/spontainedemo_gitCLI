export const dateOperations = [
  { operation: 'equals', value: '=' },
  { operation: 'not equals', value: '_not' },
  { operation: 'from', value: '_from' },
  { operation: 'to', value: '_to' },
]

export const dimensionOperations = [
  { operation: 'equals', value: '=' },
  { operation: 'not equals', value: '_not' },
]

export const measureOperations = [
  { operation: 'equals', value: '=' },
  { operation: 'not equals', value: '_not' },
  { operation: 'greater than', value: '_greater_than' },
  { operation: 'greater than or equal', value: '_greater_than_or_equal' },
  { operation: 'less than', value: '_less_than' },
  { operation: 'less than or equal', value: '_less_than_or_equal' },
]

export const availableOperators = (type: string) => {
  switch (type) {
    case 'date':
      return dateOperations
    case 'dimension':
      return dimensionOperations
    case 'string':
      return dimensionOperations
    case 'number':
      return measureOperations
    case 'office':
      return [{ operation: 'equals', value: '=' }]
    default:
      return []
  }
}
