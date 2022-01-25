import React from "react";
import "../styles/course.css";

function Course(props) {

  const course = props.course
  return (
    <div
      className="course"
      style={{ backgroundColor: `#ccc`, borderRadius: "16px", padding: '10px' }}
    >
      {/* data should come from mobx */}
      {/* <progress max="100" value="80"></progress> */}
      <div className="course-name">{course.title}</div>
      <div className="info">
        <p>
          students : <span style={{ fontWeight: "bold" }}>{course.studNum}</span>
        </p>
        <p>
          working : <span>{course.working}%</span>
        </p>
      </div>
    </div>
  );
}

export default Course;
