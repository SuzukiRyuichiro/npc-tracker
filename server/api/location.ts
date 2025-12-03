import { eq } from "drizzle-orm";
import { rides } from "~~/server/database/schema";
import { verifySessionFromHeaders } from "../utils/session";

export default defineWebSocketHandler({
  async open(peer) {
    // Check if user is authenticated admin
    const isAdmin = await verifySessionFromHeaders(peer.request.headers);

    peer.context.isAdmin = isAdmin;

    peer.subscribe("location");
    console.log("WebSocket opened, isAdmin:", isAdmin);
  },
  close(peer) {
    peer.unsubscribe("location");
  },
  error(peer, error) {
    console.log("WebSocket error", error, peer);
  },
  async message(peer, message) {
    // Only allow admin to broadcast location
    if (!peer.context.isAdmin) {
      console.log("Non-admin tried to send location");
      return;
    }

    // Check if there's an active ride
    const db = useDrizzle();
    const activeRide = await db.query.rides.findFirst({
      where: eq(rides.isActive, true),
    });

    if (!activeRide) {
      console.log("No active ride, not broadcasting location");
      return;
    }

    console.log(message.text());
    // Broadcast location to all connected clients
    peer.publish("location", message.text());
  },
});
