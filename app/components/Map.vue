<template>
  <MapboxMap
    map-id="map"
    class="w-screen h-screen"
    :options="{
      style:
        $colorMode.value === 'dark'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/standard', // style URL
      center: [139.7090146, 35.6330098], // starting position
      zoom: 10, // starting zoom
      language: 'ja',
      localFontFamily: 'pixel',
    }"
  >
    <MapboxGeolocateControl />
  </MapboxMap>
</template>
<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import { Marker } from "mapbox-gl";
import npcLogoUrl from "~/assets/images/npc-logo.jpg";

const { status, data, send, open, close } = useWebSocket("/api/location");
const mapRef = useMapboxRef("map");
const locationLngLat = ref([139.7090146, 35.6330098]);
const markerRef = ref<Marker | null>(null);

// Initialize marker once map is ready
watch(mapRef, (map) => {
  if (map && !markerRef.value) {
    const el = document.createElement("div");
    const pingBackground = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url(${npcLogoUrl})`;
    el.classList.add(
      "rounded-full",
      "border",
      "dark:border-black",
      "w-8",
      "h-8"
    );
    el.style.backgroundSize = "100%";
    el.tabIndex = 0;

    pingBackground.classList.add("ping", "w-full", "h-full", "rounded-full");
    el.appendChild(pingBackground);

    markerRef.value = new Marker(el)
      .setLngLat(locationLngLat.value as [number, number])
      .addTo(map);
  }
});

// Animate marker when locationLngLat changes
watch(locationLngLat, (newLngLat, oldLngLat) => {
  if (markerRef.value && newLngLat && oldLngLat) {
    // Smooth animation using setLngLat with duration
    animateMarker(markerRef.value as any, oldLngLat, newLngLat, 1000); // 1 second animation
  }
});

// Animation helper function
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

onMounted(() => {
  setInterval(() => {
    locationLngLat.value = [
      139.7090146 + Math.random() / 100,
      35.6330098 + Math.random() / 100,
    ];
  }, 5000);
});

watch(data, (newValue) => {
  const lngLat = JSON.parse(newValue);
  locationLngLat.value = lngLat;
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
