const mongoose = require("mongoose");

const PublicJSONSchema = new mongoose.Schema(
  {
    user_id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    photo: String,
    email: String,
  },
  { _id: false }
);

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

const ConversationSchema = new mongoose.Schema({
  email: String,
  chat: [ChatSchema],
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
  conversations: [ConversationSchema],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
