export default function extractJsonMarkdown(markdown: string): object | null {
  // First try to match JSON markdown format
  const markdownMatch = markdown.match(/```json(.*?)```/s)
  if (markdownMatch != null) {
    try {
      return JSON.parse(markdownMatch[1].trim())
    } catch (error) {
      console.error('Error parsing JSON from markdown:', error)
      return null
    }
  }

  // If no markdown format found, try to parse as direct JSON string
  try {
    return JSON.parse(markdown.trim())
  } catch (error) {
    console.error('Error parsing JSON string:', error)
    return null
  }
}
