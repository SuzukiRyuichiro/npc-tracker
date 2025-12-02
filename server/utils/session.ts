import { createHmac } from "crypto";
import type { H3Event } from "h3";

export function verifySession(event: H3Event): boolean {
  const sessionCookie = getCookie(event, "admin-session");

  if (!sessionCookie) {
    return false;
  }

  try {
    const [dataBase64, signature] = sessionCookie.split(".");

    if (!dataBase64 || !signature) {
      return false;
    }

    const sessionData = JSON.parse(
      Buffer.from(dataBase64, "base64").toString()
    );

    const expectedSignature = createHmac("sha256", process.env.SESSION_SECRET!)
      .update(JSON.stringify(sessionData))
      .digest("hex");

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
