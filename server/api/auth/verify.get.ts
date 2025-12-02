export default defineEventHandler(async (event) => {
  const authenticated = await verifySession(event);

  return { authenticated };
});
