import axios from "axios";
const apiUrl = `http://localhost:3001`;

const apiEndpoint = `${apiUrl}/courses`;

export const getCourseDetails = async (courseName) => {
  try {
    const courseDetails = await axios.get(apiEndpoint + "/" + courseName);

    if (courseDetails.data.error) {
      return { error: "something went wrong" };
    }
    return courseDetails.data;
  } catch (error) {
    return "error";
  }
};

export default {
  getCourseDetails
};
