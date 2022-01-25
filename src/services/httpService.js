import axios from 'axios';

const LOCAL_API_LINK = `http://localhost:3001`;

export const getCourseDetails = async (courseId) => {
    const routeLink = `${LOCAL_API_LINK}/courses/${courseId}`;
    const courseDetails = await axios.get(routeLink);

    if (courseDetails.data.error) {
        return { error: "something went wrong" }
    }
    return courseDetails.data;
}

export default { getCourseDetails }