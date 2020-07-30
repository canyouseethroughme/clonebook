const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const User = require("./models/User");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

// even if the server crashes, it still runs
process.on("uncaughtException", (err, data) => {
  if (err) {
    console.log("Critical server error, yet system keeps running");
    return;
  }
});
// ##########################

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// global variable for db
global.db = "";

// connect to db
mongoose
  .connect("mongodb://localhost:27017/clonebook", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));
// ##########################

// set up routes with our server instance
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");

app.use("/users", usersRoute);
app.use("/posts", postsRoute);

// ##########################

const port = 8899;
const server = app.listen(port, (err) => {
  if (err) {
    console.log("Error running in express");
  }
  console.log("Server is running on port:", server.address().port);
});

// ##########################

// sockets
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("new ws connection");
});
