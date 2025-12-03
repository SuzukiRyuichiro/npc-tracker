import { ref, onUnmounted } from 'vue'

export function useWakeLock() {
  const isSupported = ref(false)
  const isActive = ref(false)
  const error = ref<Error | null>(null)

  let wakeLock: WakeLockSentinel | null = null

  // Check if Wake Lock API is supported
  if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
    isSupported.value = true
  }

  const request = async () => {
    if (!isSupported.value) {
      error.value = new Error('Wake Lock API is not supported in this browser')
      return false
    }

    try {
      wakeLock = await navigator.wakeLock.request('screen')
      isActive.value = true
      error.value = null

      // Listen for wake lock release (e.g., when tab becomes inactive)
      wakeLock.addEventListener('release', () => {
        isActive.value = false
      })

      return true
    } catch (err) {
      error.value = err as Error
      isActive.value = false
      return false
    }
  }

  const release = async () => {
    if (wakeLock) {
      try {
        await wakeLock.release()
        wakeLock = null
        isActive.value = false
        error.value = null
      } catch (err) {
        error.value = err as Error
      }
    }
  }

  // Re-request wake lock when page becomes visible again
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && !isActive.value && wakeLock === null) {
      // Optionally auto-reacquire wake lock when page becomes visible
      // This is commented out to give user control
      // await request()
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  // Clean up on component unmount
  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    release()
  })

  return {
    isSupported,
    isActive,
    error,
    request,
    release
  }
}
