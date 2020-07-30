const mongoose = require("mongoose");

const PublicJSONSchema = new mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  first_name: String,
  last_name: String,
  photo: String,
});

const PostSchema = new mongoose.Schema({
  description: String,
  timestamp: { type: Date, default: Date.now },
  photo: { type: String, default: "" },
  likes: [PublicJSONSchema],
  user: PublicJSONSchema,
});

const ChatSchema = new mongoose.Schema({
  message: String,
  user: PublicJSONSchema,
  timestamp: { type: Date, default: Date.now },
  isMe: Boolean,
});

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: "",
  },
  photo: {
    type: String,
    default: "https://i.ibb.co/gSbgf9K/male-placeholder.jpg",
  },
  public_json: PublicJSONSchema,
  posts: [PostSchema],
  activeChats: [ChatSchema],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
