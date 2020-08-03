export const getRequest = async (path, params = {}) => {
  const baseUrl = "http://localhost:8899";
  path = path.concat("?");
  Object.keys(params).forEach((param, i) => {
    return (path = path.concat(param + "=" + params[param] + "&"));
  });
  path = path.slice(0, -1);

  try {
    let response = await fetch(baseUrl + path, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token")
          ? localStorage.getItem("token")
          : "",
      },
    });
    let data = await response.json();
    return data;
  } catch (err) {
    return console.log("Error getting req", err);
  }
};
