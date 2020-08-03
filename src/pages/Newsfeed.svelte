<script>
  import Navbar from "../components/Navbar.svelte";
  import ChatContainer from "../components/ChatContainer.svelte";
  import PostsContainer from "../components/PostsContainer.svelte";
  import ChatFriends from "../components/ChatFriends.svelte";
  import { profile, posts, contacts, activeChat } from "./../store";
  import { getRequest } from "./../utils/getRequest";
  import { onMount } from "svelte";

  const getContacts = async () => {
    let response = await getRequest("/users/contacts");
    $contacts = response.response;
  };

  onMount(async () => {
    let responseProfile = await getRequest("/users/profile");
    $profile = responseProfile.user;
    let responsePosts = await getRequest("/posts");
    $posts = responsePosts.response;
    // console.log(responsePosts.response);
    getContacts();
    setInterval(() => {
      getContacts();
    }, 5000);
  });
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100vw;
    height: calc(100vh - 3rem);
    margin-top: 3rem;
  }
</style>

<!-- #################################################### -->
<main>
  <Navbar />
  <div class="container">
    <div />
    <PostsContainer />
    <ChatFriends />
  </div>
  {#if $activeChat.show}
    <ChatContainer />
  {/if}
</main>
