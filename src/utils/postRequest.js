export const postRequest = async (path, body) => {
  const baseUrl = "http://localhost:8899";
  try {
    let response = await fetch(baseUrl + path, {
      method: "POST",
      body: body,
      headers: {
        Authorization: localStorage.getItem("token")
          ? localStorage.getItem("token")
          : "",
      },
    });
    let data = await response.json();
    return data;
  } catch (err) {
    return console.log("Error posting req", err);
  }
};
