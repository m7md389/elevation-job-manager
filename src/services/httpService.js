import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  // baseURL: "http://localhost:3001/api"
  baseURL: "/api"
});

instance.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("An unexpected error occurred.");
  }

  return Promise.reject(error);
});

const setToken = (token) => {
  instance.defaults.headers.common["x-auth-token"] = token;
};

export default {
  post: instance.post,
  get: instance.get,
  put: instance.put,
  delete: instance.delete,
  setToken
};
