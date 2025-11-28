<template>
  <div>
    <USwitch v-model="upload" class="absolute top-3 left-3 z-10" />

    <div v-if="upload" class="w-screen h-screen grid place-items-center">
      <UFileUpload
        label="GPXファイルをアップロードしてください"
        description="GPX"
        accept=".gpx,application/gpx+xml"
        class="w-96 min-h-48"
        type="file"
        name="file"
      />
    </div>
    <Map />
  </div>
</template>
<script setup lang="ts">
const upload = ref(true);
</script>
