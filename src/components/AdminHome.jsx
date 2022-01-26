import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Link } from "react-router-dom";
import Course from "./Course";
import "../styles/admin-home.css";
import axios from "axios";
import Title from "./common/Title";

function AdminHome() {
  // const courses = ["Full Stack", "QA", "Course3", "Course4"]; // should come from mobx

  const [courses, setCourses] = useState([]);

  useEffect(async () => {
    let res = (await axios.get(`http://localhost:3001/courses/names`)).data;
    setCourses(res);
  }, []);

  return (
    <div>
      <Title text="Home Page" />

      <div className="page-container">
        {courses.map((course) => (
          <Link key={course.title} to={`/courses/${course.title}`}>
            <Course course={course} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default inject()(observer(AdminHome));
