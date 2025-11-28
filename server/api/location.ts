export default defineWebSocketHandler({
  open(peer) {
    console.log("opened WS", peer);
    peer.subscribe("room");
    // We publish the number of connected users to the 'visitors' channel
    peer.publish("room", "Another user joined the chat!");
  },
  close(peer) {
    console.log("closed", peer);
    peer.unsubscribe("room");
  },
  error(peer, error) {
    console.log("error", error, peer);
  },
  message(peer, message) {
    console.log(message, "here's the message");
    peer.publish("room", message.text());
  },
});
