<script context="module">
  export const addChatWindow = e => {
    document.querySelector(".userName").innerHTML = e.target.innerHTML;
    showChat();
  };

  export const showChat = () => {
    let chatDisplay = "grid";
    let container = document.querySelector(".chatFriend");
    container.style.display = chatDisplay;
  };
</script>

<script>
  let chatDisplay = "none";

  const hideChat = () => {
    chatDisplay = "none";
    let container = document.querySelector(".chatFriend");
    container.style.display = chatDisplay;
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

<section style="display: {chatDisplay}" class="chatFriend">
  <div class="header">
    <div class="userName" />
    <button on:click={hideChat}>❌</button>
  </div>
</section>
