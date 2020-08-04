<script>
  import { contacts } from "./../store";
  import { onMount } from "svelte";
  import { getRequest } from "./../utils/getRequest";
  export let photo;
  export let contactId;

  $: currentContact = $contacts.find(user => user._id === contactId);
</script>

<style>
  .container {
    position: relative;
  }
  .image_cropper {
    width: 30px;
    height: 30px;
    clip-path: circle(50% at 50% 50%);
  }
  img {
    width: auto;
    height: 100%;
  }

  span {
    width: 10px;
    height: 10px;
    position: absolute;
    top: 1rem;
    border: 1px solid #31a34c;
    background-color: #31a34c;
    border-radius: 50%;
  }
</style>

<div class="container">
  <div class="image_cropper">
    <img src={photo} alt="profile" />
  </div>
  <span
    style={currentContact && currentContact.token ? 'display: block;' : 'display: none;'} />
</div>
