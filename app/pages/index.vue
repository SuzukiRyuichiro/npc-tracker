<template>
  <div>
    <USwitch v-model="map" class="absolute top-3 left-3 z-10" />
    <Map v-if="map" />
    <div class="w-screen h-screen grid place-items-center" v-else>
      <UFileUpload
        label="GPXファイルをアップロードしてください"
        description="GPX"
        accept=".gpx,application/gpx+xml"
        class="w-96 min-h-48"
        type="file"
        name="file"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const map = useState("map", () => true);
</script>
