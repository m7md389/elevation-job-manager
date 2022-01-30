import http from "./httpService";

export const register = async (user) => {
  const apiEndpoint = "/temp-users";
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
