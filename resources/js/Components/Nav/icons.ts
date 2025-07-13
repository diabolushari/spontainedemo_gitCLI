/**
 * Converts a kebab-case string to Title Case.
 *
 * @param str The kebab-case string.
 * @returns The Title Case version of the string.
 */
export const kebabToTitleCase = (str: string): string => {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
