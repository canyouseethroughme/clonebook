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
    textareaDescription.value = "";
    let response = await postRequest("/posts", form);

    $posts = [response.response, ...$posts];
  };
</script>

<style>
  .create_post {
    width: 40rem;
    height: 6rem;
    position: absolute;
    top: 4rem;
    right: 28rem;
    display: flex;
    border-radius: 20px;
    box-shadow: 2px 1px 23px 6px rgba(0, 0, 0, 0.25);
  }
  .posts {
    position: absolute;
    top: 12rem;
    right: 28rem;
  }
  .wrapper {
    margin: auto;
    display: flex;
  }
  .create_post_button {
    display: flex;
    align-items: center;
  }
  textarea {
    resize: none;
    height: 2rem;
    width: 24rem;
    border: 1px solid grey;
    border-radius: 20px;
    padding-left: 10px;
    padding-top: 3px;
    outline: none;
  }
</style>

<div>
  <div class="create_post">
    <div class="wrapper">
      <textarea
        name="description"
        placeholder="What's on your mind?"
        bind:this={textareaDescription} />
      <div class="create_post_button">
        <p
          class="ml-2"
          on:click={() => hiddenImageInput.click()}
          style="cursor: pointer">
          Add picture 📷
        </p>
        <input
          bind:this={hiddenImageInput}
          accept="image/*"
          type="file"
          style="display: none"
          alt="hiddenFile"
          on:change={e => selectImage(e)} />
        <button
          on:click={onPost}
          class="bg-green-600 hover:bg-green-500 rounded-sm w-16 text-white h-6
          ml-2 shadow-md rounded-sm">
          Post
        </button>
      </div>
    </div>
  </div>
  <div class="posts">
    {#each $posts as post}
      <Post {post} />
    {/each}
  </div>
</div>
