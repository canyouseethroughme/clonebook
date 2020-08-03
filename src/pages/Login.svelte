<script>
  import { postRequest } from "./../utils/postRequest.js";
  import { profile } from "./../store.js";

  let src = "fbicon2.png";

  let emailInput;
  let passwordInput;
  const onLogin = async e => {
    e.preventDefault();
    let form = new FormData();
    form.append("email", emailInput.value);
    form.append("password", passwordInput.value);
    let response = await postRequest("/users/login", form);
    if (response.status === 1) {
      localStorage.setItem("token", response.token);
      $profile = { ...response.user };
      location.href = "/newsfeed";
    }
  };
</script>

<style>
  .login {
    position: absolute;
    right: 2rem;
  }
  .signup {
    display: grid;
  }
  .signup-form {
    display: grid;
  }
</style>

<main class="bg-gray-100">
  <div class="w-screen bg-blue-700 h-12 flex shadow-md">
    <img {src} alt="logo" class="w-10 h-10 ml-6 mt-1" />
    <form on:submit={e => onLogin(e)} class="login self-center">
      <input
        bind:this={emailInput}
        name="email"
        type="email"
        placeholder="Email"
        class="rounded-sm text-gray-700 pl-1 h-6 shadow-md" />
      <input
        bind:this={passwordInput}
        name="password"
        type="password"
        placeholder="Password"
        class="rounded-sm text-gray-700 pl-1 h-6 shadow-md" />
      <button
        type="submit"
        class="bg-blue-800 hover:bg-blue-600 rounded-sm w-20 text-white
        shadow-md">
        Log In
      </button>
    </form>
  </div>
  <div class="flex items-center justify-center w-screen h-auto mt-40">
    <div class="mr-10">
      <h1 class="font-bold text-xl">
        Connect with friends and the world
        <br />
        around you on
        <span class="text-blue-800 font-mono">Clonebook</span>
        .
      </h1>
      <p class="text-lg mt-8">
        👀
        <span class="font-semibold">See photos and updates</span>
        from friends in News Feed.
      </p>
      <p class="text-lg mt-4">
        📤
        <span class="font-semibold">Share whats new in your life</span>
        on your Timeline.
      </p>
    </div>
    <div class="signup">
      <form action="" class="signup-form h-56 w-64">
        <input
          type="text"
          placeholder="First name"
          class="h-8 pl-1 shadow-md w-auto rounded-sm" />
        <input
          type="text"
          placeholder="Last name"
          class="h-8 pl-1 shadow-md w-auto rounded-sm" />
        <input
          type="email"
          placeholder="Email"
          class="h-8 pl-1 shadow-md w-auto rounded-sm" />
        <input
          type="password"
          placeholder="Password"
          class="h-8 pl-1 shadow-md w-auto rounded-sm" />
        <button
          class="bg-green-600 hover:bg-green-500 rounded-sm w-20 text-white h-8
          mt-4 w-64 shadow-md rounded-sm">
          Sign Up
        </button>
      </form>
    </div>
  </div>
</main>
