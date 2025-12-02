<template>
  <div>
    <USwitch v-model="map" class="absolute bottom-3 left-3 z-10" />
    <Map v-if="map" />
    <UContainer class="md:pt-30 pt-10">
      <div class="w-full flex flex-col justify-center items-center">
        <img
          src="~~/assets/images/npc-logo-full.png"
          alt=""
          class="invert dark:invert-0 h-40"
          @dblclick="router.push('/admin')"
        />

        <UTabs
          color="neutral"
          variant="link"
          :content="false"
          v-model="locale"
          :items="items"
          class="mt-4"
          :ui="{
            indicator: 'duration-0!',
          }"
        />

        <div class="sm:mt-10 text-center mt-6">
          <h2 class="mt-3">
            {{ $t("hero.subtitle1") }}
          </h2>
          <h2 class="mt-3">
            {{ $t("hero.subtitle2") }}
          </h2>
          <h2 class="mt-3">
            {{ $t("hero.subtitle3") }}
          </h2>

          <div class="grid gap-2 mt-5">
            <p>
              <UIcon name="streamline-pixel:map-navigation-pin-location-2" />
              {{ $t("meetingLocation") }}:
              <nuxt-link
                to="https://maps.app.goo.gl/RU8uFATefaiTjCQC8"
                class="underline underline-offset-4 decoration-dashed"
                >{{ $t("address") }}</nuxt-link
              >
            </p>

            <p>
              <UIcon name="streamline-pixel:interface-essential-clock" />
              {{ $t("meetingTime") }}: PM 5:30
            </p>
          </div>

          <div class="flex justify-center gap-3 sm:mt-10 mt-6">
            <nuxt-link to="https://twitter.com/NPC_TDF">
              <UIcon
                name="streamline-pixel:logo-social-media-twitter-circle"
                class="size-8"
              ></UIcon>
            </nuxt-link>

            <nuxt-link
              to="https://www.instagram.com/nightpedalcruising_official/"
            >
              <UIcon
                name="streamline-pixel:logo-social-media-old-instagram"
                class="size-8"
              ></UIcon>
            </nuxt-link>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { tabs } from "#build/ui";

const router = useRouter();

const map = useState("map", () => false);
const twitterWidget = ref();

const { locales, setLocale, locale: currentLocale } = useI18n();

const items = computed(() =>
  locales.value.map((locale) => ({ label: locale.name, value: locale.code }))
);

const locale = computed({
  get: () => currentLocale.value as "ja" | "en",
  set: (newValue) => {
    setLocale(newValue);
  },
});
</script>
