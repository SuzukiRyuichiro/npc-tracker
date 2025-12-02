<template>
  <UContainer class="grid gap-5 py-10">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl">管理者画面</h1>
      <UButton
        size="sm"
        icon="streamline-pixel:interface-essential-signout-logout"
        @click="logout"
        >ログアウト</UButton
      >
    </div>

    <UCard variant="outline">
      <h3 class="text-2xl">ライドを開始</h3>
      <p class="text-muted">ライドを開始して位置情報の共有を有効にする</p>

      <UButton
        icon="streamline-pixel:map-navigation-compass-direction"
        size="xl"
        class="w-full justify-center mt-4"
        >ライドを開始</UButton
      >
    </UCard>

    <UCard variant="outline">
      <h3 class="text-2xl">ルートをアップロード</h3>
      <p class="text-muted">
        次回のライドのルートをアップロードして、マップに表示する
      </p>

      <UFileUpload
        label="GPXファイル"
        description="StravaやGarminからGPXを出力してアップロードしてください"
        accept=".gpx"
        class="w-full min-h-32 mt-4"
        v-model="gpxFile"
      />

      <UButton
        icon="streamline-pixel:interface-essential-floppy-disk"
        size="xl"
        :disabled="!gpxFile"
        class="w-full justify-center mt-4"
        >保存</UButton
      >
    </UCard>

    <nuxt-link
      to="/"
      　class="text-center underline underline-offset-4 decoration-dashed"
      >ホームに戻る</nuxt-link
    >
  </UContainer>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

const gpxFile = ref();

const logout = async () => {
  await $fetch("/api/auth/logout", { method: "POST" });
  await navigateTo("/");
};
</script>
