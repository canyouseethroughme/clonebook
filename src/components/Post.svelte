<script>
  import { posts, profile } from "./../store";
  import { postRequest } from "./../utils/postRequest";
  import { getRequest } from "./../utils/getRequest";
  import { onMount } from "svelte";

  export let post;

  $: currentPost = $posts.find(item => item._id === post._id);

  onMount(() => {
    setInterval(() => {
      onGetLikes();
      getLikedNotLiked();
    }, 1000);
  });

  const onGetLikes = async () => {
    let response = await getRequest("/posts/likes", {
      post_id: currentPost._id
    });
    if (currentPost.likes.length !== response.response.length) {
      currentPost.likes = response.response;
    }
  };

  const onLikePost = async () => {
    const myLike = currentPost.likes.find(
      like => like.user_id === $profile._id
    );
    let form = new FormData();
    form.append("post_id", post._id);

    if (myLike === undefined) {
      currentPost.likes = [
        ...currentPost.likes,
        {
          user_id: $profile._id,
          first_name: $profile.first_name,
          last_name: $profile.last_name,
          photo: $profile.photo
        }
      ];
    } else {
      currentPost.likes = currentPost.likes.filter(
        post => post._id === currentPost._id
      );
    }
    let response = await postRequest("/posts/likes", form);
  };

  let userId;
  const getLikedNotLiked = async () => {
    let data = currentPost.likes.map(like => like.user_id);
    // console.log(data);
    while (data.length) {
      userId = data.shift();
    }
    return userId;
  };
</script>

<style>
  .post {
    height: 31rem;
    width: 40rem;
    border-radius: 20px;
    box-shadow: 2px 1px 23px 6px rgba(0, 0, 0, 0.25);
    margin-bottom: 2rem;
  }
  img {
    width: 40rem;
    height: 24rem;
    object-fit: cover;
  }
  button {
    border: 1px solid black;
  }
  .like {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>

<section class="post">
  <p class="pl-4 text-gray-400">{post.user.first_name}'s post</p>
  <p class="pl-4 text-gray-600 text-lg">{post.description}</p>
  <img src={'http://localhost:8899/static/' + post.photo} alt="status" />
  <div class="like">
    {#if userId !== $profile._id}
      <button
        class="ml-4 mt-2 bg-blue-800 hover:bg-blue-600 rounded-sm w-20
        text-white shadow-md"
        style="justify-self: start"
        on:click={onLikePost}>
        Like
      </button>
    {:else}
      <button
        class="ml-4 mt-2 bg-transparent border border-gray-100 hover:bg-blue-600
        rounded-sm w-20 text-gray-400 shadow-md"
        style="justify-self: start"
        on:click={onLikePost}>
        Dislike
      </button>
    {/if}
    <p class="mr-4 mt-2 text-gray-600" style="justify-self: end">
      Likes:
      <span class="font-bold text-gray-400">{currentPost.likes.length}</span>
    </p>
  </div>
</section>
