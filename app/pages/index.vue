<template>
  <div>
    <USwitch v-model="upload" class="absolute top-3 left-3 z-10" />

    <div v-if="upload" class="w-screen h-screen grid place-items-center">
      <UFileUpload
        label="GPXファイルをアップロードしてください"
        description="GPX"
        class="w-96 min-h-48"
      />
    </div>

    <MapboxMap
      v-else
      map-id="map"
      class="w-screen h-screen"
      :options="{
        style: 'mapbox://styles/mapbox/light-v11', // style URL
        center: [139.7090146, 35.6330098], // starting position
        zoom: 10, // starting zoom
      }"
    >
      <MapboxGeolocateControl />
      <MapboxSource
        source-id="route-data"
        :source="{
          type: 'geojson',
          data: '/test.geojson',
        }"
      />
    </MapboxMap>
  </div>
</template>
<script setup lang="ts">
import { Marker } from "mapbox-gl";

const upload = ref(true);
useMapbox("map", async (map) => {
  // Fetch GeoJSON data
  const response = await fetch("/test.geojson");
  const geojsonData = await response.json();

  // Get coordinates from the first feature (LineString)
  const coordinates = geojsonData.features[0].geometry.coordinates;
  const startCoord = coordinates[0];
  const endCoord = coordinates[coordinates.length - 1];

  // Create start marker (green)
  const startMarker = new Marker({ color: "#22c55e" })
    .setLngLat([startCoord[0], startCoord[1]])
    .addTo(map);

  // Create end marker (red)
  const endMarker = new Marker({ color: "#ef4444" })
    .setLngLat([endCoord[0], endCoord[1]])
    .addTo(map);

  map.loadImage(
    "https://docs.mapbox.com/mapbox-gl-js/assets/pattern-dot.png",
    (error, image) => {
      if (error) throw error;

      map.addImage("pattern-dot", image);
      const lineBaseWidth = 14;

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route-data",
        slot: "middle",
        layout: {
          "line-join": "none",
        },
        paint: {
          "line-pattern": "pattern-dot",
          "line-width": [
            "interpolate",
            ["exponential", 2],
            ["zoom"],
            0,
            lineBaseWidth * 1,
            0.9999,
            lineBaseWidth * 2,
            1,
            lineBaseWidth * 1,
            1.9999,
            lineBaseWidth * 2,
            2,
            lineBaseWidth * 1,
            2.9999,
            lineBaseWidth * 2,
            3,
            lineBaseWidth * 1,
            3.9999,
            lineBaseWidth * 2,
            4,
            lineBaseWidth * 1,
            4.9999,
            lineBaseWidth * 2,
            5,
            lineBaseWidth * 1,
            5.9999,
            lineBaseWidth * 2,
            6,
            lineBaseWidth * 1,
            6.9999,
            lineBaseWidth * 2,
            7,
            lineBaseWidth * 1,
            7.9999,
            lineBaseWidth * 2,
            8,
            lineBaseWidth * 1,
            8.9999,
            lineBaseWidth * 2,
            9,
            lineBaseWidth * 1,
            9.9999,
            lineBaseWidth * 2,
            10,
            lineBaseWidth * 1,
            10.9999,
            lineBaseWidth * 2,
            11,
            lineBaseWidth * 1,
            11.9999,
            lineBaseWidth * 2,
            12,
            lineBaseWidth * 1,
            12.9999,
            lineBaseWidth * 2,
            13,
            lineBaseWidth * 1,
            13.9999,
            lineBaseWidth * 2,
            14,
            lineBaseWidth * 1,
            14.9999,
            lineBaseWidth * 2,
            15,
            lineBaseWidth * 1,
            15.9999,
            lineBaseWidth * 2,
            16,
            lineBaseWidth * 1,
            16.9999,
            lineBaseWidth * 2,
            17,
            lineBaseWidth * 1,
            17.9999,
            lineBaseWidth * 2,
            18,
            lineBaseWidth * 1,
            18.9999,
            lineBaseWidth * 2,
            19,
            lineBaseWidth * 1,
            19.9999,
            lineBaseWidth * 2,
            20,
            lineBaseWidth * 1,
            20.9999,
            lineBaseWidth * 2,
            21,
            lineBaseWidth * 1,
            22,
            lineBaseWidth * 2,
          ],
        },
      });
    }
  );
});
</script>
