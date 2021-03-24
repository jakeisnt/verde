const ws = require("ws");
const wss = new ws.Server({ noServer: true });

function onUpgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws);
  });
}

module.exports = onUpgrade;
