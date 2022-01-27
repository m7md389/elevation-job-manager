import axios from "axios";

const apiUrl = "http://localhost:3001/api";

export const login = (email, password) => {
  const apiEndpoint = apiUrl + "/auth";

  try {
    const routeLink = `${apiEndpoint}`;
    axios.post(routeLink, {
      body: { email, password }
    });
  } catch (error) {
    return "error";
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const register = (user) => {
  const apiEndpoint = apiUrl + "/users";

  axios.post(apiEndpoint, {
    body: {
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      city: user.city,
      linkedin: user.linkedin,
      status: user.status,
      course: user.course,
      cohort: user.cohort
    }
  });
};

export const isLogin = () => {
  return false;
};

export default { login, logout, register, isLogin };
