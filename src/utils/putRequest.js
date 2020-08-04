export const putRequest = async (path, body) => {
  const baseUrl = "http://localhost:8899";
  try {
    let response = await fetch(baseUrl + path, {
      method: "PUT",
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
    return console.log("Error putting req", err);
  }
};
