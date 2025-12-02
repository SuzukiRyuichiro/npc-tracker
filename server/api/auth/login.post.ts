import { compare } from "bcrypt";
import { createHmac } from "crypto";
export default defineEventHandler(async (event) => {
  const { password } = await readBody(event);

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: "You must provide a password",
    });
  }

  if (await compare(password, process.env.ADMIN_PASSWORD_HASH!)) {
    const sessionData = {
      createdAt: Date.now(),
    };

    const signature = createHmac("sha256", process.env.SESSION_SECRET!)
      .update(JSON.stringify(sessionData))
      .digest("hex");

    const sessionValue = `${Buffer.from(JSON.stringify(sessionData)).toString(
      "base64"
    )}.${signature}`;

    setCookie(event, "admin-session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { loggedIn: true };
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
});
