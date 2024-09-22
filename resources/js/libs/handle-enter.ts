export default function handleEnterPress(
  event: React.KeyboardEvent<HTMLElement>,
  callback: () => unknown
): void {
  if (event.key === 'Enter') {
    event.preventDefault()
    event.stopPropagation()
    callback()
  }
}
