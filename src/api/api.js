import axios from "axios";

const baseURL = "https://mvrpharma.com/api/";

export async function loginUser({ email, password }) {
  return await axios
    .post(baseURL + "login", {
      email,
      password,
    })
    .catch(() => {});
}

export async function get(urls, token) {
  return await axios
    .get(baseURL + urls, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(() => {});
}

export async function post(urls, token, products) {
  return await axios
    .post(baseURL + urls, products, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(() => {});
}
