import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import auth from "../services/authService";
import user from "../services/userService";
import cohort from "../services/cohortService";
import "../styles/login.css";
import Course from "./Course";

const Register = () => {
  let [inputs, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    linkedin: "",
    cohort: "default",
    status: "default"
  });
  let [isdropdownCourseOpened, setIsdropdownCourseOpened] = useState(false);
  let [courses, setCourses] = useState([]);
  const statusOptions = ["Studying", "Searching", "Working"];

  useEffect(async () => {
    const c = await cohort.getCohorts();
    setCourses(c);
  }, []);

  const handleChange = (event) => {
    setInput({ ...inputs, [event.target.id]: event.target.value });
  };

  const doSubmit = async () => {
    try {
      const cohortInput = inputs.cohort.split("@");
      const [cohort, course] = cohortInput;
      const response = await user.register({ ...inputs, cohort, course });
      const token = response.headers["x-auth-token"];
      auth.loginWithToken(token);
      if (auth.getCurrentUser().role === "student")
        window.location = "/student";
      else if (auth.getCurrentUser().role === "admin") window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert(ex.response.data);
      }
    }
  };

  if (auth.getCurrentUser()) return <Navigate to="/" />;

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent" className="register-content">
        <div className="title">
          <h4 className="fadeIn first">Register</h4>
        </div>

        <div className="form">
          <div className="register-inputs-container">
            <input
              type="text"
              placeholder="Name"
              value={inputs.name}
              onChange={handleChange}
              id="name"
              className="input fadeIn second"
            />
            <input
              type="text"
              placeholder="Email"
              value={inputs.email}
              onChange={handleChange}
              id="email"
              className="input fadeIn third"
            />
            <input
              type="password"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
              id="password"
              className="input fadeIn fourth"
            />
            <input
              type="text"
              placeholder="Phone"
              value={inputs.phone}
              onChange={handleChange}
              id="phone"
              className="input fadeIn fifth"
            />
            <input
              type="text"
              placeholder="City"
              value={inputs.city}
              onChange={handleChange}
              id="city"
              className="input fadeIn sixth"
            />
            <input
              type="text"
              placeholder="LinkedIn"
              value={inputs.linkedin}
              onChange={handleChange}
              id="linkedin"
              className="input fadeIn seventh"
            />
            <select
              className="input fadeIn ninth"
              name="cohort"
              onChange={handleChange}
              id="cohort"
              value={inputs.cohort}
            >
              <option className="default-value" value="default" disabled>
                Cohort
              </option>
              {courses.map((course) => (
                <optgroup
                  key={course.title}
                  label={course.title}
                  value={course.title}
                >
                  {course.cohorts.map((cohort) => (
                    <option
                      key={cohort.name + "@" + course.title}
                      value={cohort.name + "@" + course.title}
                    >
                      {cohort.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select
              className="input fadeIn eleventh"
              name="status"
              onChange={handleChange}
              id="status"
              value={inputs.status}
            >
              <option className="default-value" value="default" disabled>
                Status
              </option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <input
            type="button"
            value="register"
            onClick={doSubmit}
            className="submit fadeIn twelfth"
          />
        </div>

        <div id="formFooter">
          <span>Already registered?</span>
          <Link className="custom-link underlineHover" to="/login">
            <span className="link-text">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
