
const websocketUrl = "ws://localhost:8000/ws/";
let websocket;

export function getWebsocket() {
  if (!websocket) {
    websocket = new WebSocket(websocketUrl);
  }
  return websocket;
}