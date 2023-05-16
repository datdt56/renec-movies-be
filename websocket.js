const {WebSocketServer} = require("ws");
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 8000;

//  WebSocket server
const wss = new WebSocketServer({ port: WEBSOCKET_PORT });
const clients = new Set()
wss.on('error', console.error);

wss.on('open', function open() {
    console.log("websocket server is running")
});
wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws);
    });
});

module.exports = {
    clients
}