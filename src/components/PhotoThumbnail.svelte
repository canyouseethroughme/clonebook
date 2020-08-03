<script>
  import { contacts } from "./../store";
  import { onMount } from "svelte";
  import { getRequest } from "./../utils/getRequest";
  export let photo;
  export let contactId;

  $: currentContact = $contacts.find(user => user._id === contactId);
</script>

<style>
  img {
    width: 2rem;
  }

  span {
    width: 1rem;
    height: 1rem;
    position: absolute;
    border: 2px solid #f0f2f5;
    background-color: #31a34c;
    border-radius: 50%;
  }
</style>

<div>
  <img src={photo} alt="" />
  <span
    style={currentContact && currentContact.token ? 'display: block;' : 'display: none;'} />
</div>
