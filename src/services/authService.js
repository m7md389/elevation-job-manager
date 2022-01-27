import axios from "axios";

const apiUrl = `http://localhost:3001`;
const apiEndpoint = apiUrl + "/users";

export const login = (user) => {
  return axios.post(apiEndpoint, {
    email: user.email,
    password: user.password
  });
};

export const logout = () => {};

export const register = async (user) => {
  let register = await axios.post(apiEndpoint, {
    name: user.name,
    email: user.email,
    password: user.password,
    name: user.name,
    phone: user.phone,
    city: user.city,
    linkedin: user.linkedin,
    course: user.course,
    cohort: user.cohort,
    status: user.status
  });
  console.log("hiiii");
  console.log(user);
  console.log(register);
  return register;
};

export const isLogin = () => {
  return false;
};

export default { login, logout, register, isLogin };
