<script>
  import ChatContainer from "./ChatContainer.svelte";
  import PhotoThumbnail from "./PhotoThumbnail.svelte";
  import { contacts, activeChat } from "./../store.js";

  const showChatWindow = (e, contact) => {
    $activeChat.show = false;
    $activeChat.show = true;
    $activeChat.user = contact;
    console.log(contact);
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
    display: grid;
    grid-template-columns: 1fr 3fr;
  }
  div.friend > p {
    justify-self: start;
    align-self: center;
  }
  h4 {
    color: #65676b;
    margin-bottom: 0.7rem;
    font-weight: 200;
    font-size: 0.8rem;
    text-align: start;
  }
</style>

<section>
  <h4>Chat with friends</h4>
  {#each $contacts as contact}
    <div class="friend" on:click={e => showChatWindow(e, contact)}>
      {#if contact.photo == 'https://i.ibb.co/gSbgf9K/male-placeholder.jpg'}
        <PhotoThumbnail photo={contact.photo} contactId={contact._id} />
      {:else}
        <PhotoThumbnail
          photo={'http://localhost:8899/static/' + contact.photo}
          contactId={contact._id} />
      {/if}
      <p>{contact.first_name} {contact.last_name}</p>
    </div>
  {/each}
</section>
