const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: process.env.FRONT_END_URL }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { initSocket, getIO };
