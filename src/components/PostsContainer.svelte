<script>
  import { posts } from "./../store.js";
  import Post from "./Post.svelte";
  import { postRequest } from "./../utils/postRequest.js";

  let hiddenImageInput;
  let textareaDescription;
  let imageFile;

  const selectImage = e => {
    imageFile = e.target.files[0];
  };

  const onPost = async () => {
    let form = new FormData();
    form.append("description", textareaDescription.value);
    form.append("photo", imageFile);

    let response = await postRequest("/posts", form);

    $posts = [response.response, ...$posts];
  };
</script>

<style>

</style>

<div>
  <div>

    <textarea
      name="description"
      placeholder="What's on your mind?"
      bind:this={textareaDescription} />
    <input
      bind:this={hiddenImageInput}
      accept="image/*"
      type="file"
      alt="hiddenFile"
      on:change={e => selectImage(e)} />
    <button on:click={onPost}>Send</button>
  </div>
  <div>
    {#each $posts as post}
      <Post {post} />
    {/each}
  </div>
</div>
