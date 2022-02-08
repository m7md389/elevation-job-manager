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
    cohortId: user.cohortId
  });
};

export const addAdmin = async (admin) => {
  const apiEndpoint = "/users/admin";
  return http.post(apiEndpoint, {
    name: admin.name,
    email: admin.email,
    password: admin.password
  });
};

export const verifyUser = async (emailToken) => {
  const apiEndpoint = "/users/verify";
  return http.put(apiEndpoint + `/${emailToken}`);
};

export default { register, addAdmin, verifyUser };
