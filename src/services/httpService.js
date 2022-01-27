import axios from "axios";

const LOCAL_API_LINK = `http://localhost:3001`;

export const getCourseDetails = async (courseName) => {
  try {
    const routeLink = `${LOCAL_API_LINK}/courses/${courseName}`;
    const courseDetails = await axios.get(routeLink);

    if (courseDetails.data.error) {
      return { error: "something went wrong" };
    }
    return courseDetails.data;
  } catch (error) {
    return "error";
  }
};

export const login = (user) => {};

export default { getCourseDetails };
