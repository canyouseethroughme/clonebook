<script>
  import Navbar from "../components/Navbar.svelte";
  import { profile } from "../store.js";
  import { putRequest } from "./../utils/putRequest.js";
  import { deleteRequest } from "./../utils/deleteRequest.js";

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

  const onDelete = async () => {
    let response = await deleteRequest("/users/delete-profile", $profile._id);
    if (response.status === 1) {
      localStorage.clear();
      window.location.href = "/";
    }
  };
</script>

<style>
  .container {
    position: absolute;
    height: 25rem;
    width: 20rem;
    top: 10rem;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
  }
  .image_cropper {
    width: 20rem;
    height: 20rem;
    clip-path: circle(50% at 50% 50%);
    text-align: center;
  }
  img {
    height: 100%;
    width: auto;
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
    <button
      class="bg-red-600 hover:bg-red-500 rounded-sm w-20 text-white h-8 mt-8
      w-64 shadow-md rounded-sm"
      on:click={onDelete}>
      Delete profile
    </button>

  </div>

</main>
