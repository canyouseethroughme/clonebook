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
// process.on("uncaughtException", (err, data) => {
//   if (err) {
//     console.log("Critical server error, yet system keeps running");
//     return;
//   }
// });
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
app.use("/static", express.static("pictures"));

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
  socket.on("joinRoom", (username, friendUsername) => {
    if (username < friendUsername) {
      // console.log(username, "joined", username, "-", friendUsername);
      socket.join(`${username}-${friendUsername}`);
    } else {
      socket.join(`${friendUsername}-${username}`);
      // console.log(username, "joined", friendUsername, "-", username);
    }
  });

  socket.on("message", async (from, to, message) => {
    let roomName;
    // console.log(from, to, message);
    if (to < from) {
      roomName = `${to}-${from}`;
    } else {
      roomName = `${from}-${to}`;
    }

    const userTo = await User.findOne({ email: to });
    const userFrom = await User.findOne({ email: from });

    let userToConversation = userTo.conversations.find(
      (convo) => convo.email === userFrom.email
    );
    let userFromConversation = userFrom.conversations.find(
      (convo) => convo.email === userTo.email
    );

    if (userToConversation === undefined) {
      userTo.conversations = [
        ...userTo.conversations,
        { email: userFrom.email },
      ];
    }

    if (userFromConversation === undefined) {
      userFrom.conversations = [
        ...userFrom.conversations,
        { email: userTo.email },
      ];
    }

    userToConversation = userTo.conversations.find(
      (convo) => convo.email === userFrom.email
    );
    userFromConversation = userFrom.conversations.find(
      (convo) => convo.email === userTo.email
    );

    userToConversation.chat = [
      ...userToConversation.chat,
      { message: message, user: userFrom.public_json, isMe: false },
    ];

    userFromConversation.chat = [
      ...userFromConversation.chat,
      { message: message, user: userTo.public_json, isMe: true },
    ];

    await userTo.save((err, result) => {
      if (err) {
        console.log(err);
      }
    });

    await userFrom.save((err, result) => {
      if (err) {
        console.log(err);
      }

      io.in(roomName).emit("privateMessage", {
        from,
        message: message,
        timestamp: Date.now(),
        user: result,
      });
    });
  });
  socket.on("exitRoom", (myUsername, friendUsername) => {
    let roomName;
    if (friendUsername < myUsername) {
      roomName = `${friendUsername}-${myUsername}`;
    } else {
      roomName = `${myUsername}-${friendUsername}`;
    }
    // console.log(myUsername + " left " + roomName);
    socket.leave(roomName);
  });
  socket.on("disconnect", () => {
    console.log("User disconected");
  });
});
