import { eq } from "drizzle-orm";
import { rides } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  // Verify admin authentication
  const authenticated = await verifySession(event);
  if (!authenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const db = useDrizzle();

  // End all active rides
  await db
    .update(rides)
    .set({
      isActive: false,
      endedAt: new Date(),
    })
    .where(eq(rides.isActive, true));

  return { success: true };
});
