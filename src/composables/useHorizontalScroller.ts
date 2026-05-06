import { nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * Tracks overflow on a horizontal scroll container and exposes prev/next jumps.
 * Keeps DOM logic out of presentational components.
 */
export function useHorizontalScroller(scrollerRef: Ref<HTMLElement | null>) {
  const canGoPrev = ref(false)
  const canGoNext = ref(false)

  function measure(): void {
    const el = scrollerRef.value
    if (!el) {
      canGoPrev.value = false
      canGoNext.value = false
      return
    }
    const { scrollLeft, scrollWidth, clientWidth } = el
    const pad = 2
    canGoPrev.value = scrollLeft > pad
    canGoNext.value = scrollLeft + clientWidth < scrollWidth - pad
  }

  function scrollPage(direction: -1 | 1): void {
    const el = scrollerRef.value
    if (!el) return
    const distance = Math.max(Math.round(el.clientWidth * 0.82), 240)
    el.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }

  let resizeObserver: ResizeObserver | undefined
  let boundEl: HTMLElement | null = null

  onMounted(async () => {
    await nextTick()
    measure()
    boundEl = scrollerRef.value
    if (!boundEl) return

    boundEl.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measure)
      resizeObserver.observe(boundEl)
    }
  })

  onUnmounted(() => {
    boundEl?.removeEventListener('scroll', measure)
    window.removeEventListener('resize', measure)
    resizeObserver?.disconnect()
    boundEl = null
  })

  return {
    canGoPrev,
    canGoNext,
    measure,
    scrollPrev: () => scrollPage(-1),
    scrollNext: () => scrollPage(1),
  }
}
