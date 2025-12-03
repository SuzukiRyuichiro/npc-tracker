<template>
  <div>
    <MapboxMap
      map-id="map"
      class="w-screen h-screen"
      :options="{
        style:
          $colorMode.value === 'dark'
            ? 'mapbox://styles/mapbox/dark-v11'
            : 'mapbox://styles/mapbox/standard', // style URL
        center: [139.7084775, 35.6620318], // starting position
        zoom: 12, // starting zoom
        language: 'ja',
        localFontFamily: 'pixel',
      }"
    >
      <MapboxGeolocateControl />
    </MapboxMap>

    <!-- Wake Lock Control -->
    <div class="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
      <UButton
        v-if="wakeLock.isSupported"
        :color="wakeLock.isActive ? 'primary' : 'neutral'"
        :icon="wakeLock.isActive ? 'i-lucide-sun' : 'i-lucide-moon'"
        @click="toggleWakeLock"
      >
        {{ wakeLock.isActive ? $t('map.wakeLock.active') : $t('map.wakeLock.inactive') }}
      </UButton>

      <!-- Visibility Warning -->
      <div
        v-if="pageVisibility.isHidden"
        class="bg-yellow-500/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
      >
        {{ $t('map.visibility.backgrounded') }}
      </div>
    </div>

    <UModal class="z-30" :open="isModalOpen">
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon
            name="streamline-pixel:interface-essential-information-circle-1"
            class="size-6"
          />
          <h3 class="text-lg font-semibold">{{ $t("map.noRide.title") }}</h3>
        </div>
      </template>

      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("map.noRide.description") }}
        </p>
      </template>

      <template #footer>
        <UButton color="neutral" variant="ghost" @click="isModalOpen = false">
          {{ $t("map.noRide.stay") }}
        </UButton>
        <UButton to="/" @click="isModalOpen = false">
          {{ $t("map.noRide.goHome") }}
        </UButton>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import { Marker } from "mapbox-gl";
import type { LngLatLike } from "mapbox-gl";
import npcLogoUrl from "~/assets/images/npc-logo.jpg";

const { status, data, send, open, close } = useWebSocket("/api/location");
const mapRef = useMapboxRef("map");
const locationLngLat = ref<LngLatLike | null>();
const markerRef = ref<Marker | null>(null);
const isModalOpen = ref(false);
const isRideActive = ref(false);

// Wake Lock integration
const wakeLock = useWakeLock();
const pageVisibility = usePageVisibility();

const toggleWakeLock = async () => {
  if (wakeLock.isActive.value) {
    await wakeLock.release();
  } else {
    await wakeLock.request();
  }
};

// Auto re-request wake lock when page becomes visible again (if it was active before)
watch(pageVisibility.isVisible, (visible) => {
  if (visible && !wakeLock.isActive.value && wakeLock.isSupported.value) {
    // Optionally auto-reacquire wake lock
    // wakeLock.request()
  }
});

const { data: rideStatusData } = await useFetch("/api/rides/status", {
  watch: false,
});

isRideActive.value = rideStatusData.value?.isActive ?? false;

if (!isRideActive.value) {
  isModalOpen.value = true;
}

const checkRideStatus = async () => {
  const { isActive } = await $fetch("/api/rides/status");
  const wasActive = isRideActive.value;
  isRideActive.value = isActive;

  // If ride just became inactive, show modal and remove marker
  if (wasActive && !isActive) {
    isModalOpen.value = true;
    removeMarker();
  }
};

let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  intervalId = setInterval(checkRideStatus, 30000); // Check every 30 seconds
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});

// Create marker helper
const createMarker = (map: any, lngLat: LngLatLike) => {
  if (markerRef.value) return; // Already exists

  const el = document.createElement("div");
  const pingBackground = document.createElement("div");
  el.className = "marker";
  el.style.backgroundImage = `url(${npcLogoUrl})`;
  el.classList.add("rounded-full", "border", "dark:border-black", "w-8", "h-8");
  el.style.backgroundSize = "100%";
  el.tabIndex = 0;

  pingBackground.classList.add("ping", "w-full", "h-full", "rounded-full");
  el.appendChild(pingBackground);

  markerRef.value = new Marker(el).setLngLat(lngLat).addTo(map);
};

// Remove marker helper
const removeMarker = () => {
  if (markerRef.value) {
    markerRef.value.remove();
    markerRef.value = null;
  }
};

// Initialize marker once map is ready (only if ride is active)
watch(mapRef, (map) => {
  if (!map || !isRideActive.value || !locationLngLat.value) return;
  createMarker(map, locationLngLat.value);
});

watch(locationLngLat, (newLngLat, oldLngLat) => {
  console.log(locationLngLat, "changed");

  if (!isRideActive.value) return;

  if (!markerRef.value && mapRef.value && newLngLat) {
    createMarker(mapRef.value, newLngLat);
    return;
  }

  if (markerRef.value && newLngLat && oldLngLat) {
    animateMarker(markerRef.value as any, oldLngLat, newLngLat, 1000); // 1 second animation
  }
});

const animateMarker = (
  marker: any,
  start: number[],
  end: number[],
  duration: number
) => {
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const lng = (start[0] ?? 0) + ((end[0] ?? 0) - (start[0] ?? 0)) * eased;
    const lat = (start[1] ?? 0) + ((end[1] ?? 0) - (start[1] ?? 0)) * eased;

    marker.setLngLat([lng, lat]);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

watch(data, (newValue) => {
  console.log(newValue);
  if (newValue) {
    try {
      const lngLat = JSON.parse(newValue);
      locationLngLat.value = lngLat;
    } catch (error) {
      console.error("Failed to parse location data:", error);
    }
  }
});
</script>

<style>
.ping {
  background-color: white;
  opacity: 0.75;
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
