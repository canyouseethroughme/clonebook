<script>
  import { contacts, activeChat, profile } from "./../store";
  import PhotoThumbnail from "./PhotoThumbnail.svelte";
  import io from "socket.io-client";
  import { onMount } from "svelte";

  const socket = io.connect("http://localhost:8899");
  $: currentConvo = $profile.conversations.find(
    convo => convo.email === $activeChat.user.email
  );

  let messageInput;

  onMount(() => {
    setTimeout(() => {
      socket.emit("joinRoom", $activeChat.user.email, $profile.email);
    }, 1000);
  });

  socket.on("privateMessage", data => {
    if (currentConvo === undefined) {
      $profile.conversations = [
        ...$profile.conversations,
        {
          email: $activeChat.user.email,
          chat: []
        }
      ];
      currentConvo = {
        email: $activeChat.user.email,
        chat: []
      };
    }
    console.log("privateMessageEvent", data);

    currentConvo.chat = [
      ...currentConvo.chat,
      {
        message: data.message,
        user: data.user.public_json,
        isMe: data.user._id === $profile._id ? true : false
      }
    ];
  });

  const hideChat = () => {
    socket.emit("exitRoom", $profile.email, $activeChat.user.email);
    $activeChat.show = false;
    $activeChat.user = "";
  };

  const onSendMessage = () => {
    // console.log(messageInput.value);

    if (messageInput.value !== "") {
      socket.emit(
        "message",
        $profile.email,
        $activeChat.user.email,
        messageInput.value
      );
    }
    messageInput.value = "";
  };
</script>

<style>
  section {
    position: fixed;
    bottom: 0px;
    right: 13rem;
    width: 13rem;
    height: 15rem;
    background-color: #fff;
    box-shadow: 2px 1px 23px 6px rgba(0, 0, 0, 0.25);
  }

  .header {
    display: grid;
    grid-template-columns: 3fr 1fr;
    height: 2rem;
    font-size: 0.8rem;
  }
  button {
    outline: none;
    border: none;
  }
  .userName {
    display: grid;
    align-content: center;
    justify-items: start;
    padding-left: 1rem;
  }

  .send_container {
    position: absolute;
    bottom: 5px;
    display: grid;
    grid-template-columns: 3fr 1fr;
  }
  .message_container {
    margin: auto;
    height: 10rem;
    width: 10rem;
    overflow: scroll;
  }
  .scroll {
    overflow: hidden;
  }
</style>

{#if $activeChat.show}
  <section class="chatFriend">
    <div class="header">
      <div class="userName">{$activeChat.user.first_name}</div>
      <button on:click={hideChat}>❌</button>
    </div>
    <div class="message_container">
      <div class="scroll">
        {#if currentConvo}
          {#each currentConvo.chat as chat}
            <p style={chat.isMe ? 'color: blue;' : 'color: red;'}>
              {chat.message}
            </p>
          {/each}
        {:else}
          <p>No messages</p>
        {/if}
      </div>
    </div>
    <div class="send_container">
      <input type="text" bind:this={messageInput} />
      <button on:click={onSendMessage}>Send</button>
    </div>
  </section>
{/if}
