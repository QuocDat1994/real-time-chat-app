const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const {
  joinRoom,
  leaveRoom,
  getUserById,
  getUserByRoom,
} = require("./utils/users");

const {
  getFormatData,
  getJoinMessage,
  getLeaveMessage,
  getWelcomeMessage,
} = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("JOIN_ROOM", (data) => {
    const { username, room } = data;

    joinRoom(socket.id, username, room);

    socket.join(room);

    // Welcome message
    socket.emit("NEW_USER", getFormatData("Chat Bot", getWelcomeMessage(room)));

    // Boardcast to other users
    socket.broadcast
      .to(room)
      .emit("NEW_USER", getFormatData("Chat Bot", getJoinMessage(username)));

    // Send out new user list in the room
    io.to(room).emit("USER_LIST", getUserByRoom(room));
  });

  socket.on("SEND_MESSAGE", (message) => {
    const { username, room } = getUserById(socket.id);
    io.to(room).emit("CHAT_MESSAGE", getFormatData(username, message));
  });

  socket.on("disconnect", () => {
    const userToLeave = leaveRoom(socket.id);

    if (!userToLeave) {
      return;
    }

    const { username, room } = userToLeave;

    socket.broadcast
      .to(room)
      .emit("USER_LEAVE", getFormatData("Chat Bot", getLeaveMessage(username)));

    // Send out new user list in the room
    io.to(room).emit("USER_LIST", getUserByRoom(room));
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
