import type { H3Event } from "h3";

const verifyCookieSignature = async (
  sessionCookie: string
): Promise<boolean> => {
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
};

export const verifySession = async (event: H3Event): Promise<boolean> => {
  const sessionCookie = getCookie(event, "admin-session");

  if (!sessionCookie) {
    return false;
  }

  return verifyCookieSignature(sessionCookie);
};

/**
 * Verify session from WebSocket request
 * WebSocket requests have cookies in headers, not as H3Event
 */
export const verifySessionFromHeaders = async (
  headers: Headers
): Promise<boolean> => {
  const cookieHeader = headers.get("cookie");

  if (!cookieHeader) {
    return false;
  }

  // Parse cookie header to find admin-session
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  const sessionCookie = cookies["admin-session"];

  if (!sessionCookie) {
    return false;
  }

  return verifyCookieSignature(sessionCookie);
};
