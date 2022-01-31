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
    cohortId: user.cohort
  });
};

export const addAdmin = async (admin) => {
  const apiEndpoint = "/users/admin";
  return http.post(apiEndpoint, {
    name: admin.name,
    email: admin.email,
    password: admin.password,
    phone: admin.phone
  });
};

export default { register, addAdmin };
