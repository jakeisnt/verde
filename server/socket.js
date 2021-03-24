const ws = require("ws");

function startSocketServer(server) {
  const wsServer = new ws.Server({ server });
  wsServer.on("connection", (socket) => {
    console.log("Connected to a socket!");
    socket.on("message", (message) => {
      console.log(message);
    });
  });
}

module.exports = startSocketServer;
