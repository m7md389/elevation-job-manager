import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import http from "./httpService";

const apiEndpoint = "/auth";
const cookies = new Cookies();
const tokenKey = "token";

export const login = async (email, password) => {
  const { data: token } = await http.post(apiEndpoint, {
    email,
    password
  });
  cookies.set(tokenKey, token, { path: "/" });
};

export const loginWithToken = (token) => {
  cookies.set(tokenKey, token, { path: "/" });
};

export const logout = () => {
  cookies.remove(tokenKey, { path: "/" });
};

export const getCurrentUser = () => {
  try {
    const token = cookies.get(tokenKey);
    return jwtDecode(token);
  } catch (ex) {
    return null;
  }
};

export const getToken = () => {
  return cookies.get("token");
};

http.setToken(getToken());

export default { login, loginWithToken, logout, getCurrentUser, getToken };
