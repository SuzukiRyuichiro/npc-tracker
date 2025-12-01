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
    }"
  >
    <MapboxGeolocateControl />
  </MapboxMap>
</template>
<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import { Marker } from "mapbox-gl";

const { status, data, send, open, close } = useWebSocket("/api/location");
const mapRef = useMapboxRef("map");
const locationLngLat = ref([139.7090146, 35.6330098]);
const markerRef = ref<Marker | null>(null);

// Initialize marker once map is ready
watch(mapRef, (map) => {
  if (map && !markerRef.value) {
    markerRef.value = new Marker()
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
function animateMarker(
  marker: any,
  start: number[],
  end: number[],
  duration: number
) {
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
}

watch(data, (newValue) => {
  const lngLat = JSON.parse(newValue);
  locationLngLat.value = lngLat;
});

onMounted(() => {
  setInterval(() => {
    locationLngLat.value = [
      139.7090146 + Math.random() / 100,
      35.6330098 + Math.random() / 100,
    ];
  }, 5000);
});
</script>
