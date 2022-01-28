import axios from "axios";
// import logger from ("./logService")
import auth from "./authService";
import { toast } from "react-toastify";

axios.defaults.headers.common["x-auth-token"] = auth.getToken();

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log(error);
    toast.error("An unexpected error occurred.");
  }

  return Promise.reject(error);
});

export default {
  post: axios.post,
  get: axios.get,
  put: axios.put,
  delete: axios.delete
};
