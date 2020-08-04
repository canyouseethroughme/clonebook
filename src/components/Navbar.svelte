<script>
  import { putRequest } from "./../utils/putRequest.js";
  import { profile } from "./../store.js";
  let ajUsers = [];
  let searchInput = "";

  let searchResultsDisplay = "none";

  const showSearchResults = () => {
    searchResultsDisplay = "grid";
  };

  const hideSearchResults = () => {
    searchResultsDisplay = "none";
  };
  // connect to API and get users
  const getUsers = async () => {
    ajUsers = [];
    let data = [{ name: "Andrei" }];
    ajUsers = data;

    showSearchResults();
  };

  const onSignout = async () => {
    let response = await putRequest("/users/signout", $profile._id);
    if (response.status === 1) {
      localStorage.clear();
      window.location.href = "/";
    }
  };
</script>

<style>
  nav {
    position: fixed;
    top: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    width: 100vw;
    height: 3rem;
    background-color: #fff;
    color: #373737;
    box-shadow: 0px -31px 22px 21px rgba(0, 0, 0, 0.75);
    z-index: 100;
  }

  /* SEARCH CONTAINER */
  div#searchContainer {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 6fr;
    justify-items: start;
    padding-left: 1rem;
  }
  div.signout {
    justify-self: end;
    padding-right: 1rem;
  }
  /* div#containerResults {
    height: 100vh;
    width: 16rem;
    box-shadow: -31px 0px 21px 21px rgba(0, 0, 0, 0.75);
    background-color: #fff;
    position: absolute;
    top: -0.5rem;
  }
  div#searchResults {
    display: grid;
    position: absolute;
    top: -0.5rem;
    z-index: 1;
    width: 90%;
    min-height: 25vh;
    padding-top: 5rem;
    padding-left: 1rem;
    color: #333;
    background-color: #fff;
    font-size: 0.8rem;
  }
  div#userResult {
    height: 2rem;
  } */
  div.logoNav {
    height: 2rem;
    width: 2rem;
  }

  div.logoNav > img {
    height: 100%;
    width: 100%;
  }

  div#iconsContainer {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    justify-items: center;
  }
</style>

<!-- #################################### -->
<nav>
  <div id="searchContainer">
    <div class="logoNav" style="z-index: 10">
      <img src="./fbicon2.png" alt="logo" />
    </div>
    <!-- <form style="z-index: 10">
      <input
        type="text"
        on:input={getUsers}
        on:focus={getUsers}
        on:blur={hideSearchResults}
        bind:value={searchInput}
        placeholder="🔍 Search Clonebook" />

    </form>
    <div id="containerResults" style="display: {searchResultsDisplay}">
      <div id="searchResults" style="display: {searchResultsDisplay}">
        {#each ajUsers as jUser}
          <div id="userResult">{jUser.name} {jUser.lastName}</div>
        {/each}
      </div>
    </div> -->
  </div>
  <div id="iconsContainer">
    <div class="icon">
      <a href="/newsfeed">🏠</a>
    </div>
    <div class="icon">📺</div>
    <div class="icon">🛍️</div>
    <div class="icon">🤼</div>
    <div class="icon">
      <a href="/myprofile">😀</a>
    </div>
  </div>
  <div class="signout">
    <button on:click={onSignout}>Signout {$profile.first_name}</button>
  </div>
</nav>
<!-- #################################### -->
