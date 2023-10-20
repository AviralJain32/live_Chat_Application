const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
app.use(cors());

const server = http.createServer(app);
//-------------deployment---------
const __dirname1 = path.resolve();
if (1) {
  app.use(express.static(path.join(__dirname1, "../client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "../client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
//-------------deployment----------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
const PORT=process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
