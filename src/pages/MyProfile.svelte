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
    margin-top: 10rem;
  }
  .image_cropper {
    width: 7.5rem;
    height: 7.5rem;
    clip-path: circle(50% at 50% 50%);
  }
  img {
    height: 15rem;
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
    <p>{$profile.first_name} {$profile.last_name}</p>

    <input
      type="file"
      bind:this={profileImageInput}
      accept="image/*"
      alt="profileFile"
      on:change={e => selectImage(e)} />
    <button on:click={onPost}>Change profile image</button>

  </div>

</main>
