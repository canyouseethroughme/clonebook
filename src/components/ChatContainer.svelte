<script>
  import { contacts, activeChat, profile } from "./../store";
  import PhotoThumbnail from "./PhotoThumbnail.svelte";
  import io from "socket.io-client";
  import { onMount } from "svelte";
  // console.log($activeChat);
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
    // from, message, timestamp
    currentConvo.chat = [
      ...currentConvo.chat,
      {
        message: data.message,
        user: data.user.public_json,
        isMe: data.user._id === $profile._id ? true : false
      }
    ];
    // currentFriend.chat = [}
    //   ...currentFriend.chat,
    //   {
    //     isMe: data.from === $profile._id ? true : false,
    //     message: data.message,
    //     timestamp: data.timestamp
    //   }
    // ];
    // if (data.from === $profile._id) {
    //   bindInput.value = "";
    // }
    // bindMessagesContainer.scrollTop =
    //   bindMessagesContainer.scrollHeight - bindMessagesContainer.clientHeight;
    // console.log(currentFriend.chat);
  });

  const hideChat = () => {
    socket.emit("exitRoom", $profile.email, $activeChat.user.email);
    $activeChat.show = false;
    $activeChat.user = "";
  };

  const onSendMessage = () => {
    console.log(messageInput.value);

    if (messageInput.value !== "") {
      socket.emit(
        "message",
        $profile.email,
        $activeChat.user.email,
        messageInput.value
      );
    }
    messageInput.value = "";
    // add message to convo if exists
    // if not create convo
  };
</script>

<style>
  section {
    position: fixed;
    bottom: 0px;
    right: 13rem;
    width: 12rem;
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
</style>

{#if $activeChat.show}
  <section class="chatFriend">
    <div class="header">
      <div class="userName" />
      <button on:click={hideChat}>❌</button>
    </div>
    <!-- messages input -->
    <div>
      <PhotoThumbnail
        photo={$activeChat.user.photo}
        contactId={$activeChat.user._id} />
      {$activeChat.user.first_name}
      {#if currentConvo}
        {#each currentConvo.chat as chat}
          <p style={`color: ${chat.isMe ? 'red' : 'blue'};`}>{chat.message}</p>
          <!-- {#if chat.isMe}
            <p>mesaul meu</p>
          {/if} -->
        {/each}
      {:else}
        <p>No messages</p>
      {/if}
    </div>
    <input type="text" bind:this={messageInput} />
    <button on:click={onSendMessage}>Send</button>
  </section>
{/if}
