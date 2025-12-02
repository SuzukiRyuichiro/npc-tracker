export default defineEventHandler((event) => {
  const authenticated = verifySession(event);

  return { authenticated };
});
