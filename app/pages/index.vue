<template>
  <div>
    <UProgress v-model="value" />
    <UButtonGroup orientation="horizontal">
      <UButton
        color="neutral"
        variant="subtle"
        label="Add"
        @click="value += 1"
      />
      <UButton
        color="neutral"
        variant="outline"
        label="Subtract"
        @click="value -= 1"
      />
    </UButtonGroup>
  </div>
</template>
<script setup lang="ts">
const value = ref(50);
</script>
