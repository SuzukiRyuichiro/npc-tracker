export default defineNuxtRouteMiddleware(async () => {
  // Check authentication on client side
  const { data } = await useFetch("/api/auth/verify");

  if (!data.value?.authenticated) {
    return navigateTo("/admin/login");
  }
});
