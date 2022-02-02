import React, { useState } from "react";
import "../styles/course.css";

function Course(props) {

  const course = props.course;

  return (
    <div
      className="course"
      style={{
        backgroundColor: `#ffc2cd`,
        borderRadius: "16px",
        padding: "10px"
      }}
    >
      {/* data should come from mobx */}
      {/* <progress max="100" value="80"></progress> */}
      <div className="processBar" style={{width: `${Math.round(course.working) || 0}%`}}>{Math.round(course.working) || 0}%</div>
      <div className="course-data">
        <div className="course-name">{course.title} </div>
        <div className="info">
          <p>
            students :{" "}
            <span style={{ fontWeight: "bold" }}>{course.studNum}</span>
          </p>
          <p>
            working : <span>{ Math.round(course.working) || 0}%</span>
          </p>
        </div>
        </div>
    </div>
  );
}

export default Course;
