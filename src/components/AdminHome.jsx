import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Link } from "react-router-dom";
import Course from "./Course";
import "../styles/admin-home.css";
import axios from "axios";

function AdminHome() {
  // const courses = ["Full Stack", "QA", "Course3", "Course4"]; // should come from mobx

  const [courses, setCourses] = useState([])

  useEffect(async () => {
    let res = (await axios.get(`http://localhost:3001/courses/names`)).data;
    setCourses(res);
  }, []);


  return (
    <div className="page-container">
      {courses.map((c, idx) => {
        return (
          <Link to={`/courses/${c.title}`}>
            <Course course={c} />;
          </Link>
        )
      })}
    </div>
  );
}

export default inject()(observer(AdminHome));
