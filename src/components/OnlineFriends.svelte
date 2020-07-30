<script>
  import ChatContainer, {
    addChatWindow,
    showChat
  } from "./ChatContainer.svelte";

  let ajFriends = [
    { id: 1, name: "Andrei", lastName: "Stefan" },
    { id: 2, name: "Ciprian", lastName: "Celmare" },
    { id: 3, name: "Razvan", lastName: "Mihai" },
    { id: 4, name: "Alex", lastName: "Tentea" },
    { id: 5, name: "Dru", lastName: "Klein" },
    { id: 6, name: "Alin", lastName: "Chiosa" },
    { id: 7, name: "Petru", lastName: "Frasila" }
  ];

  const showChatWindow = e => {
    addChatWindow(e);
  };
</script>

<style>
  section {
    position: fixed;
    top: 0px;
    right: 0px;
    width: 12rem;
    height: 100%;
    background: transparent;
    padding-top: 5rem;
    font-size: 0.7rem;
  }

  div.friend {
    cursor: pointer;
    margin-bottom: 0.6rem;
  }
  h4 {
    color: #65676b;
    margin-bottom: 0.7rem;
    font-weight: 200;
    font-size: 0.8rem;
  }
</style>

<section>
  <h4>Chat with friends</h4>
  {#each ajFriends as jFriend}
    <div class="friend" on:click={e => showChatWindow(e)} on:focus={showChat}>
      {jFriend.name} {jFriend.lastName}
    </div>
  {/each}
</section>
