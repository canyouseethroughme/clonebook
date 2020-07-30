<script>
  import page from "page";

  import Login from "./pages/Login.svelte";
  import Newsfeed from "./pages/Newsfeed.svelte";
  import MyProfile from "./pages/MyProfile.svelte";

  // set the default page
  let current = Login;

  page("/", () => (current = Login));
  page("/newsfeed", () => (current = Newsfeed));
  page("/myprofile", () => (current = MyProfile));

  // activate router
  page.start();
</script>

<style>

</style>

<!-- #################################################### -->
<main>
  <svelte:component this={current} />
</main>
