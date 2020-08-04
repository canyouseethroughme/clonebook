<script>
  import Navbar from "../components/Navbar.svelte";
  import { profile } from "../store.js";
  import { putRequest } from "./../utils/putRequest.js";

  let profileImageInput;
  let imageFile;
  const selectImage = e => {
    imageFile = e.target.files[0];
  };

  const onPost = async () => {
    let form = new FormData();
    form.append("photo", imageFile);

    let response = await putRequest("/users/change-profile-image", form);

    $profile.photo = response.updatedProfileImage.photo;
  };
</script>

<style>
  .container {
    position: absolute;
    height: 20rem;
    width: 20rem;
    top: 10rem;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
  }
  .image_cropper {
    width: 10rem;
    height: 10rem;
    clip-path: circle(50% at 50% 50%);
    margin: auto;
  }
  img {
    object-fit: cover;
    height: 20rem;
  }
</style>

<!-- #################################################### -->
<main>
  <Navbar />
  <div class="container">
    <div class="image_cropper">
      {#if $profile.photo != 'https://i.ibb.co/gSbgf9K/male-placeholder.jpg'}
        <img
          src={'http://localhost:8899/static/' + $profile.photo}
          alt="profile" />
      {:else}
        <img
          src={'https://i.ibb.co/gSbgf9K/male-placeholder.jpg'}
          alt="profile" />
      {/if}
    </div>
    <p class="mt-2">
      <span class="text-gray-400">Name:</span>
      {$profile.first_name} {$profile.last_name}
    </p>
    <p class="mt-2">
      <span class="text-gray-400">Email:</span>
      {$profile.email}
    </p>
    <p
      class="mt-2"
      on:click={() => profileImageInput.click()}
      style="cursor: pointer">
      📷 Change profile picture
    </p>
    <input
      type="file"
      bind:this={profileImageInput}
      style="display: none"
      accept="image/*"
      alt="profileFile"
      on:change={e => selectImage(e)} />
    <button
      class="bg-green-600 hover:bg-green-500 rounded-sm w-20 text-white h-8 mt-4
      w-64 shadow-md rounded-sm"
      on:click={onPost}>
      Save
    </button>

  </div>

</main>
