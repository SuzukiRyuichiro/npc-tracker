export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe("location");
  },
  close(peer) {
    peer.unsubscribe("location");
  },
  error(peer, error) {
    console.log("error", error, peer);
  },
  message(peer, message) {
    peer.publish("location", message.text());
  },
});
