import type { H3Event } from "h3";

export async function verifySession(event: H3Event): Promise<boolean> {
  const sessionCookie = getCookie(event, "admin-session");

  if (!sessionCookie) {
    return false;
  }

  try {
    const [dataBase64, signature] = sessionCookie.split(".");

    if (!dataBase64 || !signature) {
      return false;
    }

    const sessionDataString = atob(dataBase64);
    const sessionData = JSON.parse(sessionDataString);

    const expectedSignature = await createHmacSignature(
      sessionDataString,
      process.env.SESSION_SECRET!
    );

    if (signature !== expectedSignature) {
      return false;
    }

    // Check if session is expired (7 days)
    const sessionAge = Date.now() - sessionData.createdAt;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    if (sessionAge > maxAge) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
