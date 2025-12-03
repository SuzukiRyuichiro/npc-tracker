/**
 * Auto-resume location tracking for authenticated admins with active rides
 * Runs on every page load to ensure tracking persists across reloads
 */
export default defineNuxtPlugin(async () => {
  // Check if user is admin with active ride
  try {
    // Check authentication
    const { authenticated } = await $fetch("/api/auth/verify");
    if (!authenticated) {
      console.log("Not authenticated, skipping auto-resume");
      return;
    }

    // Check if ride is active
    const { isActive } = await $fetch("/api/rides/status");
    if (!isActive) {
      console.log("No active ride, skipping auto-resume");
      return;
    }

    // Admin is authenticated AND ride is active - resume tracking
    const { startTracking, isTracking } = useLocationTracking();

    // Only start if not already tracking
    if (!isTracking.value) {
      console.log("Auto-resuming location tracking");
      startTracking();
    } else {
      console.log("Already tracking, no need to resume");
    }
  } catch (error) {
    console.error("Failed to auto-resume tracking:", error);
  }
});
