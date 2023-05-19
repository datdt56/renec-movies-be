const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authMiddleware = require("./common/authMiddleware");
const shareYoutubeVideo = require("./controller/shareYoutubeVideo");
const http = require("http");
const {WebSocketServer} = require("ws");
const PORT = process.env.PORT || 8080;
const clients = require("./clients")

// HTTP server & Websocket Server
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('error', console.error);

wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws);
    });
});

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true, parameterLimit: 50000}));

// Automatically allow cross-origin requests
app.use(cors({origin: true}));
// Add middleware to authenticate requests
app.use(authMiddleware);

app.post("/share-youtube-video", shareYoutubeVideo)

server.listen(PORT, function () {
    console.log('Server is running on Port:', PORT);
});

module.exports = server