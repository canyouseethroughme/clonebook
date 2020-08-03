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
    }, 100000);
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
</script>

<style>
  img {
    width: 4rem;
  }
  button {
    border: 1px solid black;
  }
</style>

<section>
  <img src={'http://localhost:8899/static/' + post.photo} alt="status" />
  <div>{post.description}</div>
  <p>Likes: {currentPost.likes.length}</p>
  <button on:click={onLikePost}>Like</button>
</section>
