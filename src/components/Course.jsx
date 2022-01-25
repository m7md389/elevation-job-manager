import React from "react";
import "../styles/course.css";

function Course(props) {
  return (
    <div
      className="course"
      style={{ backgroundColor: `#${props.color}`, borderRadius: "16px" }}
    >
      {/* data should come from mobx */}
      {/* <progress max="100" value="80"></progress> */}
      <div className="course-name">{props.name}</div>
      <div className="info">
        <p>
          students : <span style={{ fontWeight: "bold" }}>20</span>
        </p>
        <p>
          working : <span>50%</span>
        </p>
      </div>
    </div>
  );
}

export default Course;
