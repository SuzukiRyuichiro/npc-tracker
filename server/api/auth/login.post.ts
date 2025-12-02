import { compare } from "bcryptjs";
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

    const sessionDataString = JSON.stringify(sessionData);
    const signature = await createHmacSignature(
      sessionDataString,
      process.env.SESSION_SECRET!
    );

    const sessionValue = `${btoa(sessionDataString)}.${signature}`;

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
