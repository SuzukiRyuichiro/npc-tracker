<template>
  <div>
    <USwitch v-model="map" class="absolute bottom-3 left-3 z-10" />
    <Map v-if="map" />
    <UContainer class="pt-30">
      <div class="w-full flex flex-col justify-center items-center">
        <img
          src="~~/assets/images/npc-logo-full.png"
          alt=""
          width="100"
          class="invert dark:invert-0"
        />

        <UTabs color="neutral" variant="link" :content="false" :items="items" />

        <div class="mt-10 text-center">
          <h2 class="mt-3">
            毎月第三土曜日 東京の夜を自転車で グループライドをしています。
          </h2>
          <h2 class="mt-3">
            自動車に占領されてしまった
            昼間の東京ストリートも夜は僕らのクルージングコースに変わる。
          </h2>
          <h2 class="mt-3">
            ペダルを踏みしめみんなでいっしょに走りませんか？
            自転車の車種は問いません。 お気軽にどうぞ。
          </h2>

          <div class="flex justify-center gap-3 mt-8">
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
const map = useState("map", () => false);
const twitterWidget = ref();

import type { TabsItem } from "@nuxt/ui";

const items = ref<TabsItem[]>([
  {
    label: "日本語",
  },
  {
    label: "English",
  },
]);
</script>
