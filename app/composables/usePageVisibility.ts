import { ref, onMounted, onUnmounted } from 'vue'

export function usePageVisibility() {
  const isVisible = ref(true)
  const isHidden = ref(false)

  const handleVisibilityChange = () => {
    if (typeof document === 'undefined') return

    isVisible.value = document.visibilityState === 'visible'
    isHidden.value = document.visibilityState === 'hidden'
  }

  onMounted(() => {
    if (typeof document !== 'undefined') {
      // Set initial state
      handleVisibilityChange()

      // Listen for visibility changes
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }
  })

  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  })

  return {
    isVisible,
    isHidden
  }
}
