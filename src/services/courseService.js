import http from "./httpService";

const apiEndpoint = `/courses`;

export const getCourseDetails = async (courseName) => {
  try {
    const courseDetails = await http.get(apiEndpoint + "/" + courseName);

    if (courseDetails.data.ex) {
      return { ex: "Something went wrong" };
    }
    return courseDetails.data;
  } catch (ex) {
    return ex;
  }
};

export default {
  getCourseDetails,
};
