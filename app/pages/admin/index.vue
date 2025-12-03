<template>
  <UContainer class="grid gap-5 py-10">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl">{{ $t("admin.title") }}</h1>
      <UButton
        size="sm"
        icon="streamline-pixel:interface-essential-signout-logout"
        @click="logout"
        >{{ $t("admin.logout") }}</UButton
      >
    </div>

    <UCard variant="outline">
      <h3 class="text-2xl">{{ $t("admin.ride.title") }}</h3>
      <p class="text-muted">{{ $t("admin.ride.description") }}</p>

      <div v-if="isRideActive" class="mt-4 space-y-4">
        <div class="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <p class="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
            <UIcon name="streamline-pixel:map-navigation-pin-location-2" />
            {{ $t("admin.ride.active") }}
          </p>
          <p class="text-xs text-green-600 dark:text-green-300 mt-1">
            {{ $t("admin.ride.sharingLocation") }}
          </p>
        </div>

        <UButton
          icon="streamline-pixel:interface-essential-stop"
          size="xl"
          color="red"
          class="w-full justify-center"
          :loading="isLoading"
          @click="stopRide"
          >{{ $t("admin.ride.stop") }}</UButton
        >
      </div>

      <UButton
        v-else
        icon="streamline-pixel:map-navigation-compass-direction"
        size="xl"
        class="w-full justify-center mt-4"
        :loading="isLoading"
        @click="startRide"
        >{{ $t("admin.ride.start") }}</UButton
      >
    </UCard>

    <UCard variant="outline">
      <h3 class="text-2xl">{{ $t("admin.route.title") }}</h3>
      <p class="text-muted">
        {{ $t("admin.route.description") }}
      </p>

      <UFileUpload
        :label="$t('admin.route.fileLabel')"
        :description="$t('admin.route.fileDescription')"
        accept=".gpx"
        class="w-full min-h-32 mt-4"
        v-model="gpxFile"
      />

      <UButton
        icon="streamline-pixel:interface-essential-floppy-disk"
        size="xl"
        :disabled="!gpxFile"
        class="w-full justify-center mt-4"
        >{{ $t("admin.route.save") }}</UButton
      >
    </UCard>

    <nuxt-link
      to="/"
      　class="text-center underline underline-offset-4 decoration-dashed"
      >{{ $t("admin.backToHome") }}</nuxt-link
    >
  </UContainer>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

const gpxFile = ref();
const isRideActive = ref(false);
const isLoading = ref(false);

// Use global location tracking composable
const { startTracking, stopTracking, isTracking } = useLocationTracking();

// Check ride status on mount
onMounted(async () => {
  await checkRideStatus();
});

const checkRideStatus = async () => {
  const { isActive } = await $fetch("/api/rides/status");
  isRideActive.value = isActive;

  // If ride is active and not already tracking, start tracking
  if (isActive && !isTracking.value) {
    startTracking();
  }
};

const startRide = async () => {
  isLoading.value = true;
  try {
    await $fetch("/api/rides/start", { method: "POST" });
    isRideActive.value = true;
    startTracking();
  } catch (error) {
    console.error("Failed to start ride:", error);
  } finally {
    isLoading.value = false;
  }
};

const stopRide = async () => {
  isLoading.value = true;
  try {
    await $fetch("/api/rides/stop", { method: "POST" });
    isRideActive.value = false;
    stopTracking();
  } catch (error) {
    console.error("Failed to stop ride:", error);
  } finally {
    isLoading.value = false;
  }
};

const logout = async () => {
  stopTracking();
  await $fetch("/api/auth/logout", { method: "POST" });
  await navigateTo("/");
};
</script>
