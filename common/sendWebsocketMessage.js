const clients = require("../clients");
const sendWebsocketMessage = (data) => {
    for (const client of clients) {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    }
}

module.exports = sendWebsocketMessage