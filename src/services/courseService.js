import http from "./httpService";
const apiUrl = `http://localhost:3001`;

// const apiEndpoint = `${apiUrl}/courses`;

export const getCourseDetails = async (courseName) => {
  try {
    const apiEndpoint = "/courses";
    const courseDetails = await http.get(apiEndpoint + "/" + courseName);

    if (courseDetails.data.ex) {
      return { ex: "Something went wrong" };
    }
    return courseDetails.data;
  } catch (ex) {
    return ex;
  }
};

export const getCourses = async () => {
  try {
    const apiEndpoint = "/courses";
    const courses = await http.get();

    if (courses.data.ex) {
      return { ex: "Something went wrong." };
    }
  } catch (ex) {
    return ex;
  }
};

export default {
  getCourseDetails,
};
