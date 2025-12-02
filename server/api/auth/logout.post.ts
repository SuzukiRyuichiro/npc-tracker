export default defineEventHandler((event) => {
  deleteCookie(event, "admin-session", {
    path: "/",
  });

  return { loggedOut: true };
});
