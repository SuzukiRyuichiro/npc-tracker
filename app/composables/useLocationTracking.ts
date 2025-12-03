import { useWebSocket } from "@vueuse/core";

// Global state - persists across page navigation
const isTracking = ref(false);
const watchId = ref<number | null>(null);
let wsConnection: ReturnType<typeof useWebSocket> | null = null;

export const useLocationTracking = () => {
  const startTracking = () => {
    if (isTracking.value) {
      console.log("Already tracking location");
      return;
    }

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    // Initialize WebSocket connection if not already connected
    if (!wsConnection) {
      wsConnection = useWebSocket("/api/location", {
        autoReconnect: true,
        heartbeat: {
          message: "ping",
          interval: 30000, // 30 seconds
        },
      });
    }

    watchId.value = navigator.geolocation.watchPosition(
      (position) => {
        const location = [position.coords.longitude, position.coords.latitude];

        if (wsConnection?.status.value === "OPEN") {
          wsConnection.send(JSON.stringify(location));
          console.log("Location sent:", location);
        } else {
          console.log("WebSocket not open, location not sent");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    isTracking.value = true;
    console.log("Started location tracking");
  };

  const stopTracking = () => {
    if (watchId.value !== null) {
      navigator.geolocation.clearWatch(watchId.value);
      watchId.value = null;
    }

    // Close WebSocket connection
    if (wsConnection) {
      wsConnection.close();
      wsConnection = null;
    }

    isTracking.value = false;
    console.log("Stopped location tracking");
  };

  return {
    startTracking,
    stopTracking,
    isTracking: readonly(isTracking),
  };
};
