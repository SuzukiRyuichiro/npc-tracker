<template>
  <div class="relative w-screen h-screen">
    <LocationMap />
    <nuxt-link
      to="/"
      class="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
    >
      <UIcon name="i-heroicons-arrow-left" class="mr-2" />
      {{ $t("admin.login.back") }}
    </nuxt-link>
  </div>
</template>
