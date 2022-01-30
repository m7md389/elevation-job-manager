import http from "./httpService";

const apiEndpoint = "/cohorts";

export const getCohorts = async () => {
  try {
    const courses = await http.get(apiEndpoint);
    if (courses.data.ex) return { ex: "Something went wrong." };
    return courses.data;
  } catch (ex) {
    return ex;
  }
};

export default { getCohorts };
