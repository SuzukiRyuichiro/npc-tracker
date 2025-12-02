import { compare } from "bcrypt";
export default defineEventHandler(async (event) => {
  const { password } = await readBody(event);

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: "You must provide a password",
    });
  }

  console.log(process.env.ADMIN_PASSWORD_HASH, password);

  if (await compare(password, process.env.ADMIN_PASSWORD_HASH!)) {
    return { loggedIn: true };
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
});
