import axios from "axios";

const apiUrl = `http://localhost:3001`;

export const getCourseDetails = async (courseName) => {
  try {
    const apiEndpoint = `${apiUrl}/courses/${courseName}`;
    const courseDetails = await axios.get(apiEndpoint);

    if (courseDetails.data.error) {
      return { error: "something went wrong" };
    }
    return courseDetails.data;
  } catch (error) {
    return "error";
  }
};

export const login = (user) => {
  try {
    const apiEndpoint = `${apiUrl}/??`;
    axios.post(apiEndpoint, {
      body: {
        email: user.email,
        password: user.password
      }
    });
  } catch (error) {
    return "error";
  }
};

export default { getCourseDetails };
