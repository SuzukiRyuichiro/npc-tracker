import { eq } from "drizzle-orm";
import { rides } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";

const RIDE_EXPIRY_HOURS = 5;

export default defineEventHandler(async (event) => {
  const db = useDrizzle();

  // Get active ride
  const activeRide = await db.query.rides.findFirst({
    where: eq(rides.isActive, true),
  });

  if (!activeRide) {
    return { isActive: false, ride: null };
  }

  // Check if ride has expired (5 hours)
  const now = new Date();
  const startedAt = new Date(activeRide.startedAt);
  const hoursSinceStart =
    (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60);

  if (hoursSinceStart >= RIDE_EXPIRY_HOURS) {
    // Auto-expire the ride
    await db
      .update(rides)
      .set({
        isActive: false,
        endedAt: now,
      })
      .where(eq(rides.id, activeRide.id));

    return { isActive: false, ride: null, expired: true };
  }

  return { isActive: true, ride: activeRide };
});
