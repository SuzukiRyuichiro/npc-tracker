<template>
  <div class="w-full h-full grid place-items-center py-30">
    <UForm :state="state" class="space-y-4" @submit="login">
      <UFormField name="password" :label="$t('admin.login.password')">
        <UButtonGroup>
          <UInput
            :type="show ? 'text' : 'password'"
            v-model="state.password"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>

          <UButton type="submit">{{ $t("admin.login.login") }}</UButton>
        </UButtonGroup>
      </UFormField>
    </UForm>

    <nuxt-link
      to="/"
      class="mt-4 underline underline-offset-4 decoration-dashed"
      >{{ $t("admin.login.back") }}</nuxt-link
    >
  </div>
</template>

<script lang="ts" setup>
const state = ref({ password: "" });
const show = ref(false);

const login = async () => {
  const { loggedIn } = await $fetch("/api/auth/login", {
    method: "POST",
    body: state.value,
  });

  if (loggedIn) {
    await navigateTo("/admin");
  }
};
</script>
