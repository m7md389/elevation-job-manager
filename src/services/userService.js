import http from "./httpService";

const apiUrl = "http://localhost:3001/api";

export const register = (user) => {
  const apiEndpoint = apiUrl + "/users";

  return http.post(apiEndpoint, {
    name: user.name,
    email: user.email,
    password: user.password,
    phone: user.phone,
    city: user.city,
    linkedin: user.linkedin,
    status: user.status,
    course: user.course,
    cohort: user.cohort
  });
};

export default { register };
