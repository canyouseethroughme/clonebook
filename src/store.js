import { writable } from "svelte/store";

export let profile = writable({
  _id: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  token: "",
  photo: "",
  public_json: { user_id: "", first_name: "", last_name: "", photo: "" },
  posts: [
    {
      _id: "",
      description: "",
      timestamp: "",
      photo: "",
      likes: [{ user_id: "", first_name: "", last_name: "", photo: "" }],
      user: { user_id: "", first_name: "", last_name: "", photo: "" },
    },
  ],
  conversations: [
    {
      id: "5f22d1c232f18122c66747e9",
      email: "tavi@tavi.com",
      chat: [
        {
          message: "da",
          timestamp: "",
          isMe: false,
        },
        {
          message: "nu",
          timestamp: "",
          isMe: true,
        },
      ],
    },
  ],
  chats: [
    {
      _id: "",
      message: "",
      user: { user_id: "", first_name: "", last_name: "", photo: "" },
      timestamp: "",
      isMe: Boolean,
    },
  ],
});

export let posts = writable([]);

export let contacts = writable([]);

export let activeChat = writable({
  show: false,
  user: "",
});
