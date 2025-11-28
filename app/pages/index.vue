<template>
  <div>
    <MapboxMap
      map-id="<MAP_ID>"
      class="w-screen h-screen"
      :options="{
        style: 'mapbox://styles/mapbox/light-v11', // style URL
        center: [-68.137343, 45.137451], // starting position
        zoom: 5, // starting zoom
      }"
    />
  </div>
</template>
<script setup lang="ts">
const value = ref(50);
</script>
