const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const socket = require("socket.io");
const http = require("http");
const userRouters = require('./routers/userRouter')
const messagesRouters = require('./routers/messageRouter')

dotenv.config();
const db = require("./config/db");
db.connect();

const app = express();

const server = http.createServer(app);

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("common"));

app.use("/api/auth", userRouters);
app.use("/api/messages", messagesRouters);

app.get("/", (req, res) => {
  res.json("server running ...");
})

server.listen(process.env.PORT || 8080, () => {
  console.log("server is running ...");
});

const io = socket(server, {
  cors: {
    origin: "https://master--relaxed-taiyaki-e47e21.netlify.app",
    credentials: true
  }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", userId => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on("send-msg", data => {
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  })

})