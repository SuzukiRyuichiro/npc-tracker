<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";

const { status, data, send, open, close } = useWebSocket("/api/location");

const messages = ref<string[]>([]);

const state = ref({ message: "" });

const sendData = () => {
  messages.value.push(state.value.message);
  send(state.value.message);
  state.value.message = "";
};

watch(data, (newValue) => {
  messages.value.push(newValue);
});
</script>

<template>
  <div>
    <div>Web socket</div>

    <h1>Status: {{ status }}</h1>
    <h1>Data: {{ data }}</h1>
    <UForm :state="state" @submit.prevent="sendData">
      <UFormField name="message" label="Message">
        <UInput v-model="state.message" />
      </UFormField>
      <UButton type="submit">Send</UButton>
    </UForm>

    <ul>
      <li v-for="message in messages">{{ message }}</li>
    </ul>
  </div>
</template>
