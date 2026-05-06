export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delayMs: number
): (...args: TArgs) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: TArgs) => {
    if (timer !== undefined) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
      fn(...args)
    }, delayMs)
  }
}
